import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // global ignores (same as yours)
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
