import type { ConfigItem, OptionsStylistic } from '../types'
import { pluginAntfu, pluginImport } from '../plugins'

export function imports(options: OptionsStylistic = {}): ConfigItem[] {
    const {
        stylistic = true,
    } = options

    return [
        {
            plugins: {
                antfu: pluginAntfu,
                import: pluginImport,
            },
            rules: {
                'antfu/import-dedupe': 'error',
                'antfu/no-import-node-modules-by-path': 'error',

                'import/first': 'error',
                'import/no-duplicates': 'error',
                'import/no-mutable-exports': 'error',
                'import/no-named-default': 'error',
                'import/no-self-import': 'error',
                'import/no-webpack-loader-syntax': 'error',
                'import/order': 'error',

                ...(stylistic ? {
                    'import/newline-after-import': ['error', { considerComments: true, count: 1 }],
                } : {}),
            },
        },
    ]
}
