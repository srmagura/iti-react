_WARNING: Does not follow semver!_ Review `Changelog.md` before updating.

# @interface-technologies/iti-react-core

Hooks and utilities that work in both React DOM and React Native projects.

Features:

-   Form validation
-   Hooks for querying data (switching to react-query for new projects)

# @interface-technologies/iti-react

Hooks, utilities, and components for React DOM projects. Exports everything from `iti-react-core`. This means that every function/type/variable in the `iti-react-core` API documentation is also in the `iti-react` documentation.

Features:

-   Form inputs for selects, time, date, phone number, time zone, files
-   Commonly-used components: Bootstrap modal dialog, confirmation dialog, pager, submit button with loading indicator

## Usage

1.  `yarn add --exact @interface-technologies/iti-react`
2.  Install the required peer dependencies: `yarn add react-datepicker @popperjs/core bootstrap react react-dom react-router-dom`
3.  Add `@import '~@interface-technologies/iti-react/index';` to your top-level SCSS file.
4.  Add
    ```ts
    declare module 'input-format'
    declare module 'input-format/react'
    ```
    to a `.d.ts` file in your project.
5.  Add
    ```ts
    moduleNameMapper: {
        '\\.css$': '<rootDir>/src/__tests__/__helpers__/CssStub.js',
    },
    ```
    to your `jest.config.js` to mock out CSS files. `CssStub.js` should be a file with the contents `module.exports = {}`.

# @interface-technologies/permissions

Exports a `convenientGetFactory` for making an API method that retrieves permissions and a `usePermissions` hook for accessing those permissions in a component.

_Not sure if we will continue to use `usePermissions` after switching to React Query._

# @interface-technologies/check-for-js-bundle-update-saga

Checks `index.html` every few minutes to see if a new JavaScript bundle has been published, then prompts the user to refresh the page if necessary.

# @interface-technologies/eslint-config

An ESLint config that extends `eslint-config-airbnb-typescript` and disables some annoying rules.

Install the package and its peer dependencies with

```
yarn add --dev @interface-technologies/eslint-config @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-config-airbnb eslint-config-airbnb-typescript eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-promise eslint-import-resolver-typescript
```

Then set your `.eslintrc.js` to

```
module.exports = {
    extends: "@interface-technologies"
}
```

## Recommmended Plugins

`eslint-plugin-redux-saga`: if your project uses `redux-saga`. Make these changes to `.eslintrc.js`:

`extends`: Add `'plugin:redux-saga/recommended'`  
`plugins`: Add `'redux-saga'`  
`rules`: Add `'redux-saga/no-unhandled-errors': 'off'`

# @interface-technologies/prettier-config

A Prettier config. Use it by installing the package and adding this to your `package.json`:

```
    "prettier": "@interface-technologies/prettier-config",
```

# @interface-technologies/tsconfig

A TypeScript config. Use it by installing the package and setting your `tsconfig.json` to

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

`noEmit` is explicitly stated so that your project doesn't get cluttered with `.js` files if the base `tsconfig` can't be resolved for some reason.

# Building this Documentation

Run `yarn typedoc` in the root of the repository. The `--watch` option is not supported. You must have a git remote named `github` pointing to https://github.com/srmagura/iti-react.git. It's assumed `origin` points to the ITI Bitbucket.
