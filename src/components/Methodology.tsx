import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Methodology = () => {
  const { t } = useTranslation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const steps = [
    {
      id: "01",
      number: "01",
      title: t('methodology.steps.brief.title'),
      description: t('methodology.steps.brief.description'),
      details: t('methodology.steps.brief.details')
    },
    {
      id: "02",
      number: "02",
      title: t('methodology.steps.sprint.title'),
      description: t('methodology.steps.sprint.description'),
      details: t('methodology.steps.sprint.details')
    },
    {
      id: "03",
      number: "03",
      title: t('methodology.steps.feedback.title'),
      description: t('methodology.steps.feedback.description'),
      details: t('methodology.steps.feedback.details')
    },
    {
      id: "04",
      number: "04",
      title: t('methodology.steps.results.title'),
      description: t('methodology.steps.results.description'),
      details: t('methodology.steps.results.details')
    }
  ];

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(t('hero.whatsappMessage'));
    window.open(`https://wa.me/5492323550605?text=${message}`, '_blank');
  };

  return (
    <section id="metodologia" className="bg-background py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('methodology.title')}
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl mb-2 max-w-xl mx-auto leading-relaxed">
            {t('methodology.subtitle')}{" "}
            <span className="text-secondary font-semibold">
              {t('methodology.subtitleHighlight')}
            </span>
          </p>
        </div>

        <div className="space-y-10">
          {steps.map((step, index) => {
            const isHovered = hoveredId === step.id;

            return (
              <div key={step.id} className="relative">
                {/* CARD */}
                <div
                  className="bg-card border border-border rounded-3xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(102,51,255,0.15)] transition-all duration-300"
                  onMouseEnter={() => setHoveredId(step.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setHoveredId(isHovered ? null : step.id)}
                >
                  <div className="px-6 sm:px-8 pt-8 pb-6">
                    <span className="text-4xl sm:text-5xl font-semibold text-muted">
                      {step.number}
                    </span>

                    <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-foreground">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-secondary font-semibold text-sm sm:text-base">
                      {step.description}
                    </p>

                    <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                      {step.details}
                    </p>
                  </div>

                  {/* SLIDE CTA - Pushes content down instead of covering it */}
                  <div
                    className={`
                      bg-gradient-to-r from-primary via-primary/90 to-secondary
                      px-8 sm:px-12 py-0 flex items-center justify-between
                      overflow-hidden
                      transition-all duration-300 ease-out
                      ${isHovered ? "max-h-32 py-8" : "max-h-0 py-0"}
                    `}
                  >
                    <span className="text-sm sm:text-base font-medium text-white whitespace-nowrap">
                      {t('methodology.ctaText')}
                    </span>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsAppClick();
                      }}
                      className="px-4 sm:px-5 py-2 bg-background text-foreground rounded-full text-sm font-semibold hover:bg-card transition-colors whitespace-nowrap"
                    >
                      {t('methodology.ctaButton')}
                    </button>
                  </div>
                </div>

                {/* ARROW between steps */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-3 text-muted text-xl">
                    ↓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Methodology;
