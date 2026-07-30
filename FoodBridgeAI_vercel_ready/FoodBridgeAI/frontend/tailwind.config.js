/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canopy: {
          DEFAULT: "#123A2E",
          50: "#E8F0EC",
          100: "#C7DBD2",
          400: "#2C6551",
          600: "#123A2E",
          700: "#0D2B22",
          900: "#081C17",
        },
        paper: "#F5F6F1",
        mango: {
          DEFAULT: "#F2A93B",
          600: "#D68F22",
        },
        signal: {
          DEFAULT: "#E85C4A",
          600: "#C7432F",
        },
        ink: "#171B19",
        mint: "#CFE0D5",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        ringspin: {
          "0%": { strokeDashoffset: "0" },
        },
        floatUp: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        floatUp: "floatUp 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
