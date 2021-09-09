# Packages Overview

## @interface-technologies/iti-react-core

Hooks and utilities that work in both React DOM and React Native projects.

## @interface-technologies/iti-react

Hooks, utilities, and components for React DOM projects. Exports everything from `iti-react-core`. This means that every function/type/variable in the `iti-react-core` API documentation is also in the `iti-react` documentation.

## @interface-technologies/permissions

Exports a `convenientGetFactory` for making an API method that retrieves permissions and a `usePermissions` hook for accessing those permissions in a component.

## @interface-technologies/check-for-js-bundle-update-saga

Checks `index.html` every few minutes to see if a new JavaScript bundle has been published, then prompts the user to refresh the page if necessary.

## @interface-technologies/eslint-config

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

### Recommmended Plugins

`eslint-plugin-redux-saga`: if your project uses `redux-saga`. Make these changes to `.eslintrc.js`:

`extends`: Add `'plugin:redux-saga/recommended'`  
`plugins`: Add `'redux-saga'`  
`rules`: Add `'redux-saga/no-unhandled-errors': 'off'`

## @interface-technologies/prettier-config

A Prettier config. Use it by installing the package and adding this to your `package.json`:
```
    "prettier": "@interface-technologies/prettier-config",
```

# Building this Documentation

Run `yarn typedoc` in the root of the repository. The `--watch` option is not supported.