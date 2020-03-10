# @interface-technologies/eslint-config

Currently only supports React web apps. A React Native config may be added in the future.

Install the package and its peer dependencies with
```
yarn add --dev @interface-technologies/eslint-config eslint eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-redux-saga redux-saga eslint-plugin-promise
```

Then set your `.eslintrc.js` to 
```
module.exports = {
    extends: "@interface-technologies"
}
```
and add overrides where necessary.