import { interopDefault } from '../utils'
import type { FlatConfigItem, StylisticConfig, StylisticOverridesConfig } from '../types'
import { pluginAntfu } from '../plugins'

export const StylisticConfigDefaults: StylisticConfig = {
    indent: 4,
    jsx: true,
    quotes: 'single',
    semi: false,
}

export async function stylistic(options: StylisticOverridesConfig = {}): Promise<FlatConfigItem[]> {
    const {
        overrides = {},
        stylistic = StylisticConfigDefaults,
    } = options

    const {
        indent,
        jsx,
        quotes,
        semi,
    } = typeof stylistic === 'boolean' ? StylisticConfigDefaults : stylistic

    const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'))

    const config = pluginStylistic.configs.customize({
        flat: true,
        indent,
        jsx,
        pluginName: 'style',
        quotes,
        semi,
    })

    return [
        {
            name: 'eslint:stylistic',
            plugins: {
                antfu: pluginAntfu,
                style: pluginStylistic,
            },
            rules: {
                ...config.rules,

                'antfu/consistent-list-newline': 'off',
                'antfu/if-newline': 'error',
                'antfu/indent-binary-ops': ['error', { indent }],
                'antfu/top-level-function': 'error',

                'curly': ['error', 'multi-or-nest', 'consistent'],

                ...overrides,
            },
        },
    ]
}
