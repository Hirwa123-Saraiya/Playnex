/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink:      "#0F1B2D",
        inkSoft:  "#1A2A40",
        inkLine:  "#22334D",
        moss:     "#17402B",
        mossDark: "#123321",
        lime:     "#D6F03C",
        sand:     "#F5F6F2",
        card:     "#FFFFFF",
        line:     "#E5E7E1",
        text:     "#1B2420",
        muted:    "#6B737A",
        positive: "#0F9D58",
        negative: "#D93025",
        warn:     "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};