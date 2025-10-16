import styleMigrate from '@stylistic/eslint-plugin-migrate'

import lincy from './src'

const config = lincy(
    {
        react: true,
        toml: true,
        stylistic: {
            indent: 4,
            quotes: 'single',
        },
        unocss: true,
        formatters: {
            css: true,
        },
        pnpm: true,
        typescript: {
            erasableOnly: true,
        },
        overrides: {
            stylistic: {
                'antfu/consistent-list-newline': 'off',
            },
            ignores: [
                '**/fixtures',
                '**/_fixtures',
            ],
        },
        ignores: [
            '**/assets1',
            '**/static2',
        ],
    },
    {
        name: 'eslint/other/ignores',
        ignores: [
            '**/assets3',
            '**/static4',
        ],
    },
    {
        name: 'eslint/custom-rules/typescript',
        files: ['src/**/*.ts'],
        rules: {
            'perfectionist/sort-objects': 'error',
        },
    },
    {
        name: 'eslint/custom-rules/typescript',
        files: ['src/configs/*.ts'],
        plugins: {
            'style-migrate': styleMigrate,
        },
        rules: {
            'style-migrate/migrate': ['error', { namespaceTo: 'style' }],
        },
    },
)

export default config
