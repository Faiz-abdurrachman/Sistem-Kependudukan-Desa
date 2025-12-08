import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Disable Tailwind CSS class name warnings (false positives)
      "tailwindcss/no-custom-classname": "off",
      // Disable invalid class warnings for valid Tailwind classes
      "@next/next/no-html-link-for-pages": "off",
    },
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["**/*.config.{js,ts,mjs}"],
  },
]);

export default eslintConfig;
