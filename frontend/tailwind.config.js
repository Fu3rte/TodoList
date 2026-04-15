/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base Colors - Pinterest palette
        brand: {
          red: '#e60023',
          'red-hover': '#ad081b',
        },
        text: {
          primary: '#211922',
          secondary: '#62625b',
          disabled: '#91918c',
          white: '#ffffff',
          black: '#000000',
        },
        surface: {
          sand: '#e5e5e0',
          'warm-light': '#e0e0d9',
          fog: '#f6f6f3',
          dark: '#33332e',
          white: '#ffffff',
        },
        border: {
          disabled: '#c8c8c1',
          hover: '#bcbcb3',
          focus: '#435ee5',
        },
        // Semantic colors
        success: '#103c25',
        error: '#9e0a0a',
        // Interactive
        link: '#2b48d4',
        facebook: '#0866ff',
      },
      fontFamily: {
        sans: [
          'Pin Sans',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Oxygen-Sans',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'Helvetica',
          'sans-serif',
        ],
      },
      borderRadius: {
        DEFAULT: '16px',
        sm: '12px',
        md: '16px',
        lg: '20px',
        xl: '28px',
        '2xl': '32px',
        hero: '40px',
      },
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '15': '60px',
        '18': '72px',
        '22': '88px',
      },
      fontSize: {
        'display': ['70px', { lineHeight: 'normal', fontWeight: '600' }],
        'section': ['28px', { lineHeight: 'normal', fontWeight: '700', letterSpacing: '-1.2px' }],
        'body': ['16px', { lineHeight: '1.40' }],
        'caption-bold': ['14px', { lineHeight: 'normal', fontWeight: '700' }],
        'caption': ['12px', { lineHeight: '1.50', fontWeight: '400' }],
        'button': ['12px', { lineHeight: 'normal', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}
