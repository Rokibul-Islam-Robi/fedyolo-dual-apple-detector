/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bark: "#0F1912",
        canopy: "#16241A",
        leaf: {
          DEFAULT: "#4C7A56",
          light: "#7FAE82",
          dim: "#2E4632",
        },
        scab: "#C1443C",
        rust: "#B9552C",
        mildew: "#D6A94B",
        parchment: "#EFE9DB",
        mist: "#9CB2A0",
      },
      fontFamily: {
        display: ["\"Fraunces\"", "serif"],
        body: ["\"IBM Plex Sans\"", "sans-serif"],
        mono: ["\"IBM Plex Mono\"", "monospace"],
      },
      backgroundImage: {
        "leaf-vein": "radial-gradient(circle at 20% 20%, rgba(127,174,130,0.12), transparent 45%)",
      },
    },
  },
  plugins: [],
};
