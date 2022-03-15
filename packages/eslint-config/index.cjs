module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: '.',
        ecmaVersion: 2019,
        sourceType: 'module',
    },
    extends: [
        'airbnb',
        'airbnb-typescript',
        'airbnb/hooks',
        'plugin:promise/recommended',
        'plugin:jest/recommended',
        'plugin:jest-dom/recommended',
        'plugin:testing-library/react',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
    ],
    plugins: ['promise', '@typescript-eslint', 'jest', 'jest-dom', 'testing-library'],
    ignorePatterns: ['*.js', '*.cjs', '*.d.ts', 'dist/'],
    settings: {
        'import/resolver': {
            typescript: {},
        },
        'testing-library/custom-renders': 'off',
    },
    rules: {
        'default-case': 'off',
        'default-case-last': 'off',
        'max-classes-per-file': 'off',
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'no-continue': 'off',
        'no-param-reassign': 'off',
        'no-plusplus': 'off',
        'no-restricted-syntax': [
            'error',
            // Options from https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js
            // with for-of removed
            {
                selector: 'ForInStatement',
                message:
                    'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
            },
            {
                selector: 'LabeledStatement',
                message:
                    'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
            },
            {
                selector: 'WithStatement',
                message:
                    '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
            },
        ],
        'no-shadow': 'off',
        'no-underscore-dangle': 'off',
        'no-void': 'off',
        radix: 'off',

        'no-restricted-imports': [
            'error',
            {
                paths: [
                    {
                        name: 'react-router-dom',
                        importNames: ['useLocation'],
                        message: 'Use location from useReady instead.',
                    },
                ],
            },
        ],

        '@typescript-eslint/explicit-function-return-type': [
            'warn',
            { allowExpressions: true },
        ],

        // Annoying without adding much real value
        '@typescript-eslint/no-misused-promises': 'off',

        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/no-use-before-define': [
            'error',
            { functions: false, classes: false },
        ],
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'variable',
                format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                leadingUnderscore: 'allow',
            },
            {
                selector: 'function',
                format: ['camelCase', 'PascalCase'],
                leadingUnderscore: 'allow',
            },
            {
                selector: 'typeLike',
                format: ['PascalCase'],
            },
        ],

        // TypeScript already checks these things, see:
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#eslint-plugin-import
        'import/named': 'off',
        'import/namespace': 'off',
        'import/default': 'off',
        'import/no-named-as-default-member': 'off',

        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: [
                    '**/*.test.ts?(x)',
                    '**/*.stories.ts?(x)',
                    '**/__devHelpers__/**/*',
                    '**/__testHelpers__/**/*',
                ],
            },
        ],

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
                    'ValidatedMultiSelect',
                ],
            },
        ],

        'react/destructuring-assignment': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/prop-types': 'off',
        'react/function-component-definition': [
            'error',
            { unnamedComponents: 'arrow-function' },
        ],
        'react/require-default-props': 'off',
        'react/state-in-constructor': 'off',
        'react/static-property-placement': ['error', 'static public field'],
        'react/no-did-update-set-state': 'off',
        'react/jsx-no-bind': 'off',

        // Unnecessary because of new JSX transform
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',

        'jest/expect-expect': [
            'error',
            {
                assertFunctionNames: ['expect', 'expect*'],
            },
        ],

        'testing-library/no-node-access': 'off',
        'testing-library/prefer-user-event': 'warn',
        'testing-library/no-await-sync-events': 'error',
        'testing-library/prefer-explicit-assert': 'warn',
    },
    overrides: [
        // Allow using `const Basic: React.VFC = () => <div />` syntax in stories
        {
            files: ['*.stories.tsx'],
            rules: {
                'react/function-component-definition': 'off',
            },
        },
    ],
}
