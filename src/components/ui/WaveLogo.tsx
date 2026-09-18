import { BRAND } from "@/lib/brand";

interface WaveLogoProps {
  variant?: "icon" | "horizontal" | "stacked" | "wordmark";
  color?: "fullColor" | "white";
  className?: string;
  containerClassName?: string;
  size?: number | string;
  alt?: string;
}

export function WaveLogo({
  variant = "icon",
  color = "fullColor",
  className = "",
  containerClassName = "",
  size,
  alt = "wave.io",
}: WaveLogoProps) {
  let src = BRAND.assets.icon;
  if (variant === "horizontal") {
    src = color === "white" ? BRAND.assets.horizontalWhite : BRAND.assets.horizontal;
  } else if (variant === "icon") {
    src = color === "white" ? BRAND.assets.iconWhite : BRAND.assets.icon;
  } else if (variant === "stacked") {
    src = BRAND.assets.stacked;
  } else if (variant === "wordmark") {
    src = BRAND.assets.wordmark;
  }

  const defaultSizes: Record<string, string> = {
    icon: "h-8 w-8",
    horizontal: "h-8 w-auto max-w-[160px]",
    stacked: "h-14 w-auto",
    wordmark: "h-6 w-auto",
  };

  const sizeClass = size ? "" : defaultSizes[variant] || defaultSizes.icon;
  const inlineStyle = size
    ? {
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
      }
    : undefined;

  const imageElement = (
    <img
      src={src}
      alt={alt}
      style={inlineStyle}
      className={`object-contain select-none transition-transform duration-200 ${sizeClass} ${className}`}
      draggable={false}
    />
  );

  if (containerClassName) {
    return (
      <div className={`flex items-center justify-center rounded-[12px] ${containerClassName}`}>
        {imageElement}
      </div>
    );
  }

  return imageElement;
}

export default WaveLogo;
