import js from "@eslint/js";
import globals from "globals";
export default [
  js.configs.recommended,
  {
    files: ["scripts/browser.mjs", "scripts/social.mjs"],
    languageOptions: { globals: globals.browser },
  },
  { files: ["scripts/**/*.mjs", "tests/**/*.mjs"], languageOptions: { globals: globals.node } },
  { files: ["assets/site.js"], languageOptions: { globals: globals.browser } },
  {
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
    },
  },
];
