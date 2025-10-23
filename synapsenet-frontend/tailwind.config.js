/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
      },
      colors: {
        chainlink: {
          blue: "#375BD2",
          cyan: "#00C8FF",
          dark: "#0A0F24",
          light: "#D4E3FF",
        },
        linera: {
          purple: "#7A1CAC",
          violet: "#A555EC",
          bg: "#141B33",
        },
        glass: "rgba(255,255,255,0.08)",
      },
      backgroundImage: {
        "gradient-main":
          "linear-gradient(135deg, #0A0F24 0%, #141B33 35%, #1E2746 100%)",
        "gradient-card":
          "linear-gradient(145deg, rgba(55,91,210,0.15), rgba(165,85,236,0.1))",
      },
      boxShadow: {
        glow: "0 0 20px rgba(55,91,210,0.35)",
        neon: "0 0 25px rgba(0,200,255,0.4)",
      },
      animation: {
        pulseSlow: "pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
