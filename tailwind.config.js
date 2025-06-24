// tailwind.config.js

/**
 * Tailwind CSS Configuration
 *
 * This file defines the paths to all template files for Tailwind's purging process,
 * extends the default theme with custom colors, and configures any plugins if needed.
 *
 * For more details on configuration options, see:
 * https://tailwindcss.com/docs/configuration
 */
export default {
  /**
   * Specify all template files in which Tailwind CSS classes will be used.
   * Tailwind will scan these files to remove unused styles in production.
   *
   * @type {string[]}
   */
  content: [
    "./index.html",             // Root HTML file
    "./src/**/*.{js,ts,jsx,tsx}" // All JS/TS/JSX/TSX files in the src directory
  ],

  /**
   * Customize the default Tailwind theme by extending it with additional values.
   * In this section, we add custom color names to be used throughout the application.
   */
  theme: {
    extend: {
      colors: {
        // Neutral colors for primary and secondary text/icons
        "gray-dark": "#002408", // For main body copy (dark text)
        "gray-base": "#003b08", // For secondary text or icons

        // Accent colors for backgrounds, buttons, and interactive elements
        "accent-100": "#18ac00", // Default button background
        "accent-200": "#92ca27", // Hover state for buttons or accent areas
        "accent-300": "#bcd522", // Focus state (e.g., focus ring, outlines)

        // WCAG-compliant text color to ensure readability on any accent background
        "on-accent": "#000000"
      }
    }
  },

  /**
   * Register any Tailwind CSS plugins here.
   * Plugins can add additional utilities, components, or base styles.
   *
   * @type {Array}
   */
  plugins: []
}
