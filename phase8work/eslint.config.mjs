import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Honor the standard "_"-prefix convention for intentionally-unused
      // parameters (e.g. positional mock args) instead of flagging them.
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    ignores: ["graphify-out/**", ".next/**", "node_modules/**"],
  },
];

export default eslintConfig;
