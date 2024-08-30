import type { OptionsIgnores, TypedFlatConfigItem } from '../types'
import { GLOB_EXCLUDE } from '../globs'

export async function ignores(options: OptionsIgnores = {}): Promise<TypedFlatConfigItem[]> {
    const {
        ignores = [],
    } = options

    return [
        {
            ignores: [
                ...GLOB_EXCLUDE,
                ...ignores,
            ],
            name: 'eslint/ignores',
        },
    ]
}
