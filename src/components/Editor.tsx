import { useState } from 'react';
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
}

const Editor = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState([5]);
  const [animationType, setAnimationType] = useState('subtle');
  const [transition, setTransition] = useState('fade');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: Photo[] = Array.from(files).map((file) => ({
      id: Math.random().toString(),
      url: URL.createObjectURL(file),
      name: file.name
    }));

    if (photos.length + newPhotos.length > 3) {
      toast.error('Демо версия: максимум 3 фото');
      return;
    }

    setPhotos([...photos, ...newPhotos]);
    toast.success(`Загружено ${newPhotos.length} фото`);
  };

  const removePhoto = (id: string) => {
    setPhotos(photos.filter(p => p.id !== id));
  };

  const handleGenerate = () => {
    if (photos.length === 0) {
      toast.error('Загрузите хотя бы одно фото');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          toast.success('Видео готово!');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
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
                  <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
                    <Icon name="ImagePlus" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">Перетащите фото сюда или нажмите кнопку выше</p>
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
                <h2 className="text-xl font-bold mb-4">Превью</h2>
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                  {isProcessing ? (
                    <div className="text-center space-y-4 w-full px-8">
                      <Icon name="Loader2" size={48} className="mx-auto animate-spin text-primary" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium">Создаём видео...</p>
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-muted-foreground">{progress}%</p>
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
