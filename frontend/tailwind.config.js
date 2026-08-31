/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        paper: {
          DEFAULT: "#F4F3EF",
          soft: "#EDECE5",
          dark: "#0F1214",
          darksoft: "#171B1E",
        },
        ink: {
          DEFAULT: "#14181B",
          light: "#E9EAE4",
        },
        spine: {
          50: "#EEFBF9",
          100: "#D3F4EE",
          300: "#7FDCCC",
          500: "#0E7C6E",
          600: "#0B6459",
          700: "#0A4F47",
          900: "#062D28",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,24,27,0.04), 0 8px 24px -8px rgba(20,24,27,0.10)",
        cardHover: "0 4px 8px rgba(20,24,27,0.06), 0 16px 32px -12px rgba(20,24,27,0.16)",
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: 0, transform: "translateY(8px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease-out both",
        shimmer: "shimmer 1.6s infinite linear",
      },
    },
  },
  plugins: [],
};
