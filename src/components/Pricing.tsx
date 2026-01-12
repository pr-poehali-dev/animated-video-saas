import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const plans = [
  {
    name: 'Демо',
    price: '0',
    period: 'навсегда',
    description: 'Попробуйте возможности платформы',
    features: [
      'До 3 фото в проект',
      'Базовые анимации',
      'Видео с водяными знаками',
      'SD качество (720p)',
      '1 проект в месяц'
    ],
    cta: 'Начать бесплатно',
    highlighted: false
  },
  {
    name: 'Pro',
    price: '990',
    period: 'в месяц',
    description: 'Для создателей контента',
    features: [
      'До 20 фото в проект',
      'Все типы анимаций',
      'Без водяных знаков',
      'Full HD качество (1080p)',
      'Неограниченно проектов',
      'Собственная музыка',
      'Приоритетная обработка'
    ],
    cta: 'Выбрать Pro',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: '4990',
    period: 'в месяц',
    description: 'Для агентств и бизнеса',
    features: [
      'Безлимитные фото',
      'Все типы анимаций',
      'Без водяных знаков',
      '4K качество',
      'API доступ',
      'Белый лейбл',
      'Приоритетная поддержка',
      'Командный доступ'
    ],
    cta: 'Связаться с нами',
    highlighted: false
  }
];

const Pricing = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Выберите свой{' '}
            <span className="gradient-text">тарифный план</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Начните бесплатно или выберите Pro для расширенных возможностей
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.highlighted
                  ? 'border-primary shadow-xl shadow-primary/20 scale-105'
                  : 'glass border-border'
              } hover:scale-105 transition-transform animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full gradient-primary text-sm font-bold text-white">
                    Популярный
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="space-y-1">
                  <div className="text-5xl font-bold">
                    ₽{plan.price}
                  </div>
                  <div className="text-muted-foreground text-sm">{plan.period}</div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <Icon name="Check" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.highlighted ? 'gradient-primary border-0' : ''
                  }`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
