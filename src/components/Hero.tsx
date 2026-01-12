import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="inline-block">
            <span className="px-4 py-2 rounded-full glass text-sm font-medium">
              🎬 AI-powered видео из фото
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Оживите свои{' '}
            <span className="gradient-text">фотографии</span>
            <br />
            за минуты
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Превращайте обычные фото в завораживающие анимированные видео 
            с помощью искусственного интеллекта. Никаких навыков монтажа не требуется.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="gradient-primary border-0 text-lg px-8 py-6 hover:scale-105 transition-transform"
            >
              <Icon name="Sparkles" size={20} className="mr-2" />
              Начать бесплатно
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 hover:scale-105 transition-transform"
            >
              <Icon name="Play" size={20} className="mr-2" />
              Смотреть демо
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground pt-8">
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-primary" />
              <span>3 видео бесплатно</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-primary" />
              <span>Без водяных знаков</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-primary" />
              <span>HD качество</span>
            </div>
          </div>
        </div>

        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-3xl -z-10 animate-float" />
          <div className="glass rounded-3xl p-2 animate-scale-in">
            <div className="bg-card rounded-2xl aspect-video flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto animate-float">
                  <Icon name="Play" size={32} className="text-white" />
                </div>
                <p className="text-muted-foreground">Превью видео появится здесь</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
