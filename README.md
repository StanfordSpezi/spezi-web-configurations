<!--

This source file is part of the Stanford Biodesign Digital Health Spezi Web Configurations open-source project

SPDX-FileCopyrightText: 2024 Stanford University and the project authors (see CONTRIBUTORS.md)

SPDX-License-Identifier: MIT

-->

# Biodesign Digital Health Spezi Web Configurations

[![Build and Test](https://github.com/StanfordSpezi/spezi-web-configurations/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/StanfordSpezi/spezi-web-configurations/actions/workflows/build-and-test.yml)
[![Deployment](https://github.com/StanfordSpezi/spezi-web-configurations/actions/workflows/deployment.yml/badge.svg)](https://github.com/StanfordSpezi/spezi-web-configurations/actions/workflows/deployment.yml)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.10052055.svg)](https://doi.org/10.5281/zenodo.10052055)

## Getting Started

A shared linting and formatter configurations. Uses Prettier and ESLint. Pre-configured for you to easily plug into your codebases. 

Configurations are opinionated and strict. We aim to catch as many possible mistakes or elements we consider harmful practices early. Some rules are meant to be broken once in a while, with an explanation comment around them.

### Installation

Install dependencies:

```bash
npm install --save-dev prettier eslint @stanfordspezi/spezi-web-configurations
```

Create `eslint.config.js` file.

If aiming for React, use:

```javascript
const { getEslintReactConfig } = require('@stanfordspezi/spezi-web-configurations')

module.exports = getEslintReactConfig({ tsconfigRootDir: __dirname })
```

If aiming for Node application, use:

```javascript
const { getEslintNodeConfig } = require('@stanfordspezi/spezi-web-configurations')

module.exports = getEslintNodeConfig({ tsconfigRootDir: __dirname })
```

Create `.prettierrc.js` file:

```javascript
const { prettierConfig } = require("@stanfordspezi/spezi-web-configurations");

module.exports = prettierConfig;
```

Now, when you run `eslint . --fix`, code is going to be linted and formatted. 


### ESLint customization

We aim to make this config mostly plug and play. You can adjust ESLint to your needs by passing additional configuration pieces.

```javascript
module.exports = [
    ...getEslintNodeConfig({ tsconfigRootDir: __dirname }),
    {
        ignores: ["lib/**/*"], // Ignore generated build files
    },
    {
        rules: {
            "@typescript-eslint/no-non-null-assertion": "off", // ignore unwanted rule
        },
    },
]
```


For more complex scenarios, we expose smaller pieces of configuration. You can use them and do micro-adjustments. This is not the recommended approach.


```javascript
const {
    getEslintRules,
    getNodeGlobals,
    getPreferArrowFunctions,
    getReactPlugins,
    getPrettierPlugin,
    getTslint,
} = require("@stanfordspezi/spezi-web-configurations");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
    ...getEslintRules(),
    getNodeGlobals(),
    {
        ...getTslint(),
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir,
            },
        },
    },
    getPreferArrowFunctions(),
    ...getReactPlugins(),
    ...getPrettierPlugin(),
);
```


## License

This project is licensed under the MIT License. See [Licenses](https://github.com/StanfordSpezi/spezi-web-configurations/tree/main/LICENSES) for more information.

## Contributors

This project is developed as part of the Stanford Byers Center for Biodesign at Stanford University.
See [CONTRIBUTORS.md](https://github.com/StanfordSpezi/spezi-web-configurations/tree/main/CONTRIBUTORS.md) for a full list of all Next.js Template contributors.

![Stanford Byers Center for Biodesign Logo](https://raw.githubusercontent.com/StanfordBDHG/.github/main/assets/biodesign-footer-light.png#gh-light-mode-only)
![Stanford Byers Center for Biodesign Logo](https://raw.githubusercontent.com/StanfordBDHG/.github/main/assets/biodesign-footer-dark.png#gh-dark-mode-only)
