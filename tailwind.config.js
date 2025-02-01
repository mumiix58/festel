/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      colors: {
        primary: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        accent: {
          DEFAULT: '#C8A97E',
          light: '#D4BC98',
          dark: '#B69666',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.900'),
            a: {
              color: theme('colors.accent.DEFAULT'),
              '&:hover': {
                color: theme('colors.accent.dark'),
              },
            },
            h1: {
              fontFamily: theme('fontFamily.display').join(', '),
            },
            h2: {
              fontFamily: theme('fontFamily.display').join(', '),
            },
            h3: {
              fontFamily: theme('fontFamily.display').join(', '),
            },
            h4: {
              fontFamily: theme('fontFamily.display').join(', '),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}