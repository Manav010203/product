// // import { dirname } from "path";
// // import { fileURLToPath } from "url";
// // import { FlatCompat } from "@eslint/eslintrc";

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = dirname(__filename);

// // const compat = new FlatCompat({
// //   baseDirectory: __dirname,
// // });

// // const eslintConfig = [
// //   ...compat.extends("next/core-web-vitals", "next/typescript"),
// //   {
// //     ignores: [
// //       "node_modules/**",
// //       ".next/**",
// //       "out/**",
// //       "build/**",
// //       "next-env.d.ts",
// //     ],rules: {
// //       "@next/next/no-img-element": "off", // allow <img> tags
// //       "react-hooks/exhaustive-deps": "off", // prevent hook dependency spam
// //       "no-console": "warn", // allow console.log but show warning
// //     },
// //   },
// // ];

// // export default eslintConfig;


// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   // ✅ Next.js + TypeScript recommended rules
//   ...compat.extends("next/core-web-vitals", "next/typescript"),

//   {
//     ignores: [
//       "node_modules/**",
//       ".next/**",
//       "out/**",
//       "build/**",
//       "next-env.d.ts",
//     ],

//     rules: {
//       // ✅ React/Next.js relaxations
//       "@next/next/no-img-element": "off",           // allow <img> when needed
//       "react-hooks/exhaustive-deps": "warn",        // warn, not error
//       "react/no-unescaped-entities": "off",

//       // ✅ Clean console logs
//       "no-console": "off",

//       // ✅ TypeScript rules adjustments
//       "@typescript-eslint/no-unused-vars": [
//         "warn",
//         { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
//       ],
//       "@typescript-eslint/explicit-function-return-type": "off",

//       // ✅ Code style
      
//       "semi": "off",
//       "prefer-const": "warn",
//       "no-var": "error",
//       "semi": ["error", "always"],
//     },
//   },
// ];

// export default eslintConfig;

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ✅ Load Next.js + TypeScript recommended configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],

    rules: {
      /* ✅ General code style */
      semi: "off", // no semicolon enforcement
      "no-var": "error",
      "prefer-const": "warn",

      /* ✅ Console usage */
      "no-console": "off", // allow console.log

      /* ✅ React hooks */
      "react-hooks/exhaustive-deps": "warn", // warn but don’t fail build

      /* ✅ TypeScript adjustments */
      "@typescript-eslint/no-explicit-any": "off", // allow any when needed
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",

      /* ✅ Next.js rules */
      "@next/next/no-img-element": "off", // allow <img> tags

      /* ✅ Optional style improvements */
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
