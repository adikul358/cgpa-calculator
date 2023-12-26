/** @type {import("tailwindcss").Config} */
import type { Config } from "tailwindcss"
import colors from "tailwindcss/colors"
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          "100": "#C1D4E8",
          "200": "#87A6C8",
          "300": "#577BA9",
          "400": "#325589",
          "500": "#16346A",
          "600": "#041C4B",
          "700": "#030E36",
          "800": "#020521",
          "900": "#01010D",
        },
        secondary: {
          "100": "#D9D9D9",
          "200": "#A6A6A6",
        },
        gray: colors.neutral,
      }
    },
  },
  plugins: [],
}

export default config
