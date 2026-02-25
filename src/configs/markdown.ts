import type { OptionsComponentExts, OptionsFiles, OptionsMarkdown, TypedFlatConfigItem } from '../types'

import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors'

import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from '../globs'
import { interopDefault } from '../utils'

export async function markdown(
    options: OptionsFiles & OptionsComponentExts & OptionsMarkdown = {},
): Promise<TypedFlatConfigItem[]> {
    const {
        componentExts = [],
        files = [GLOB_MARKDOWN],
        gfm = true,
        overrides = {},
        overridesMarkdown = {},
    } = options

    const markdown = await interopDefault(import('@eslint/markdown'))

    return [
        {
            name: 'eslint/markdown/setup',
            plugins: {
                markdown,
            },
        },
        {
            files,
            ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
            name: 'eslint/markdown/processor',
            processor: mergeProcessors([
                markdown.processors!.markdown,
                processorPassThrough,
            ]),
        },
        {
            files,
            language: gfm ? 'markdown/gfm' : 'markdown/commonmark',
            name: 'eslint/markdown/parser',
        },
        {
            files,
            name: 'eslint/markdown/rules',
            rules: {
                ...markdown.configs.recommended.at(0)?.rules,
                // https://github.com/eslint/markdown/issues/294
                'markdown/no-missing-label-refs': 'off',
                ...overridesMarkdown,
            },
        },
        {
            files,
            name: 'eslint/markdown/disables/markdown',
            rules: {
                // Disable rules do not work with markdown sourcecode.
                'command/command': 'off',
                'no-irregular-whitespace': 'off',
                'perfectionist/sort-exports': 'off',
                'perfectionist/sort-imports': 'off',
                'regexp/no-legacy-features': 'off',
                'regexp/no-missing-g-flag': 'off',
                'regexp/no-useless-dollar-replacements': 'off',
                'regexp/no-useless-flag': 'off',
                'style/indent': 'off',
            },
        },
        {
            files: [
                GLOB_MARKDOWN_CODE,
                ...componentExts.map(ext => `${GLOB_MARKDOWN}/**/*.${ext}`),
            ],
            languageOptions: {
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                    },
                },
            },
            name: 'eslint/markdown/disables/code',
            rules: {
                'antfu/no-top-level-await': 'off',
                'import/newline-after-import': 'off',

                'no-alert': 'off',
                'no-console': 'off',
                'no-labels': 'off',
                'no-lone-blocks': 'off',
                'no-restricted-syntax': 'off',
                'no-undef': 'off',
                'no-unused-expressions': 'off',
                'no-unused-labels': 'off',
                'no-unused-vars': 'off',

                'node/prefer-global/process': 'off',
                'style/comma-dangle': 'off',

                'style/eol-last': 'off',
                'ts/consistent-type-imports': 'off',
                'ts/explicit-function-return-type': 'off',
                'ts/no-namespace': 'off',
                'ts/no-redeclare': 'off',
                'ts/no-require-imports': 'off',
                'ts/no-unused-expressions': 'off',
                'ts/no-unused-vars': 'off',
                'ts/no-use-before-define': 'off',

                'unicode-bom': 'off',
                'unused-imports/no-unused-imports': 'off',
                'unused-imports/no-unused-vars': 'off',

                // Type aware rules
                ...{
                    'ts/await-thenable': 'off',
                    'ts/dot-notation': 'off',
                    'ts/no-floating-promises': 'off',
                    'ts/no-for-in-array': 'off',
                    'ts/no-implied-eval': 'off',
                    'ts/no-misused-promises': 'off',
                    'ts/no-unnecessary-type-assertion': 'off',
                    'ts/no-unsafe-argument': 'off',
                    'ts/no-unsafe-assignment': 'off',
                    'ts/no-unsafe-call': 'off',
                    'ts/no-unsafe-member-access': 'off',
                    'ts/no-unsafe-return': 'off',
                    'ts/restrict-plus-operands': 'off',
                    'ts/restrict-template-expressions': 'off',
                    'ts/unbound-method': 'off',
                },

                ...overrides,
            },
        },
    ]
}
