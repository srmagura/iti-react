# @interface-technologies/eslint-config

Currently only supports React web apps. A React Native config may be added in the future.

Install the package and its peer dependencies with

```
yarn add --dev @interface-technologies/eslint-config @typescript-eslint/eslint-plugin eslint eslint-config-prettier eslint-config-airbnb-typescript eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-promise
```

Then set your `.eslintrc.js` to

```
module.exports = {
    extends: "@interface-technologies"
}
```

and add overrides where necessary.

## Recommmended plugins

`eslint-plugin-redux-saga`: if your project uses `redux-saga`. Make these changes to `.eslintrc.js`:

`extends`: Add `'plugin:redux-saga/recommended'`
`plugins`: Add `'redux-saga'`
