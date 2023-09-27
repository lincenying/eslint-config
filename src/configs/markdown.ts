import type { FlatESLintConfigItem } from 'eslint-define-config'
import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE } from '../globs'
import { pluginMarkdown } from '../plugins'
import { OFF } from '../flags'
import type { OptionsComponentExts } from '../types'

export function markdown(options: OptionsComponentExts = {}): FlatESLintConfigItem[] {
    const { componentExts = [] } = options

    return [
        {
            plugins: {
                markdown: pluginMarkdown,
            },
        },
        {
            files: [GLOB_MARKDOWN],
            processor: 'markdown/markdown',
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
            rules: {
                'antfu/no-cjs-exports': OFF,
                'antfu/no-ts-export-equal': OFF,

                'eol-last': OFF,

                'no-alert': OFF,
                'no-console': OFF,
                'no-undef': OFF,
                'no-unused-expressions': OFF,
                'no-unused-vars': OFF,

                'node/prefer-global/process': OFF,

                'style/comma-dangle': OFF,

                'ts/consistent-type-imports': OFF,
                'ts/no-namespace': OFF,
                'ts/no-redeclare': OFF,
                'ts/no-require-imports': OFF,
                'ts/no-unused-vars': OFF,
                'ts/no-use-before-define': OFF,
                'ts/no-var-requires': OFF,

                'unicode-bom': 'off',
                'unused-imports/no-unused-imports': OFF,
                'unused-imports/no-unused-vars': OFF,
            },
        },
    ]
}
