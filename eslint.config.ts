// @ts-expect-error missing types
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
        formatters: true,
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
