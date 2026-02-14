/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom "classic" colors here if you want
        brand: "#1e293b", 
      },
    },
  },
  plugins: [],
}