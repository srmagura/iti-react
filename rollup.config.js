import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'

export default {
    input: 'src/index.ts',
    external: ['react', 'moment-timezone', 'lodash', 'real-cancellable-promise', 'immer'],
    output: [
        {
            file: 'dist/index.mjs',
            format: 'es',
        },
        {
            dir: 'dist',
            format: 'cjs',
        },
    ],
    plugins: [
        commonjs(),
        typescript({
            exclude: ['*.test.ts?(x)', '**/__TestHelpers__/**/*'],
            sourceMap: false,
        }),
        copy({
            targets: [{ src: 'src/*.scss', dest: 'dist' }],
        }),
    ],
}
