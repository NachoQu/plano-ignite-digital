import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "react-intersection-observer";
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";
import { useTranslation } from "react-i18next";

const Testimonials = () => {
  const { t } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [maxHeight, setMaxHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollLeft, setStartScrollLeft] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const { ref: statsRef, inView: statsInView } = useInView({ threshold: 0.3, triggerOnce: true });
  
  const projectsCount = useCountUp({ end: 10, isVisible: statsInView });
  const satisfactionCount = useCountUp({ end: 100, isVisible: statsInView });
  const hoursCount = useCountUp({ end: 300, isVisible: statsInView });

  const testimonials = [
    {
      quote: t('testimonials.items.sofia.quote'),
      author: t('testimonials.items.sofia.author'),
      company: t('testimonials.items.sofia.company'),
      rating: 5
    },
    {
      quote: t('testimonials.items.juan.quote'),
      author: t('testimonials.items.juan.author'),
      company: t('testimonials.items.juan.company'),
      rating: 5
    },
    {
      quote: t('testimonials.items.lucas.quote'),
      author: t('testimonials.items.lucas.author'),
      company: t('testimonials.items.lucas.company'),
      rating: 5
    },
    {
      quote: t('testimonials.items.daniela.quote'),
      author: t('testimonials.items.daniela.author'),
      company: t('testimonials.items.daniela.company'),
      rating: 5
    },
    {
      quote: t('testimonials.items.sergio.quote'),
      author: t('testimonials.items.sergio.author'),
      company: t('testimonials.items.sergio.company'),
      rating: 5
    }
  ];

  // Duplicamos múltiples veces para marquee infinito suave
  const infiniteTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  // Calcular altura máxima de las cards
  useEffect(() => {
    const calculateMaxHeight = () => {
      const cards = document.querySelectorAll('.testimonial-card');
      let max = 0;
      cards.forEach(card => {
        const height = card.getBoundingClientRect().height;
        if (height > max) max = height;
      });
      setMaxHeight(max);
    };

    setTimeout(calculateMaxHeight, 100);
    window.addEventListener('resize', calculateMaxHeight);
    
    return () => window.removeEventListener('resize', calculateMaxHeight);
  }, []);

  // Marquee infinito con transform
  useEffect(() => {
    let animationId: number;
    const speed = 1; // pixels por frame

    const marqueeAnimation = () => {
      if (!isUserInteracting) {
        setTranslateX(prev => {
          const cardWidth = 400; // ancho aproximado de cada card + gap
          const totalWidth = cardWidth * testimonials.length;
          
          // Si llegamos al final del primer set, reseteamos
          if (prev <= -totalWidth) {
            return 0;
          }
          return prev - speed;
        });
      }
      animationId = requestAnimationFrame(marqueeAnimation);
    };

    animationId = requestAnimationFrame(marqueeAnimation);
    return () => cancelAnimationFrame(animationId);
  }, [isUserInteracting, testimonials.length]);

  // Pausar auto-scroll al pasar el cursor por encima
  const handleMouseEnter = () => {
    setIsUserInteracting(true);
  };

  const handleMouseLeave = () => {
    setIsUserInteracting(false);
  };

  // Manejar arrastre del mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsUserInteracting(true);
    setStartX(e.clientX);
    setStartScrollLeft(translateX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const x = e.clientX;
    const walk = (x - startX) * 2;
    setTranslateX(startScrollLeft + walk);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setIsUserInteracting(false), 2000);
  };

  // Manejar toque en mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsUserInteracting(true);
    setStartX(e.touches[0].clientX);
    setStartScrollLeft(translateX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const x = e.touches[0].clientX;
    const walk = (x - startX) * 2;
    setTranslateX(startScrollLeft + walk);
  };

  const handleTouchEnd = () => {
    setTimeout(() => setIsUserInteracting(false), 2000);
  };

  return (
    <section id="testimonios" className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper animationType="fade-in">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t('testimonials.title')} <span className="text-gradient-purple">{t('testimonials.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </div>
        </ScrollAnimationWrapper>

        {/* Carrusel de testimonios */}
        <div 
          className="relative max-w-7xl mx-auto mb-12 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            ref={carouselRef}
            className="flex gap-6 cursor-grab active:cursor-grabbing"
            style={{ 
              transform: `translateX(${translateX}px)`,
              transition: isDragging ? 'none' : 'transform 0.1s linear'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {infiniteTestimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-80 md:w-96"
              >
                <Card 
                  className="testimonial-card border-0 shadow-lg bg-background card-hover"
                  style={{ height: maxHeight > 0 ? `${maxHeight}px` : 'auto' }}
                >
                  <CardContent className="p-6 md:p-8 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mb-6">
                        <Quote className="h-12 w-12 text-primary/30 mr-4 flex-shrink-0" />
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-secondary fill-current" />
                          ))}
                        </div>
                      </div>
                      
                      <blockquote className="text-foreground leading-relaxed mb-6 md:mb-8 italic text-base md:text-lg flex-grow">
                        "{testimonial.quote}"
                      </blockquote>
                    </div>
                    
                    <div className="border-t border-border/50 pt-4 md:pt-6 mt-auto">
                      <div className="font-semibold text-foreground text-lg md:text-xl">
                        {testimonial.author}
                      </div>
                      <div className="text-muted-foreground text-sm md:text-base">
                        {testimonial.company}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <ScrollAnimationWrapper animationType="scale" delay={200}>
          <div ref={statsRef} className="mt-16 text-center">
            <div className="bg-background rounded-2xl p-8 shadow-lg max-w-4xl mx-auto card-hover">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">+{projectsCount}</div>
                  <div className="text-sm text-muted-foreground">{t('hero.stats.projects')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary mb-2">{satisfactionCount}%</div>
                  <div className="text-sm text-muted-foreground">{t('hero.stats.satisfaction')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">+{hoursCount}</div>
                  <div className="text-sm text-muted-foreground">{t('hero.stats.hours')}</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
};

export default Testimonials;