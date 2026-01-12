import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Profile = () => {
  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Профиль</h1>
          <p className="text-muted-foreground">Управляйте своим аккаунтом и подпиской</p>
        </div>

        <div className="grid gap-6">
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <div className="text-2xl font-bold">Иван Петров</div>
                  <div className="text-sm text-muted-foreground font-normal">ivan@example.com</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input id="name" defaultValue="Иван Петров" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="ivan@example.com" />
                </div>
              </div>
              <Button variant="outline">
                <Icon name="Save" size={18} className="mr-2" />
                Сохранить изменения
              </Button>
            </CardContent>
          </Card>

          <Card className="glass border-primary">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Текущий тариф</span>
                <Badge className="gradient-primary border-0 text-white">Pro</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Проектов создано</span>
                  <span className="font-bold">12 / ∞</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Видео в этом месяце</span>
                  <span className="font-bold">8 видео</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Использовано хранилища</span>
                    <span className="font-bold">2.4 ГБ / 10 ГБ</span>
                  </div>
                  <Progress value={24} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Icon name="CreditCard" size={24} className="text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold mb-1">Следующий платёж: 15 февраля 2026</p>
                    <p className="text-sm text-muted-foreground">₽990 будет списано автоматически</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" variant="outline">
                  <Icon name="CreditCard" size={18} className="mr-2" />
                  Сменить тариф
                </Button>
                <Button className="flex-1" variant="outline">
                  <Icon name="X" size={18} className="mr-2" />
                  Отменить подписку
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border">
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <div className="text-3xl font-bold gradient-text mb-1">12</div>
                  <div className="text-sm text-muted-foreground">Проектов</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <div className="text-3xl font-bold gradient-text mb-1">156</div>
                  <div className="text-sm text-muted-foreground">Фотографий</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <div className="text-3xl font-bold gradient-text mb-1">23м</div>
                  <div className="text-sm text-muted-foreground">Видео создано</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <div className="text-3xl font-bold gradient-text mb-1">4.8</div>
                  <div className="text-sm text-muted-foreground">Средняя оценка</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
