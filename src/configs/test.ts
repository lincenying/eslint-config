import type { ConfigItem, OptionsIsInEditor, OptionsOverrides } from '../types'
import { pluginNoOnlyTests } from '../plugins'
import { GLOB_TESTS } from '../globs'

export function test(options: OptionsIsInEditor & OptionsOverrides = {}): ConfigItem[] {
    const {
        isInEditor = false,
        overrides = {},
    } = options

    return [
        {
            plugins: {
                'no-only-tests': pluginNoOnlyTests,
            },
        },
        {
            files: GLOB_TESTS,
            rules: {
                'no-only-tests/no-only-tests': isInEditor ? 'off' : 'error',

                ...overrides,
            },
        },
    ]
}
