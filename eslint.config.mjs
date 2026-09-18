import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Node/CommonJS build scripts, not part of the app bundle.
    files: ["scripts/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    // Long-form editorial content pages: curly-quote punctuation reads naturally in JSX text
    // and doesn't need HTML entity escaping.
    files: ["app/**/page.tsx"],
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
  {
    // Three.js/r3f camera manipulation is standard and requires direct mutation in useFrame
    files: ["components/three/**/*.tsx"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
