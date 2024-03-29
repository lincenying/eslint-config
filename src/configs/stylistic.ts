import { interopDefault } from '../utils'
import type { StylisticConfig, StylisticOverridesConfig, TypedFlatConfigItem } from '../types'
import { pluginAntfu } from '../plugins'

export const StylisticConfigDefaults: StylisticConfig = {
    indent: 4,
    jsx: true,
    quotes: 'single',
    semi: false,
}

export async function stylistic(options: StylisticOverridesConfig = {}): Promise<TypedFlatConfigItem[]> {
    const {
        overrides = {},
        stylistic = StylisticConfigDefaults,
    } = options

    const {
        indent,
        jsx,
        quotes,
        semi,
    } = typeof stylistic === 'boolean' ? StylisticConfigDefaults : { ...StylisticConfigDefaults, ...stylistic }

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
                'antfu/top-level-function': 'error',

                'curly': ['error', 'multi-or-nest', 'consistent'],

                // 覆盖`stylistic`默认规则
                'style/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],
                'style/multiline-ternary': ['error', 'never'],

                ...overrides,
            },
        },
    ]
}
