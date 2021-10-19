const micromatch = require('micromatch')

module.exports = function getLintStagedConfig(options) {
    return {
        '*.ts?(x)': (files) => {
            let lintFiles = files

            // Don't lint files in .eslintignore
            if (options?.lintIgnorePatterns)
                lintFiles = micromatch.not(files, options.lintIgnorePatterns)

            return [
                `eslint --max-warnings 0 --fix ${lintFiles.join(' ')}`,
                `prettier --write ${files.join(' ')}`,
            ]
        },
        '*.{md,js,cjs,mjs,yml,yaml,json,scss}': 'prettier --write',
    }
}
