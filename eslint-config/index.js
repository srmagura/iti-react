module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2017,
        sourceType: 'module'
    },
    extends: [
        'airbnb-typescript',
        'airbnb/hooks',
        'plugin:promise/recommended',
        'plugin:redux-saga/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/react',
        'prettier/@typescript-eslint',
    ],
    plugins: ['promise', 'redux-saga', '@typescript-eslint'],
    rules: {
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'no-param-reassign': 'off',
        'no-restricted-syntax': [
            'error',
            // Options from https://github.com/airbnb/javascript/blob/651280e5a22d08170187bea9a2b1697832c87ebc/packages/eslint-config-airbnb-base/rules/style.js
            // with for-of removed since TypeScript handles iterators in a smarter way than Babel
            {
                selector: 'ForInStatement',
                message:
                    'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
            },
            {
                selector: 'LabeledStatement',
                message:
                    'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
            },
            {
                selector: 'WithStatement',
                message:
                    '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
            }
        ],
        'no-shadow': 'off',
        'no-underscore-dangle': 'off',
        radix: 'off',

        'import/prefer-default-export': 'off',

        'jsx-a11y/label-has-associated-control': [
            'error',
            {
                controlComponents: [
                    'DateInput',
                    'PhoneInput',
                    'TimeZoneInput',
                    'ValidatedInput',
                    'ValidatedAsyncSelect',
                    'ValidatedSelect',
                    'ValidatedMultiSelect'
                ]
            }
        ],

        'react/jsx-props-no-spreading': 'off',
        'react/prop-types': 'off',
        'react/state-in-constructor': 'off',
        'react/static-property-placement': ['error', 'static public field'],

        //'react-hooks/exhaustive-deps': 'off'
    }
}
