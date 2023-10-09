import type { ConfigItem, OptionsIgnores } from '../types'
import { GLOB_EXCLUDE } from '../globs'

export function ignores(options: OptionsIgnores = {}): ConfigItem[] {
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
