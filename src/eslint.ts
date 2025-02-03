//
// This source file is part of the Stanford Biodesign Digital Health Spezi Web Configurations open-source project
//
// SPDX-FileCopyrightText: 2024 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import eslint from "@eslint/js";
import globals from "globals";
// @ts-ignore
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
// require is necessary to prevent Parcel from treating it as ESM
// @ts-ignore
const importPlugin = require("eslint-plugin-import");

type EslintConfigParams = {
  /**
   * Root of the project, where tsconfig exists.
   * Most likely it's going to be `import.meta.dirname` or `__dirname`.
   * */
  tsconfigRootDir: string;
  /**
   * List of TypeScript configuration files.
   * Required if there are multiple files with references.
   * */
  tsConfigsDirs?: string[];
};

export const getEslintConfig = ({
  tsconfigRootDir,
  tsConfigsDirs = [],
}: EslintConfigParams) =>
  tseslint.config(
    {
      ignores: ["dist", "docs", "out", "coverage"],
    },
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    eslint.configs.recommended,
    {
      settings: {
        "import/resolver": {
          typescript: { project: ["./tsconfig.json", ...tsConfigsDirs] },
        },
      },
    },
    {
      files: [
        "eslint.config.?(c)js",
        ".prettierrc.?(c)js",
        "postcss.config.?(c)js",
        "tailwind.config.?(c)js",
      ],
      languageOptions: {
        globals: globals.node,
      },
    },
    {
      extends: [
        tseslint.configs.strictTypeChecked,
        tseslint.configs.stylisticTypeChecked,
      ],
      files: ["**/*.{ts,tsx}"],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
      plugins: {
        "react-hooks": reactHooks,
      },
      rules: {
        "import/order": [
          "warn",
          {
            groups: ["builtin", "external", "internal", ["parent", "sibling"]],
            pathGroupsExcludedImportTypes: ["builtin"],
            "newlines-between": "never",
            alphabetize: {
              order: "asc",
              caseInsensitive: true,
            },
          },
        ],
        "import/no-empty-named-blocks": "error",
        "import/no-mutable-exports": "error",
        "import/no-cycle": "error",
        "import/extensions": [
          "warn",
          "always",
          {
            ts: "never",
            tsx: "never",
            js: "never",
            jsx: "never",
            mjs: "never",
          },
        ],
        "import/newline-after-import": "warn",
        "import/no-anonymous-default-export": "warn",
        "import/no-default-export": "error",
        "import/no-duplicates": [
          "error",
          {
            "prefer-inline": true,
          },
        ],
        "@typescript-eslint/consistent-type-imports": [
          "warn",
          {
            prefer: "type-imports",
            fixStyle: "inline-type-imports",
            disallowTypeAnnotations: false,
          },
        ],
        "@typescript-eslint/no-misused-promises": [
          "error",
          {
            checksVoidReturn: {
              attributes: false,
            },
          },
        ],
        // false negatives
        "import/namespace": ["off"],
        "no-empty-pattern": "off",
        "@typescript-eslint/no-empty-object-type": [
          "error",
          // `interface SpecificVariantProps extends VariantProps {}` is fine
          { allowInterfaces: "with-single-extends" },
        ],
        // make sure to `await` inside try…catch
        "@typescript-eslint/return-await": ["error", "in-try-catch"],
        "@typescript-eslint/no-confusing-void-expression": [
          "error",
          { ignoreArrowShorthand: true },
        ],
        // empty interfaces are fine, e.g. React component that extends other component, but with no additional props
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/array-type": [
          "warn",
          { default: "array-simple", readonly: "array-simple" },
        ],
        // allow unused vars prefixed with `_`
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/restrict-template-expressions": [
          "error",
          // numbers and booleans are fine in template strings
          { allowNumber: true, allowBoolean: true },
        ],
        "react/no-unescaped-entities": "off",
        // notFound in Tanstack Router is thrown
        "@typescript-eslint/only-throw-error": "off",
      },
    },
    eslintPluginPrettierRecommended,
    {
      files: [
        "playwright.config.ts",
        "tailwind.config.ts",
        "vite.config.ts",
        "{app,pages}/**/*.ts?(x)",
        "**/*.stories.ts?(x)",
        ".storybook/**/*.ts?(x)",
      ],
      rules: {
        "import/no-default-export": "off",
      },
    },
  );
