/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'eafit': {
          'primary': '#000066',
          'primary-light': '#00A9E0',
          'blue-neon': '#146AEF',
          'success': '#0FAB0B',
          'error': '#A6040E',
          'warning': '#FFB900',
          'info': '#184958',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
