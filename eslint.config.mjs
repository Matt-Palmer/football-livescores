import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

/*
  ESLint 9 flat config. Replaces .eslintrc.json, which the "eslintrc" format
  no longer supports by default, and `next lint`, which was removed in
  Next 16 in favour of running ESLint directly.

  eslint-config-next 16 exports flat config natively, so no FlatCompat shim.
*/
const config = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
];

export default config;
