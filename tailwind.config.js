/** Tailwind v4 compatibility config for the homepage banner animations. */
export default {
  theme: {
    extend: {
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(1rem)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        kenBurns: {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.1)" },
        },
      },
      animation: {
        "banner-fade-up": "fadeUp 700ms ease-out both",
        "ken-burns": "kenBurns 6s ease-out both",
      },
    },
  },
};
