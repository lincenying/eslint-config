import styleMigrate from '@stylistic/eslint-plugin-migrate'
import lincy from './dist/index.js'

const config = lincy(
    {
        vue: false,
        sortKeys: true,
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
