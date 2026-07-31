/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-deep": "var(--paper-deep)",
        cherry: "var(--cherry)",
        "cherry-bright": "var(--cherry-bright)",
        blush: "var(--blush)",
        ink: "var(--ink)",
        gold: "var(--gold)",
        night: "var(--night)",
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        handwriting: ["Caveat", "cursive"],
        letter: ['"Courier Prime"', "monospace"],
        body: ["Inter", "sans-serif"],
      },
      fontSize: {
        display: "clamp(2.2rem, 7vw, 5rem)",
        age: "clamp(6rem, 26vw, 14rem)",
      },
      boxShadow: {
        paper: "0 8px 24px rgb(43 27 18 / 0.18)",
      },
    },
  },
  plugins: [],
};
