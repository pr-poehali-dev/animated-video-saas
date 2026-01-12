import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface GalleryProps {
  showAll?: boolean;
}

const examples = [
  {
    title: 'Семейный альбом',
    duration: '45 сек',
    photos: 8,
    thumbnail: '🎭'
  },
  {
    title: 'Путешествие в Париж',
    duration: '1:20',
    photos: 15,
    thumbnail: '🗼'
  },
  {
    title: 'День рождения',
    duration: '30 сек',
    photos: 5,
    thumbnail: '🎂'
  },
  {
    title: 'Портретная серия',
    duration: '55 сек',
    photos: 10,
    thumbnail: '📸'
  },
  {
    title: 'Природа и пейзажи',
    duration: '1:10',
    photos: 12,
    thumbnail: '🏔️'
  },
  {
    title: 'Свадебные моменты',
    duration: '2:00',
    photos: 20,
    thumbnail: '💍'
  }
];

const Gallery = ({ showAll = false }: GalleryProps) => {
  const displayExamples = showAll ? examples : examples.slice(0, 3);

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            {showAll ? 'Все примеры работ' : 'Галерея '}
            <span className="gradient-text">примеров</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Посмотрите, что создали другие пользователи
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayExamples.map((example, index) => (
            <Card
              key={index}
              className="glass border-border overflow-hidden group cursor-pointer hover:border-primary/50 transition-all hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-8xl relative overflow-hidden">
                {example.thumbnail}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon name="Play" size={32} className="text-white" />
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-lg">{example.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Icon name="Clock" size={14} />
                    <span>{example.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Image" size={14} />
                    <span>{example.photos} фото</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
