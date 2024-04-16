/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#383c4c",
        secondary: "#f8f4ec",
        accent: "#7373CE",
        font: "#4a4a4a",
      },
      textColor: {
        base: "#4a4a4a",
      },
    },
  },
  plugins: [],
};
