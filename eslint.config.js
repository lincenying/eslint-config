import stylisticMigrate from '@stylistic/eslint-plugin-migrate'
import sortKeys from 'eslint-plugin-sort-keys'
import lincy from '@lincy/eslint-config'

const config = lincy(
    undefined,
    {
        files: ['src/**/*.ts'],
        plugins: {
            '@stylistic/migrate': stylisticMigrate,
            'sort-keys': sortKeys,
        },
        rules: {
            '@stylistic/migrate/rules': 'error',
            'sort-keys/sort-keys-fix': 'error',
        },
    },
)

export default config
