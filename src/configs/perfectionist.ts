import type { OptionsOverrides, TypedFlatConfigItem } from '../types'

import { pluginPerfectionist } from '../plugins'

/**
 * Optional perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(
    options: OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
    const {
        overrides = {},
    } = options

    return [
        {
            name: 'eslint/perfectionist/setup',
            plugins: {
                perfectionist: pluginPerfectionist,
            },
            rules: {
                'perfectionist/sort-exports': ['error', { order: 'asc', type: 'natural' }],
                'perfectionist/sort-imports': ['error', {
                    groups: [
                        'type',
                        'builtin-type',
                        ['index-type', 'parent-type', 'sibling-type', 'internal-type'],
                        'builtin',
                        'external',
                        'internal',
                        ['index', 'parent', 'sibling'],
                        'side-effect',
                        'object',
                        'unknown',
                    ],
                    internalPattern: ['^~/.*', '^@/.*'],
                    newlinesBetween: 'ignore',
                    order: 'asc',
                    type: 'natural',
                }],
                'perfectionist/sort-named-exports': ['error', { order: 'asc', type: 'natural' }],
                'perfectionist/sort-named-imports': ['error', { order: 'asc', type: 'natural' }],
                ...overrides,
            },
        },
    ]
}
