import type { OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '../types'

import { pluginAntfu, pluginImport } from '../plugins'

export async function imports(options: OptionsStylistic & OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
    const {
        overrides = {},
        stylistic = true,
    } = options

    return [
        {
            name: 'eslint/imports/rules',
            plugins: {
                antfu: pluginAntfu,
                import: pluginImport,
            },
            rules: {
                'antfu/import-dedupe': 'error',
                'antfu/no-import-dist': 'error',
                'antfu/no-import-node-modules-by-path': 'error',

                'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
                'import/first': 'error',
                'import/no-duplicates': 'error',
                'import/no-mutable-exports': 'error',
                'import/no-named-default': 'error',
                'import/no-self-import': 'error',
                'import/no-webpack-loader-syntax': 'error',

                ...(stylistic ? {
                    'import/newline-after-import': ['error', { considerComments: true, count: 1 }],
                } : {}),

                ...overrides,
            },
        },
    ]
}
