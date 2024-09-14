import type { OptionsOverrides, TypedFlatConfigItem } from '../types'

import { pluginNode } from '../plugins'

export async function node(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
    const {
        overrides = {},
    } = options

    return [
        {
            name: 'eslint/node/rules',
            plugins: {
                node: pluginNode,
            },
            rules: {
                'node/handle-callback-err': ['error', '^(err|error)$'],
                'node/no-deprecated-api': 'error',
                'node/no-exports-assign': 'error',
                'node/no-new-require': 'error',
                'node/no-path-concat': 'error',
                'node/prefer-global/buffer': ['error', 'never'],
                'node/prefer-global/process': ['error', 'never'],
                'node/process-exit-as-throw': 'error',

                ...overrides,
            },
        },
    ]
}
