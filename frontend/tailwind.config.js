/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
}
