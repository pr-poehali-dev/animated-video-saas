import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface NavigationProps {
  activeTab: 'home' | 'editor' | 'projects' | 'gallery' | 'profile';
  setActiveTab: (tab: 'home' | 'editor' | 'projects' | 'gallery' | 'profile') => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const Navigation = ({ activeTab, setActiveTab, isLoggedIn, setIsLoggedIn }: NavigationProps) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleAuth = () => {
    setIsLoggedIn(true);
    setShowAuthDialog(false);
    setActiveTab('editor');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Icon name="Sparkles" size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">VideoAlive</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setActiveTab('home')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'home' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Главная
            </button>
            {isLoggedIn && (
              <>
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`text-sm font-medium transition-colors ${
                    activeTab === 'editor' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Редактор
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`text-sm font-medium transition-colors ${
                    activeTab === 'projects' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Проекты
                </button>
              </>
            )}
            <button
              onClick={() => setActiveTab('gallery')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'gallery' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Галерея
            </button>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveTab('profile')}
                className="rounded-full"
              >
                <Icon name="User" size={20} />
              </Button>
            ) : (
              <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary border-0">
                    Войти
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                      {authMode === 'login' ? 'Вход' : 'Регистрация'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Пароль</Label>
                      <Input id="password" type="password" placeholder="••••••••" />
                    </div>
                    <Button 
                      onClick={handleAuth}
                      className="w-full gradient-primary border-0"
                    >
                      {authMode === 'login' ? 'Войти' : 'Создать аккаунт'}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      {authMode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
                      <button
                        onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                        className="text-primary font-medium hover:underline"
                      >
                        {authMode === 'login' ? 'Зарегистрироваться' : 'Войти'}
                      </button>
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
