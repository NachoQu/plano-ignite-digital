import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import PlanoLogo from "./PlanoLogo";
import LanguageSwitcher from "./LanguageSwitcher";

type NavItem = {
  label: string;
  href: string;
  type: 'scroll' | 'route';
};

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  const handleWhatsAppClick = () => {
    const message = t('hero.whatsappMessage');
    window.open(`https://wa.me/542323550605?text=${encodeURIComponent(message)}`, "_blank");
  };

  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
    setIsOpen(false);
  };

  const navItems: NavItem[] = [
    { label: t('navbar.services'), href: "servicios", type: 'scroll' },
    { label: t('navbar.projects'), href: "proyectos", type: 'scroll' },
    { label: t('navbar.testimonials'), href: "testimonios", type: 'scroll' },
    { label: t('navbar.methodology'), href: "metodologia", type: 'scroll' },
    { label: t('navbar.team'), href: "equipo", type: 'scroll' },
    { label: t('navbar.blog'), href: "/blog", type: 'route' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <PlanoLogo size={64} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) =>
              item.type === 'route' ? (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-muted-foreground hover:text-primary transition-colors duration-200 ${
                    location.pathname.startsWith(item.href) ? 'text-primary' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </button>
              )
            )}
          </div>

          {/* Language Switcher & CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <Button
              onClick={handleWhatsAppClick}
              variant="default"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {t('navbar.contact')}
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) =>
                item.type === 'route' ? (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-left text-muted-foreground hover:text-primary transition-colors duration-200 ${
                      location.pathname.startsWith(item.href) ? 'text-primary' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className="text-left text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                )
              )}
              <div className="pt-2 border-t border-border">
                <LanguageSwitcher />
              </div>
              <Button
                onClick={handleWhatsAppClick}
                variant="default"
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
              >
                {t('navbar.contact')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
