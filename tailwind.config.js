/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#b5cd39',
        'accent-hover': '#1daf06',
      }
    },
  },
  plugins: [],
  variants: {
    extend: {
      display: ["focus-group"]
    },
  },
}

