/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F2D40',
        text: '#4A4A4A',
        accent: '#0866FF',
        muted: '#6b7280',
        panel: {
          border: 'rgba(0,0,0,.06)'
        }
      },
      fontFamily: {
        title: ['Alata', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        body: ['Montserrat', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif']
      },
      boxShadow: {
        header: '0 0 1px rgba(0,0,0,0.5)',
        panel: '0 2px 12px rgba(0,0,0,.06)'
      },
      maxWidth: {
        container: '1300px'
      }
    },
  },
  plugins: [],
}

