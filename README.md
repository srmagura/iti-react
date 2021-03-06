# WARNING: Not intended for the general public

`iti-react` is MIT licensed and you may use it however you wish! _However_,
`iti-react` is intended for internal use in Interface Technologies projects and
may not be suitable for your project. In particular:

-   We don't follow semver and make a lot of breaking changes. Review
    `CHANGELOG.md` before updating.
-   The TypeScript source is published directly to npm. We don't transpile to
    normal JavaScript before publishing.
-   The library assumes you are using Bootstrap 5, Moment.js, Tippy.js, and
    FontAwesome 5.
-   `permissions` relies on your backend supporting a very specific "get
    permissions" API method.
-   `check-for-js-bundle-update-saga` depends on Redux Saga and requires a
    hidden element to be in your `index.html`.

If you'd still like to use `iti-react`, feel free to contact me at
srmagura@gmail.com.

In the future, parts of the project may be broken out into standalone packages
that are intended for the general public.

# @interface-technologies/iti-react-core

Hooks and utilities that work in both React DOM and React Native projects.

Features:

-   Form validation
-   Hooks for querying data (switching to react-query for new projects)

# @interface-technologies/iti-react

Hooks, utilities, and components for React DOM projects. Exports everything from
`iti-react-core`. This means that every function/type/variable in the
`iti-react-core` API documentation is also in the `iti-react` documentation.

Features:

-   Form inputs for selects, time, date, phone number, time zone, files
-   Commonly-used components: Bootstrap modal dialog, confirmation dialog,
    pager, submit button with loading indicator

## Usage

1.  `yarn add --exact @interface-technologies/iti-react`
2.  Install the required peer dependencies: `yarn add react-datepicker @popperjs/core bootstrap react react-dom react-router-dom`
3.  Add `@import '~@interface-technologies/iti-react/dist/iti-react.scss';` to your top-level
    SCSS file.

# @interface-technologies/permissions

**This is a legacy package not to be used in new projects.**

Exports a `convenientGetFactory` for making an API method that retrieves
permissions and a `usePermissions` hook for accessing those permissions in a
component.

# @interface-technologies/check-for-js-bundle-update-saga

Checks `index.html` every few minutes to see if a new JavaScript bundle has been
published, then prompts the user to refresh the page if necessary.

# @interface-technologies/eslint-config

An ESLint config that extends `eslint-config-airbnb-typescript` and disables
some annoying rules.

Install the package and its peer dependencies with

```
yarn add --dev @interface-technologies/eslint-config @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-config-airbnb eslint-config-airbnb-typescript eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-promise eslint-import-resolver-typescript eslint-plugin-jest eslint-plugin-testing-library
```

Then set your `.eslintrc.js` to

```
module.exports = {
    extends: "@interface-technologies"
}
```

## Recommmended Plugins

`eslint-plugin-redux-saga`: if your project uses `redux-saga`. Make these
changes to `.eslintrc.js`:

`extends`: Add `'plugin:redux-saga/recommended'`  
`plugins`: Add `'redux-saga'`  
`rules`: Add `'redux-saga/no-unhandled-errors': 'off'`

# @interface-technologies/prettier-config

A Prettier config. Use it by installing the package and adding this to your
`package.json`:

```json
    "prettier": "@interface-technologies/prettier-config",
```

# @interface-technologies/tsconfig

A TypeScript config. Use it by installing the package and setting your
`tsconfig.json` to

```json
{
    "extends": "@interface-technologies/tsconfig",
    "compilerOptions": {
        "noEmit": true
    }
}
```

If using absolute imports:

```json
{
    "extends": "@interface-technologies/tsconfig",
    "compilerOptions": {
        "baseUrl": "./src",
        "noEmit": true
    }
}
```

`noEmit` is explicitly stated so that your project doesn't get cluttered with
`.js` files if the base `tsconfig` can't be resolved for some reason.

# @interface-technologies/lint-staged-config

A config for `lint-staged` that lints your TypeScript files and prettifies
everything.

1. Install the package as well as `lint-staged`.
2. **Add a `package.json` script: `"lint-staged": "lint-staged --no-stash"`.
   `lint-staged` stashing is stupid and will cause you to lose your work.**
3. Create a `lint-staged.config.js` file:

```js
const getLintStagedConfig = require('@interface-technologies/lint-staged-config')

module.exports = getLintStagedConfig()

// **OR**

module.exports = getLintStagedConfig({ lintIgnorePatterns: ['**/Models/Generated/**/*'] })
```

# @interface-technologies/webpack-config

**This is a legacy package not to be used in new projects.** I may resurrect it at some point.

Exports a `getWebpackConfig` function that returns a Webpack configuration
object, except the `entry` key which you need to set yourself.

1. Install the package and its peer dependencies:

```bash
yarn add --dev @interface-technologies/webpack-config autoprefixer css-loader postcss postcss-loader sass-loader style-loader ts-loader typescript webpack webpack-cli webpack-dev-server
```

2. Create a Webpack config file similar to this:

```js
const path = require('path')
const getWebpackConfig = require('@interface-technologies/webpack-config')

module.exports = (env, argv) => {
    return {
        ...getWebpackConfig({
            mode: argv.mode,
            workspacePackageJsonPath: path.resolve(__dirname, '../../package.json'),
            outputPath: path.resolve(__dirname, '../Website/wwwroot/dist'),

            enableBugsnagUpload: !!env.enableBugsnagUpload,
            bugsnagApiKey: 'API KEY HERE',

            devServerPort: 12345,
            enableBundleAnalyzer: false,
        }),
        entry: {
            app: path.resolve(__dirname, './src/App.tsx'),
        },
    }
}
```

# @interface-technologies/jest-config

A Jest configuration. It enables fake timers and automatically resets mocks
before each test.

1. `yarn add --dev @interface-technologies/jest-config`
2. Add `jest.config.js`:

```js
module.exports = {
    ...require('@interface-technologies/jest-config'),

    // other config here
}
```

# Developer Documentation

See `CONTRIBUTING.md`.
