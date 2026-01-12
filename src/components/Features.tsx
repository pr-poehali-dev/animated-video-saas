import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: 'Wand2',
    title: 'AI анимация',
    description: 'Автоматическое оживление лиц и объектов на фото с помощью нейросетей'
  },
  {
    icon: 'Music',
    title: 'Музыка и звук',
    description: 'Загружайте свою музыку или выбирайте из библиотеки AI-подобранных треков'
  },
  {
    icon: 'Sparkles',
    title: 'Эффекты и переходы',
    description: 'Плавные переходы между кадрами и профессиональные визуальные эффекты'
  },
  {
    icon: 'Zap',
    title: 'Быстрая обработка',
    description: 'Создание видео занимает всего 2-3 минуты благодаря облачным вычислениям'
  },
  {
    icon: 'Settings',
    title: 'Гибкие настройки',
    description: 'Настраивайте длительность, тип движений, интенсивность анимации'
  },
  {
    icon: 'Download',
    title: 'Экспорт в HD',
    description: 'Скачивайте готовые видео в высоком качестве без потери детализации'
  }
];

const Features = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Всё что нужно для создания{' '}
            <span className="gradient-text">видео-шедевров</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Профессиональные инструменты в простом интерфейсе
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="glass border-border hover:border-primary/50 transition-all hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Icon name={feature.icon as any} size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
