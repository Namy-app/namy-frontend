export default {
  // Lint, format & type-check TypeScript and JavaScript files
  "**/*.{ts,tsx,js,jsx}": (filenames) => [
    `prettier --write ${filenames.join(" ")}`,
    `eslint --fix ${filenames.join(" ")}`,
    "tsc --noEmit",
  ],
  // Format other files
  "**/*.{json,md,yml,yaml,css,scss}": (filenames) => [
    `prettier --write ${filenames.join(" ")}`,
  ],
};
