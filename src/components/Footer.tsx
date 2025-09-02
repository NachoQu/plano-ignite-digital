import { Button } from "@/components/ui/button";
import { MessageCircle, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import planoLogo from "@/assets/plano-logo-new.webp";

const Footer = () => {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/542323550605?text=Hola! Quiero impulsar mi negocio con Plano", "_blank");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={planoLogo} 
                alt="Plano - Agencia de desarrollo web y branding" 
                className="w-10 h-10 object-contain"
                loading="lazy"
                width="40"
                height="40"
              />
              <span className="text-2xl font-bold text-foreground">Plano</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Agencia integral no-code especializada en branding, desarrollo web y herramientas internas 
              para PyMEs y Startups. Resultados medibles desde el inicio.
            </p>
            <Button 
              onClick={handleWhatsAppClick}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Hablemos en WhatsApp
            </Button>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Navegación</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={scrollToTop}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('servicios')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Servicios
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('proyectos')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Proyectos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('testimonios')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Testimonios
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('metodologia')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Metodología
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('equipo')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Equipo
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-secondary" />
                <a 
                  href="https://wa.me/542323550605" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +54 2323 55-0605
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-secondary" />
                <span className="text-muted-foreground">info@plano.com</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-foreground mb-3">Síguenos</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://instagram.com/plano.web" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://linkedin.com/company/plano-web" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 Plano. Agencia integral no-code para PyMEs y Startups.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Términos de Servicio
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;