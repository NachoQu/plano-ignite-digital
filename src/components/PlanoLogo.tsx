import React from 'react';
import planoLogoOriginal from "@/assets/plano-logo-original.webp";

interface PlanoLogoProps {
  className?: string;
  size?: number;
}

const PlanoLogo: React.FC<PlanoLogoProps> = ({ className = "", size = 32 }) => {
  // Ajustar el tamaño para que se vea mejor
  const adjustedSize = size * 1.5; // Aumentar el tamaño por defecto
  
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo original de Plano */}
      <img 
        src={planoLogoOriginal}
        alt="Plano - Agencia de desarrollo web y branding" 
        className="flex-shrink-0 object-contain"
        style={{ width: adjustedSize, height: adjustedSize }}
        loading="eager"
        fetchPriority="high"
      />
    </div>
  );
};

export default PlanoLogo;
