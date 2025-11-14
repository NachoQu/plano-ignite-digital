import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-muted-foreground hover:text-primary transition-colors"
    >
      <Globe className="h-4 w-4 mr-2" />
      <span className="font-medium">
        {i18n.language === 'es' ? 'EN' : 'ES'}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;
