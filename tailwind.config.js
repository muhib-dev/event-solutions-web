/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        customTheme: {
          primary: "#07004F",
          secondary: "#004FC6",
          accent: "#47436D",
          neutral: "#312e81",
          "base-100": "#fff",
          info: "#7dd3fc",
          success: "#86efac",
          warning: "#fde047",
          error: "#e11d48",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
