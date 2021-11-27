module.exports = {
    rules: {
        // This rule has lots of false positives for redux-saga code because
        // yield statements are treated as `any` in typescript
        '@typescript-eslint/no-unsafe-assignment': 'off',

        // Doesn't make sense for reducers
        'default-param-last': 'off',
    },
}
