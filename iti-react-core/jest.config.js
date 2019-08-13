module.exports = {
    preset: 'ts-jest',
    globals: {
        'ts-jest': {
            diagnostics: {
                ignoreCodes: ['151001']
            }
        }
    }
}