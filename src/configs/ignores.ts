import type { FlatESLintConfigItem } from 'eslint-define-config'
import { GLOB_EXCLUDE } from '../globs'
import type { OptionsOverrides } from '../types'

export function ignores(options: OptionsOverrides = {}): FlatESLintConfigItem[] {
    const {
        ignores = [],
    } = options

    return [
        {
            ignores: [
                ...GLOB_EXCLUDE,
                ...ignores,
            ],
        },
    ]
}
