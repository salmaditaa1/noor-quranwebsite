/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noor: {
          dark: "var(--color-noor-dark)",
          light: "var(--color-noor-light)",
          bg: "var(--color-noor-bg)",
          card: "var(--color-noor-card)",
          gold: "var(--color-noor-gold)",
          text: "var(--color-noor-text)",
          textSecondary: "var(--color-noor-textSecondary)",
          divider: "var(--color-noor-divider)",
        }
      },
      borderRadius: {
        'noor': '20px',          // Custom 20px rounded corner requested by user
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
        arabic: ['Amiri', 'arabic-custom', 'serif'],
      },
      boxShadow: {
        'noor-sm': '0 4px 6px -1px rgba(122, 88, 69, 0.08), 0 2px 4px -1px rgba(122, 88, 69, 0.05)',
        'noor': '0 10px 15px -3px rgba(44, 15, 18, 0.07), 0 4px 6px -2px rgba(44, 15, 18, 0.05)',
        'noor-lg': '0 20px 25px -5px rgba(44, 15, 18, 0.1), 0 10px 10px -5px rgba(44, 15, 18, 0.04)',
      }
    },
  },
  plugins: [],
}
