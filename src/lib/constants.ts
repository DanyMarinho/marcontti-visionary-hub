/**
 * Marcontti Garage — design system constants.
 * Mirrors the CSS custom properties defined in src/styles/globals.css.
 */

export const colors = {
  bgPrimary: "#0a0a0f",
  bgCard: "rgba(255, 255, 255, 0.03)",
  textPrimary: "#ffffff",
  textSecondary: "#94a3b8",
  borderCard: "rgba(255, 255, 255, 0.08)",
  accent: {
    blue: "#3b82f6",
    purple: "#8b5cf6",
    cyan: "#06b6d4",
  },
} as const;

export const radius = {
  card: "24px",
  input: "16px",
  button: "12px",
} as const;

export const blur = {
  glass: "24px",
} as const;

export const shadows = {
  glow: "0 0 40px rgba(59, 130, 246, 0.15)",
  glowHover: "0 0 60px rgba(139, 92, 246, 0.2)",
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const durations = {
  fast: 150,
  base: 250,
  slow: 400,
  shimmer: 1500,
  gradientPulse: 2000,
  float: 3000,
  typingDot: 1400,
} as const;

export const designSystem = {
  colors,
  radius,
  blur,
  shadows,
  breakpoints,
  durations,
} as const;

export type DesignSystem = typeof designSystem;