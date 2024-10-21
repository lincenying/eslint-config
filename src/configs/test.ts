import type { OptionsFiles, OptionsIsInEditor, OptionsOverrides, TypedFlatConfigItem } from '../types'

import { GLOB_TESTS } from '../globs'
import { interopDefault } from '../utils'

export async function test(options: OptionsFiles & OptionsIsInEditor & OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
    const {
        files = GLOB_TESTS,
        isInEditor = false,
        overrides = {},
    } = options

    const [
        pluginVitest,
        pluginNoOnlyTests,
    ] = await Promise.all([
        interopDefault(import('@vitest/eslint-plugin')),
        // @ts-expect-error missing types
        interopDefault(import('eslint-plugin-no-only-tests')),
    ] as const)

    return [
        {
            name: 'eslint/test/setup',
            plugins: {
                test: {
                    ...pluginVitest,
                    rules: {
                        ...pluginVitest.rules,
                        // extend `test/no-only-tests` rule
                        ...pluginNoOnlyTests.rules,
                    },
                },
            },
        },
        {
            files,
            name: 'eslint/test/rules',
            rules: {
                'test/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
                'test/no-identical-title': 'error',
                'test/no-import-node-test': 'error',
                'test/no-only-tests': isInEditor ? 'off' : 'error',
                'test/prefer-hooks-in-order': 'error',
                'test/prefer-lowercase-title': 'error',

                // Disables
                ...{
                    'antfu/no-top-level-await': 'off',
                    'no-unused-expressions': 'off',
                    'node/prefer-global/process': 'off',
                    'ts/explicit-function-return-type': 'off',
                },

                ...overrides,
            },
        },
    ]
}
