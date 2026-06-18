import type { Config } from "tailwindcss";
import { colors, typography } from "./index";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily: typography.fontFamily,
    },
  },
  plugins: [],
} satisfies Config;
