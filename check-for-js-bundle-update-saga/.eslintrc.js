module.exports = {
    extends: ['@interface-technologies', 'plugin:redux-saga/recommended'],
    parserOptions: {
        tsconfigRootDir: __dirname,
    },
    plugins: ['redux-saga'],
    rules: {
        'redux-saga/no-unhandled-errors': 'off',
    },
}
