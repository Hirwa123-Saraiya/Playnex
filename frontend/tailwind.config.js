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
        odoo: {
          DEFAULT: '#714B67',
          dark: '#583A50',
          light: '#8F6584',
          slate: '#7e858b'
        }
      }
    },
  },
  plugins: [],
};
