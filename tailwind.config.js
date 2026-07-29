/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        /* Two families. Geist carries the site, Playfair carries the essay. */
        sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        geist: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        inter: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'], // legacy alias
        playfair: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
      },
      /* SHAPE LOCK: cards 16px, chips 8px, interactive elements full pill. */
      borderRadius: {
        card: '1rem',
        chip: '0.5rem',
      },
      /* Shadows tinted to the slate background, never pure black. */
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.12)',
        'card-hover':
          '0 1px 2px rgba(15, 23, 42, 0.05), 0 16px 40px -16px rgba(15, 23, 42, 0.20)',
      },
    },
  },
  plugins: [],
};
