import type { OptionsOverrides, OptionsStylistic, StylisticConfig, TypedFlatConfigItem } from '../types'

import { pluginAntfu } from '../plugins'
import { interopDefault } from '../utils'

export const StylisticConfigDefaults: StylisticConfig = {
    indent: 4,
    jsx: true,
    lessOpinionated: false,
    quotes: 'single',
    semi: false,
}

export async function stylistic(options: OptionsStylistic & OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
    const {
        overrides = {},
        stylistic = StylisticConfigDefaults,
    } = options

    const {
        indent,
        jsx,
        lessOpinionated,
        quotes,
        semi,
    } = typeof stylistic === 'boolean' ? StylisticConfigDefaults : { ...StylisticConfigDefaults, ...stylistic }

    const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'))

    const config = pluginStylistic.configs.customize({
        indent,
        jsx,
        pluginName: 'style',
        quotes,
        semi,
    })

    return [
        {
            name: 'eslint/stylistic/rules',
            plugins: {
                antfu: pluginAntfu,
                style: pluginStylistic,
            },
            rules: {
                ...config.rules,

                'antfu/consistent-chaining': 'error',
                'antfu/consistent-list-newline': 'off',

                ...(lessOpinionated ? {
                    curly: ['error', 'all'],
                } : {
                    'antfu/curly': 'error',
                    'antfu/if-newline': 'error',
                    'antfu/top-level-function': 'error',
                }),

                // 覆盖`stylistic`默认规则
                'style/brace-style': ['error', 'stroustrup'],
                'style/generator-star-spacing': ['error', { after: true, before: false }],

                'style/multiline-ternary': ['error', 'never'],
                'style/yield-star-spacing': ['error', { after: true, before: false }],

                ...overrides,
            },
        },
    ]
}
