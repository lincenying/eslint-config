import { ensurePackages, interopDefault } from '../utils'
import type { OptionsUnoCSS, TypedFlatConfigItem } from '../types'

export async function unocss(
    options: OptionsUnoCSS = {},
): Promise<TypedFlatConfigItem[]> {
    const {
        attributify = true,
        overrides = {},
        strict = false,
    } = options

    await ensurePackages([
        '@unocss/eslint-plugin',
    ])

    const [
        pluginUnoCSS,
    ] = await Promise.all([
        interopDefault(import('@unocss/eslint-plugin')),
    ] as const)

    return [
        {
            name: 'eslint:unocss',
            plugins: {
                unocss: pluginUnoCSS,
            },
            rules: {
                'unocss/order': 'off',
                ...attributify ? {
                    'unocss/order-attributify': 'warn',
                } : {},
                ...strict ? {
                    'unocss/blocklist': 'error',
                } : {},
                ...overrides,
            },
        },
    ]
}
