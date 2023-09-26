import sortKeys from 'eslint-plugin-sort-keys'
import lincy from '@lincy/eslint-config'

const config = lincy(
    undefined,
    {
        files: ['src/**/*.ts'],
        plugins: {
            'sort-keys': sortKeys,
        },
        rules: {
            'sort-keys/sort-keys-fix': 'error',
        },
    },
)

export default config
