import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'

export default {
    input: 'src/index.ts',
    external: [
        'react-datepicker/dist/react-datepicker.css',
        'tippy.js/dist/tippy.css',
        'react/jsx-runtime',
        'react',
        'moment-timezone',
        'lodash',
        'real-cancellable-promise',
        'immer',
        '@interface-technologies/iti-react-core',
        'use-debounce',
        '@vvo/tzdb',
        'react-confirm',
        '@use-it/event-listener',
        'react-router-dom',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/react-fontawesome',
        'copy-to-clipboard',
        '@tippyjs/react',
        'typesafe-actions',
        'react-datepicker',
        'react-select',
        'react-select/async',
        'color',
        'debounce-promise',
        'bootstrap',
        'prop-types',
        'redux-saga/effects',
        '@interface-technologies/iti-react',
    ],
    output: [
        // See https://github.com/JedWatson/react-select/issues/4859,
        // https://trello.com/c/j82Cl2w4/59-iti-react-es-modules
        // {
        //     file: 'dist/index.mjs',
        //     format: 'es',
        // },
        {
            dir: 'dist',
            format: 'cjs',
        },
    ],
    plugins: [
        commonjs(),
        typescript({
            exclude: ['**/*.test.ts?(x)', '**/__TestHelpers__/**/*'],
            sourceMap: false,
        }),
        copy({
            targets: [{ src: 'src/*.scss', dest: 'dist' }],
        }),
    ],
}
