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
import tseslint, {
  type InfiniteDepthConfigWithExtends,
} from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
// @ts-ignore
import * as preferArrow from "eslint-plugin-prefer-arrow-functions";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { Processor } from "@typescript-eslint/utils/ts-eslint";
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
  /**
   * Changes every rule to "warning" instead of "error".
   * This prevents ESLint to fail if any rule fails.
   * Useful when migrating large codebases. Use with caution.
   * */
  changeEveryRuleToWarning?: boolean;
};

/**
 * Completely ignores these directories
 * */
const getIgnoredDirs = (): InfiniteDepthConfigWithExtends => ({
  ignores: ["dist", "docs", "out", "coverage", ".next", "**/playwright-report"],
});

/**
 * Basic recommended ESLint rules with overrides
 * */
const getEslintRules = (): InfiniteDepthConfigWithExtends[] => [
  eslint.configs.recommended,
  { rules: { "no-empty-pattern": "off" } },
];

/*
 * Rules for import plugin.
 * Auto rules reordering, prevents cycles, forces lack of extensions.
 * */
const getImportRules = (
  tsConfigsDirs: string[],
): InfiniteDepthConfigWithExtends[] => [
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    settings: {
      "import/resolver": {
        typescript: { project: ["./tsconfig.json", ...tsConfigsDirs] },
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
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
      // false negatives
      "import/namespace": ["off"],
    },
  },
];

/**
 * Injects Node globals for Node-based configuration files
 * */
const getNodeGlobals = (): InfiniteDepthConfigWithExtends => ({
  files: [
    "**/eslint.config.?(c)js",
    "**/.prettierrc.?(c)js",
    "**/postcss.config.?(c)js",
    "**/tailwind.config.?(c)js",
  ],
  languageOptions: {
    globals: globals.node,
  },
});

/**
 * Enforces arrow functions instead of named function
 * Automatically replaces every named function with an arrow function.
 * */
const getPreferArrowFunctions = (): InfiniteDepthConfigWithExtends => ({
  files: ["**/*.{js,jsx,ts,tsx}"],
  plugins: {
    "prefer-arrow-functions": preferArrow,
  },
  rules: {
    "prefer-arrow-functions/prefer-arrow-functions": [
      "warn",
      {
        allowedNames: [],
        allowNamedFunctions: false,
        allowObjectProperties: true,
        classPropertiesAllowed: false,
        disallowPrototype: false,
        returnStyle: "unchanged",
        singleReturnOnly: false,
      },
    ],
  },
});

/**
 * Configures TypeScript ESLint rules.
 * This config is very strict, some repositories might need overrides.
 *
 * It relies on TSC type-checking, which might slow down linting for large codebases.
 * Read more: https://typescript-eslint.io/getting-started/typed-linting/
 * */
const getTslint = (
  tsconfigRootDir: string,
): InfiniteDepthConfigWithExtends => ({
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
  processor: {
    preprocess: (text) => [text],
    postprocess: (messagesList) =>
      messagesList.flat().map((message) => {
        if (message.ruleId === "@typescript-eslint/naming-convention") {
          return {
            ...message,
            message:
              "Variable name `e` is not allowed. Use a more descriptive name like `error` or `event`.",
          };
        }
        return message;
      }),
    supportsAutofix: true,
  } satisfies Processor.ProcessorModule,
  rules: {
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
    // notFound in Tanstack Router is thrown
    "@typescript-eslint/only-throw-error": "off",
    "@typescript-eslint/no-restricted-imports": [
      "error",
      {
        name: "react",
        importNames: ["default"],
        message:
          "Import specific types directly: import { ReactNode } from 'react'",
      },
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "variable",
        format: null,
        custom: {
          regex: "^e$",
          match: false,
        },
      },
      {
        selector: "parameter",
        format: null,
        custom: {
          regex: "^e$",
          match: false,
        },
      },
    ],
  },
});

/**
 * Configures react, react hooks plugin and customized rules
 * */
const getReactPlugins = (): InfiniteDepthConfigWithExtends[] => [
  reactHooks.configs["recommended-latest"],
  {
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      "react/jsx-curly-brace-presence": [
        "warn",
        { props: "never", children: "never", propElementValues: "always" },
      ],
      "react/no-unescaped-entities": "off",
      "react/jsx-fragments": ["warn", "syntax"],
      "react/prop-types": "off",
      "react/self-closing-comp": [
        "warn",
        {
          component: true,
          html: false,
        },
      ],
    },
  },
  reactPlugin.configs.flat["jsx-runtime"],
];

/**
 * Disables default export rule for tools that need to use it.
 * */
const getIgnoreDefaultExportRule = (): InfiniteDepthConfigWithExtends => ({
  files: [
    "{app,pages}/**/*.ts?(x)", // app or pages directories for Next codebases
    "**/playwright.config.ts",
    "**/tailwind.config.ts",
    "**/vite.config.ts",
    "**/*.stories.ts?(x)",
    "**/.storybook/**/*.ts?(x)",
    "**/.prettierrc.{ts,js}",
    "**/eslint.config.{ts,js}",
  ],
  rules: {
    "import/no-default-export": "off",
  },
});

/**
 * Transforms ALL rules severities to 'warn'
 * */
const getTransformAllRulesToWarn = (): InfiniteDepthConfigWithExtends => ({
  rules: {},
  languageOptions: {},
  processor: {
    preprocess: (text) => [text],
    postprocess: (messages) =>
      messages.flat().map((message) => ({
        ...message,
        severity: 1, // 1 is 'warn', 2 is 'error'
      })),
    supportsAutofix: true,
  } satisfies Processor.ProcessorModule,
});

/**
 * Forces correct prettier formatting with auto-fix support
 * */
const getPrettierPlugin = () => eslintPluginPrettierRecommended;

export const getEslintConfig = ({
  tsconfigRootDir,
  tsConfigsDirs = [],
  changeEveryRuleToWarning,
}: EslintConfigParams) => {
  const ignoredDirs = getIgnoredDirs();
  const eslintRules = getEslintRules();
  const importRules = getImportRules(tsConfigsDirs);
  const nodeGlobals = getNodeGlobals();
  const tslint = getTslint(tsconfigRootDir);
  const preferArrowFunctions = getPreferArrowFunctions();
  const reactPlugins = getReactPlugins();
  const prettierPlugin = getPrettierPlugin();
  const ignoreDefaultExportRule = getIgnoreDefaultExportRule();
  const transformAllRulesToWarn = getTransformAllRulesToWarn();

  return tseslint.config(
    ignoredDirs,
    ...eslintRules,
    ...importRules,
    nodeGlobals,
    tslint,
    preferArrowFunctions,
    ...reactPlugins,
    prettierPlugin,
    ignoreDefaultExportRule,
    changeEveryRuleToWarning ? transformAllRulesToWarn : {},
  );
};
