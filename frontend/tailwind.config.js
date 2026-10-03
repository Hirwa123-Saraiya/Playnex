/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ---- Enterprise navy (used by super-admin) ---- */
        navy:      "#0B1F4D",
        navyDeep:  "#071A3D",
        navyMid:   "#0B1F4D",

        /* ---- Blue: FULL SCALE so blue-50 … blue-900 all work ---- */
        blue: {
          50:  "#EAF3FF",
          100: "#D9E8FB",
          200: "#B7D1F5",
          300: "#8DB5EE",
          400: "#5A97E6",
          500: "#2F80ED",
          600: "#1565D8",
          700: "#0E5BD8",
          800: "#0A47A8",
          900: "#0B1F4D",
          DEFAULT: "#1565D8",
        },

        /* ---- Semantic aliases ---- */
        blueHover: "#0E5BD8",
        blueAlt:   "#2F80ED",
        blueSoft:  "#EAF3FF",

        page: "#F7FAFC",
        card: "#FFFFFF",
        line: "#D9E6F5",
        text: "#1E293B",
        muted: "#64748B",

        positive: "#22C55E",
        negative: "#EF4444",
        warn:     "#F59E0B",

        /* ---- Chart palette ---- */
        chart1: "#0B1F4D",
        chart2: "#1565D8",
        chart3: "#2F80ED",
        chart4: "#5AA9FF",
        chart5: "#A9D0FF",

        /* ---- Legacy aliases (so untouched pages still compile) ---- */
        ink:      "#0B1F4D",
        inkSoft:  "#12275A",
        inkLine:  "#1E3A6E",
        moss:     "#1565D8",
        mossDark: "#0E5BD8",
        lime:     "#2F80ED",
        sand:     "#F7FAFC",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card:      "0 1px 3px 0 rgba(11, 31, 77, 0.06), 0 1px 2px -1px rgba(11, 31, 77, 0.04)",
        cardHover: "0 4px 12px -2px rgba(11, 31, 77, 0.10), 0 2px 4px -2px rgba(11, 31, 77, 0.06)",
        popover:   "0 10px 15px -3px rgba(11, 31, 77, 0.12), 0 4px 6px -4px rgba(11, 31, 77, 0.08)",
      },
    },
  },
  plugins: [],
};