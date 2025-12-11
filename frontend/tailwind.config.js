/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // This path is crucial. It tells Tailwind where to look for class names.
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}