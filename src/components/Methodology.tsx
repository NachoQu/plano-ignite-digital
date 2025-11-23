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
    window.open(`https://wa.me/5491151234567?text=${message}`, '_blank');
  };

  return (
    <section id="metodologia" className="bg-black text-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('methodology.title')}
          </h2>
          <p className="text-gray-300 text-lg md:text-xl mb-2 max-w-xl mx-auto leading-relaxed">
            {t('methodology.subtitle')}{" "}
            <span className="text-[#ffb016] font-semibold">
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
                  className="bg-[#111] border border-[#222] rounded-3xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 relative"
                  onMouseEnter={() => setHoveredId(step.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setHoveredId(isHovered ? null : step.id)}
                >
                  <div className="px-6 sm:px-8 pt-8 pb-6">
                    <span className="text-4xl sm:text-5xl font-semibold text-gray-700">
                      {step.number}
                    </span>

                    <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-white">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-[#ffb016] font-semibold text-sm sm:text-base">
                      {step.description}
                    </p>

                    <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                      {step.details}
                    </p>
                  </div>

                  {/* SLIDE OVERLAY */}
                  <div
                    className={`
                      absolute left-0 right-0 bottom-0
                      bg-gradient-to-r from-[#ff5a1f] via-[#ff7a2a] to-[#ffb016]
                      px-6 sm:px-8 py-4 flex items-center justify-between
                      transition-all duration-300 ease-out
                      ${isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
                    `}
                  >
                    <span className="text-sm sm:text-base font-medium text-white">
                      {t('methodology.ctaText')}
                    </span>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsAppClick();
                      }}
                      className="px-4 sm:px-5 py-2 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-900 transition-colors"
                    >
                      {t('methodology.ctaButton')}
                    </button>
                  </div>
                </div>

                {/* ARROW between steps */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-3 text-gray-600 text-xl">
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
