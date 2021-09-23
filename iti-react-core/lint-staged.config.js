const micromatch = require('micromatch')

module.exports = {
    '*.ts?(x)': (files) => {
        // Don't lint files in .eslintignore
        const lintFiles = micromatch.not(files, '**/__tests__/**/*')

        return [
            `eslint --max-warnings 0 --fix ${lintFiles.join(' ')}`,
            `prettier --write ${files.join(' ')}`,
        ]
    },
    '*.{md,js,cjs,yml,json,scss}': 'prettier --write',
}
