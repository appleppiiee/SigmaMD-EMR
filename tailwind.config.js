// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // neutrals
        "gray-dark": "#002408", // for your main body copy
        "gray-base": "#003b08", // for secondary text/icons

        // accents (light backgrounds)
        "accent-100": "#18ac00", // default button bg
        "accent-200": "#92ca27", // hover state
        "accent-300": "#bcd522", // focus state

        // **WCAG-compliant** text on any accent
        "on-accent": "#000000",
      }
    },
  },
  plugins: [],
}
