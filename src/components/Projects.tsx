import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const mockProjects = [
  {
    id: '1',
    title: 'Семейный альбом 2024',
    createdAt: '2 часа назад',
    duration: '45 сек',
    photos: 8,
    status: 'ready',
    thumbnail: '👨‍👩‍👧‍👦'
  },
  {
    id: '2',
    title: 'Отпуск в горах',
    createdAt: 'Вчера',
    duration: '1:20',
    photos: 15,
    status: 'processing',
    thumbnail: '⛰️'
  },
  {
    id: '3',
    title: 'Портфолио',
    createdAt: '3 дня назад',
    duration: '55 сек',
    photos: 10,
    status: 'ready',
    thumbnail: '📸'
  }
];

const Projects = () => {
  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Мои проекты</h1>
            <p className="text-muted-foreground">Все ваши созданные видео в одном месте</p>
          </div>
          <Button className="gradient-primary border-0">
            <Icon name="Plus" size={20} className="mr-2" />
            Новый проект
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project, index) => (
            <Card
              key={project.id}
              className="glass border-border hover:border-primary/50 transition-all group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-8xl relative overflow-hidden rounded-t-xl">
                {project.thumbnail}
                {project.status === 'processing' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Icon name="Loader2" size={32} className="text-white animate-spin mx-auto" />
                      <p className="text-white text-sm">Обработка...</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  {project.status === 'ready' ? (
                    <Badge className="bg-green-500/90 text-white">
                      <Icon name="Check" size={12} className="mr-1" />
                      Готово
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Icon name="Clock" size={12} className="mr-1" />
                      В процессе
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.createdAt}</p>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Icon name="Clock" size={14} />
                    <span>{project.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Image" size={14} />
                    <span>{project.photos} фото</span>
                  </div>
                </div>

                {project.status === 'ready' && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Icon name="Play" size={16} className="mr-1" />
                      Просмотр
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Icon name="Download" size={16} className="mr-1" />
                      Скачать
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
