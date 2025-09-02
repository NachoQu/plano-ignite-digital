import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      quote: "Desde el inicio, el equipo de Plano entendió mi visión y creó un sitio web moderno y funcional. La comunicación fue excelente, cumplieron plazos y permitieron actualizaciones. Recomendados para quienes buscan calidad y profesionalismo. ¡Gracias, Plano!",
      author: "Sofía Ubertino Rosso",
      company: "SUR Interiorismo",
      rating: 5
    },
    {
      quote: "Trabajar con plano fue un gran acierto para resolver nuestras necesidades digitales. Su profesionalismo, compromiso y comunicación constante así como las soluciones personalizadas brindadas superaron nuestras expectativas. ¡Gracias Plano!",
      author: "Juan Manuel Tripi",
      company: "ICE - Ingeniería y Construcciones Eléctricas S.A.",
      rating: 5
    },
    {
      quote: "Plano digitalizó nuestra barbería con una web moderna e intuitiva. Ahora, nuestros clientes pueden reservar turnos fácilmente en ambas sucursales, mejorando la organización y la experiencia. ¡Gran trabajo y 100% recomendados!",
      author: "Lucas Ledesma",
      company: "Street Barber",
      rating: 5
    },
    {
      quote: "Estamos muy felices y satisfechas con el trabajo de PLANO WEB. Supieron interpretar exactamente lo que necesitábamos para nuestro estudio contable y crearon una web profesional, moderna y fácil de navegar. Además, siempre atentos y resolutivos en cada etapa del proceso. Gracias por potenciarnos y posicionarnos digitalmente en el mercado!",
      author: "Daniela Chiaramonte",
      company: "Chiaramonte & Sánchez",
      rating: 5
    }
  ];

  // Función para avanzar al siguiente testimonio
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  // Función para retroceder al testimonio anterior
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Función para pausar/reanudar el carrusel
  const togglePlayPause = () => {
    setIsPaused(!isPaused);
  };

  // Función para ir a un testimonio específico
  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play del carrusel
  useEffect(() => {
    if (!isPaused && isPlaying) {
      const interval = setInterval(() => {
        nextTestimonial();
      }, 5000); // Cambia cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [isPaused, isPlaying, currentIndex]);

  // Pausar cuando el usuario hace hover sobre el carrusel
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <section id="testimonios" className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Lo que dicen nuestros <span className="text-gradient-purple">clientes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Testimonios reales de empresas que confiaron en Plano para impulsar su crecimiento digital
          </p>
        </div>

        {/* Carrusel de testimonios */}
        <div 
          className="relative max-w-6xl mx-auto mb-12"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={carouselRef}
        >
          {/* Controles de navegación */}
          <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-10">
            <button
              onClick={prevTestimonial}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-all duration-200 flex items-center justify-center"
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-foreground" />
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-10">
            <button
              onClick={nextTestimonial}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-all duration-200 flex items-center justify-center"
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-foreground" />
            </button>
          </div>

          {/* Botón de play/pause */}
          <div className="absolute top-2 md:top-4 right-2 md:right-4 z-10">
            <button
              onClick={togglePlayPause}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-all duration-200 flex items-center justify-center"
            >
              {isPaused ? (
                <Play className="h-4 w-4 md:h-5 md:w-5 text-foreground" />
              ) : (
                <Pause className="h-4 w-4 md:h-5 md:w-5 text-foreground" />
              )}
            </button>
          </div>

          {/* Testimonio actual */}
          <div className="px-8 md:px-16">
            <Card className="border-0 shadow-lg bg-background animate-fade-in">
              <CardContent className="p-4 md:p-8">
                <div className="flex items-center mb-6">
                  <Quote className="h-12 w-12 text-primary/30 mr-4" />
                  <div className="flex">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-secondary fill-current" />
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-foreground leading-relaxed mb-6 md:mb-8 italic text-base md:text-lg">
                  "{testimonials[currentIndex].quote}"
                </blockquote>
                
                <div className="border-t border-border/50 pt-4 md:pt-6">
                  <div className="font-semibold text-foreground text-lg md:text-xl">
                    {testimonials[currentIndex].author}
                  </div>
                  <div className="text-muted-foreground text-sm md:text-base">
                    {testimonials[currentIndex].company}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Indicadores de posición */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-primary scale-125"
                    : "bg-muted hover:bg-muted/80"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="bg-background rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">+10</div>
                <div className="text-sm text-muted-foreground">Proyectos Finalizados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Satisfacción</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">+300</div>
                <div className="text-sm text-muted-foreground">Horas Ahorradas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;