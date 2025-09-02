import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Plano transformó nuestra presencia digital. En 3 meses aumentamos las consultas un 200% con nuestra nueva web.",
      author: "María González",
      company: "Estudio Jurídico González",
      rating: 5
    },
    {
      quote: "El ERP que desarrollaron organizó completamente nuestro stock y ventas. Ahora todo está centralizado y es súper fácil de usar.",
      author: "Carlos Mendoza",
      company: "Distribuidora del Norte",
      rating: 5
    },
    {
      quote: "Increíble lo rápido que trabajaron. En 2 semanas teníamos nuestro MVP funcionando y validando con clientes reales.",
      author: "Ana Pérez",
      company: "Startup FoodTech",
      rating: 5
    },
    {
      quote: "La plataforma educativa cambió nuestra comunicación con las familias. 80% de uso activo desde el primer mes.",
      author: "Director Johnson",
      company: "New Zealand Pacific School",
      rating: 5
    },
    {
      quote: "Nuestro e-commerce está funcionando perfecto. La integración con pagos y logística fue impecable desde el día uno.",
      author: "Roberto Silva",
      company: "Tienda Online RS",
      rating: 5
    },
    {
      quote: "El sistema de reservas optimizó nuestros espacios corporativos. Ya no hay conflictos de horarios y todo está organizado.",
      author: "Laura Martín",
      company: "Oficinas Premium",
      rating: 5
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale bg-background group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-primary/30 mr-2" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-secondary fill-current" />
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-foreground leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="border-t border-border/50 pt-4">
                  <div className="font-semibold text-foreground">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.company}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="bg-background rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">10+</div>
                <div className="text-sm text-muted-foreground">Proyectos Exitosos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Clientes Satisfechos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">80%</div>
                <div className="text-sm text-muted-foreground">Uso Activo Promedio</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">2-4</div>
                <div className="text-sm text-muted-foreground">Semanas de Entrega</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;