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
npm install --save-dev prettier eslint @stanfordspezi/spezi-web-configurations`
```

Create `eslint.config.js` file:

```javascript
const { getEslintConfig } = require('@stanfordspezi/spezi-web-configurations')

module.exports = getEslintConfig({ tsconfigRootDir: __dirname })
```

Create `.prettierrc.js` file:

```javascript
const { prettierConfig } = require("@stanfordspezi/spezi-web-configurations");

module.exports = prettierConfig;
```

Now, when you run `eslint . --fix`, code is going to be linted and formatted. 


## License

This project is licensed under the MIT License. See [Licenses](https://github.com/StanfordSpezi/spezi-web-configurations/tree/main/LICENSES) for more information.

## Contributors

This project is developed as part of the Stanford Byers Center for Biodesign at Stanford University.
See [CONTRIBUTORS.md](https://github.com/StanfordSpezi/spezi-web-configurations/tree/main/CONTRIBUTORS.md) for a full list of all Next.js Template contributors.

![Stanford Byers Center for Biodesign Logo](https://raw.githubusercontent.com/StanfordBDHG/.github/main/assets/biodesign-footer-light.png#gh-light-mode-only)
![Stanford Byers Center for Biodesign Logo](https://raw.githubusercontent.com/StanfordBDHG/.github/main/assets/biodesign-footer-dark.png#gh-dark-mode-only)
