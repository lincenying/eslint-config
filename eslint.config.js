import sortKeys from 'eslint-plugin-sort-keys'
import lincy from '@lincy/eslint-config'
import styleMigrate from '@stylistic/eslint-plugin-migrate'

const config = lincy(
    {
        vue: false,
        stylistic: {
            indent: 4,
            quotes: 'single',
        },
        overrides: {
            stylistic: {
                'antfu/consistent-list-newline': 'off',
            },
            ignores: [
                '**/assets',
                '**/static',
            ],
        },
    },
    {
        files: ['src/**/*.ts'],
        plugins: {
            'sort-keys': sortKeys,
        },
        rules: {
            'sort-keys/sort-keys-fix': 'error',
        },
    },
    {
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
