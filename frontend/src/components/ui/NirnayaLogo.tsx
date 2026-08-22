import React from "react";

interface NirnayaLogoProps {
  variant?: "full" | "mark" | "text";
  size?: "sm" | "md" | "lg";
  className?: string;
  showTagline?: boolean;
}

export const NirnayaLogo: React.FC<NirnayaLogoProps> = ({
  variant = "full",
  size = "md",
  className = "",
  showTagline = false,
}) => {
  // Height configurations
  const markSizeClass = {
    sm: "h-8 w-auto",
    md: "h-11 w-auto",
    lg: "h-16 w-auto",
  }[size];

  const textSizeClass = {
    sm: "text-sm tracking-[0.2em]",
    md: "text-lg tracking-[0.25em]",
    lg: "text-2xl tracking-[0.3em]",
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {variant !== "text" && (
        <img
          src="/nirnaya-logo.png"
          alt="NIRNAYA Logo"
          className={`${markSizeClass} object-contain transition-transform duration-200 hover:scale-[1.02]`}
          onError={(e) => {
            // Fallback vector SVG mark if image asset is unavailable
            e.currentTarget.style.display = "none";
          }}
        />
      )}

      {variant !== "mark" && (
        <div className="flex flex-col">
          <span
            className={`font-brand font-bold text-[#7A171C] uppercase leading-none ${textSizeClass}`}
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            NIRNAYA
          </span>
          {showTagline && (
            <span className="text-[10px] uppercase font-medium tracking-[0.15em] text-[#C9953E] mt-1">
              Decision Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default NirnayaLogo;
