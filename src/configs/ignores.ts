import type { FlatConfigItem, OptionsIgnores } from '../types'
import { GLOB_EXCLUDE } from '../globs'

export async function ignores(options: OptionsIgnores = {}): Promise<FlatConfigItem[]> {
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
