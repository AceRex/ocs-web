/**
 * wave.io Web Brand Configuration
 */

export const BRAND = {
  name: "wave.io",
  platformName: "wave.io Platform",
  adminTitle: "wave.io Admin",
  tagline: "Live Worship & Presentation Platform",
  docsUrl: "/docs",
  colors: {
    deepNavy: "#0B1020",
    electricBlue: "#00A8FF",
    cyan: "#00E5FF",
    violet: "#8B5CF6",
    charcoalGray: "#303030",
    lightGray: "#E5E7EB",
    white: "#FFFFFF",
  },
  assets: {
    icon: "/assets/wave/wave_icon_full_color.png",
    iconWhite: "/assets/wave/wave_icon_white.png",
    horizontal: "/assets/wave/wave_horizontal_full_color.png",
    horizontalWhite: "/assets/wave/wave_horizontal_white.png",
    stacked: "/assets/wave/wave_stacked_full_color.png",
    wordmark: "/assets/wave/wave_wordmark_full_color.png",
  },
};

export const STATUS_TOKENS = {
  live: {
    badge: "bg-[#00A8FF] text-[#0B1020] font-bold",
    pulse: "bg-[#00E5FF]",
    label: "LIVE",
  },
  recording: {
    badge: "bg-[#8B5CF6] text-white font-semibold",
    pulse: "bg-white",
    label: "REC",
  },
  warning: {
    badge: "bg-[#303030] text-[#E5E7EB] border border-[#00E5FF]/40 font-semibold",
    pulse: "bg-[#00E5FF]",
    label: "WARNING",
  },
  error: {
    badge: "bg-[#303030] text-white border border-white/20 font-semibold",
    pulse: "bg-white",
    label: "ALERT",
  },
  success: {
    badge: "bg-[#00A8FF] text-[#0B1020] font-bold",
    pulse: "bg-[#0B1020]",
    label: "SUCCESS",
  },
};

export default BRAND;
