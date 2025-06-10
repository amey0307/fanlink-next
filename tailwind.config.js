/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#0f3e17f8',
        // You can also add variations if needed
        'primary-green-dark': '#0a2f12',
        'primary-green-light': '#1a5b24',
      },
    },
  },
  plugins: [],
}