import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Photo {
  id: string;
  url: string;
  name: string;
  file?: File;
  s3Url?: string;
}

const UPLOAD_API = 'https://functions.poehali.dev/ddcb5c35-3e04-44df-bde7-5315313e9aba';
const GENERATE_VIDEO_API = 'https://functions.poehali.dev/6db7685b-2938-4e77-83f4-3ed428cc994e';

const Editor = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState([5]);
  const [animationType, setAnimationType] = useState('subtle');
  const [transition, setTransition] = useState('fade');
  const [isDragging, setIsDragging] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList | File[]) => {
    const newPhotos: Photo[] = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .map((file) => ({
        id: Math.random().toString(),
        url: URL.createObjectURL(file),
        name: file.name,
        file: file
      }));

    if (photos.length + newPhotos.length > 3) {
      toast.error('Демо версия: максимум 3 фото');
      return;
    }

    setPhotos([...photos, ...newPhotos]);
    toast.success(`Загружено ${newPhotos.length} фото`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    processFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const removePhoto = (id: string) => {
    setPhotos(photos.filter(p => p.id !== id));
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
    toast.success('🎬 Воспроизведение видео (демо)');
    setTimeout(() => {
      setIsPlaying(false);
      toast.success('Видео завершено');
    }, 3000);
  };

  const handleDownloadVideo = () => {
    if (!videoPreview) return;
    
    const link = document.createElement('a');
    link.href = videoPreview;
    link.download = `video-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Превью скачано!');
  };

  const uploadPhotoToS3 = async (photo: Photo): Promise<string> => {
    if (photo.s3Url) return photo.s3Url;
    if (!photo.file) throw new Error('No file data');

    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(photo.file!);
    });

    const response = await fetch(UPLOAD_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: base64,
        fileName: photo.name
      })
    });

    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    return data.url;
  };

  const generateVideoPreview = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('Canvas context not available');
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><rect fill="%239b87f5" width="1280" height="720"/></svg>';
      }

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#9b87f5');
      gradient.addColorStop(0.5, '#D946EF');
      gradient.addColorStop(1, '#F97316');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Видео из ${photos.length} фото`, canvas.width / 2, canvas.height / 2 - 30);
      ctx.font = '24px system-ui, sans-serif';
      ctx.fillText(`${duration[0]}с · ${animationType} · ${transition}`, canvas.width / 2, canvas.height / 2 + 30);

      const dataUrl = canvas.toDataURL('image/png');
      console.log('Canvas generated, data URL length:', dataUrl.length);
      return dataUrl;
    } catch (error) {
      console.error('Canvas generation failed:', error);
      return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><rect fill="%239b87f5" width="1280" height="720"/><text x="640" y="360" text-anchor="middle" fill="white" font-size="48">Видео готово</text></svg>';
    }
  };

  const handleGenerate = async () => {
    if (photos.length === 0) {
      toast.error('Загрузите хотя бы одно фото');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setVideoPreview('');

    try {
      setProgress(10);
      toast.info('Загружаю фото в облако...');

      const uploadedPhotos = await Promise.all(
        photos.map(async (photo) => {
          const s3Url = await uploadPhotoToS3(photo);
          return { url: s3Url, name: photo.name };
        })
      );

      setProgress(40);
      toast.info('Создаю видео...');

      const response = await fetch(GENERATE_VIDEO_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photos: uploadedPhotos,
          duration: duration[0],
          animationType: animationType,
          transition: transition
        })
      });

      if (!response.ok) throw new Error('Video generation failed');

      setProgress(70);
      const data = await response.json();

      setProgress(100);
      setVideoPreview(data.preview_url);
      toast.success('Видео готово!');

    } catch (error) {
      console.error('Video generation error:', error);
      toast.error('Ошибка создания видео');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Редактор видео</h1>
          <p className="text-muted-foreground">Создайте анимированное видео из ваших фотографий</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Фотографии ({photos.length}/3)</h2>
                  <label htmlFor="file-upload">
                    <Button asChild className="cursor-pointer">
                      <span>
                        <Icon name="Upload" size={18} className="mr-2" />
                        Загрузить
                      </span>
                    </Button>
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                {photos.length === 0 ? (
                  <div 
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
                      isDragging 
                        ? 'border-primary bg-primary/10 scale-105' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icon 
                      name="ImagePlus" 
                      size={48} 
                      className={`mx-auto mb-4 transition-colors ${
                        isDragging ? 'text-primary' : 'text-muted-foreground'
                      }`} 
                    />
                    <p className="text-muted-foreground mb-2 font-medium">
                      {isDragging ? 'Отпустите для загрузки' : 'Перетащите фото сюда или кликните'}
                    </p>
                    <p className="text-sm text-muted-foreground">Поддерживаются JPG, PNG (макс. 3 фото)</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removePhoto(photo.id)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Icon name="X" size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Превью</h2>
                  {videoPreview && <span className="text-xs text-green-500">✓ Готово</span>}
                </div>
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center overflow-hidden relative">
                  {isProcessing ? (
                    <div className="text-center space-y-4 w-full px-8">
                      <Icon name="Loader2" size={48} className="mx-auto animate-spin text-primary" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium">Создаём видео...</p>
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-muted-foreground">{progress}%</p>
                      </div>
                    </div>
                  ) : videoPreview && videoPreview.length > 0 ? (
                    <div className="relative w-full h-full group">
                      <img 
                        src={videoPreview} 
                        alt="Video preview" 
                        className={`w-full h-full object-cover transition-all duration-300 ${isPlaying ? 'scale-105' : ''}`}
                      />
                      {isPlaying && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Icon name="Play" size={64} className="text-white animate-pulse" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          size="lg" 
                          className="gradient-primary border-0"
                          onClick={handlePlayVideo}
                          disabled={isPlaying}
                        >
                          <Icon name={isPlaying ? "Pause" : "Play"} size={24} className="mr-2" />
                          {isPlaying ? 'Воспроизведение...' : 'Воспроизвести'}
                        </Button>
                      </div>
                      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={handleDownloadVideo}
                        >
                          <Icon name="Download" size={16} className="mr-1" />
                          Скачать
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Icon name="Film" size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Превью появится после генерации</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass border-border">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-bold mb-3">Длительность кадра</h3>
                  <div className="space-y-3">
                    <Slider
                      value={duration}
                      onValueChange={setDuration}
                      min={3}
                      max={10}
                      step={1}
                    />
                    <p className="text-sm text-muted-foreground text-center">{duration[0]} секунд</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-3">Тип анимации</h3>
                  <Select value={animationType} onValueChange={setAnimationType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subtle">Тонкая</SelectItem>
                      <SelectItem value="medium">Средняя</SelectItem>
                      <SelectItem value="dynamic">Динамичная</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="font-bold mb-3">Переходы</h3>
                  <Select value={transition} onValueChange={setTransition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fade">Плавное затухание</SelectItem>
                      <SelectItem value="slide">Слайд</SelectItem>
                      <SelectItem value="zoom">Зум</SelectItem>
                      <SelectItem value="dissolve">Растворение</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Icon name="Music" size={18} />
                    Музыка
                  </h3>
                  <Button variant="outline" className="w-full">
                    <Icon name="Upload" size={18} className="mr-2" />
                    Загрузить трек
                  </Button>
                </div>

                <Button 
                  className="w-full gradient-primary border-0 py-6 text-lg"
                  onClick={handleGenerate}
                  disabled={isProcessing || photos.length === 0}
                >
                  {isProcessing ? (
                    <>
                      <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                      Обработка...
                    </>
                  ) : (
                    <>
                      <Icon name="Sparkles" size={20} className="mr-2" />
                      Создать видео
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;