import * as parserPlain from 'eslint-parser-plain'
import { GLOB_CSS, GLOB_GRAPHQL, GLOB_HTML, GLOB_LESS, GLOB_MARKDOWN, GLOB_POSTCSS, GLOB_SCSS, GLOB_SVG } from '../globs'
import { ensurePackages, interopDefault, isPackageInScope } from '../utils'
import type { OptionsFormatters, StylisticConfig, TypedFlatConfigItem } from '../types'
import { StylisticConfigDefaults } from './stylistic'
import type { VendoredPrettierOptions } from '@/prettier.types'

export async function formatters(
    options: OptionsFormatters | true = {},
    stylistic: StylisticConfig = {},
): Promise<TypedFlatConfigItem[]> {
    const defaultIndent = 4

    if (options === true) {
        const isPrettierPluginXmlInScope = isPackageInScope('@prettier/plugin-xml')

        options = {
            css: false,
            graphql: true,
            html: true,
            markdown: true,
            svg: isPrettierPluginXmlInScope,
            xml: isPrettierPluginXmlInScope,
        }
    }

    await ensurePackages([
        'eslint-plugin-format',
        (options.xml || options.svg) ? '@prettier/plugin-xml' : undefined,
    ])

    const {
        indent,
        quotes,
        semi,
    } = {
        ...StylisticConfigDefaults,
        ...stylistic,
    }

    const prettierOptions: VendoredPrettierOptions = Object.assign(
        {
            endOfLine: 'lf',
            printWidth: 200,
            semi,
            singleQuote: quotes === 'single',
            tabWidth: typeof indent === 'number' ? indent : defaultIndent,
            trailingComma: 'all',
            useTabs: indent === 'tab',
        } satisfies VendoredPrettierOptions,
        options.prettierOptions || {},
    )

    const prettierXmlOptions = {
        xmlQuoteAttributes: 'double',
        xmlSelfClosingSpace: true,
        xmlSortAttributesByKey: false,
        xmlWhitespaceSensitivity: 'ignore',
    }

    const dprintOptions = Object.assign(
        {
            indentWidth: typeof indent === 'number' ? indent : defaultIndent,
            quoteStyle: quotes === 'single' ? 'preferSingle' : 'preferDouble',
            useTabs: indent === 'tab',
        },
        options.dprintOptions || {},
    )

    const pluginFormat = await interopDefault(import('eslint-plugin-format'))

    const configs: TypedFlatConfigItem[] = [
        {
            name: 'eslint/formatters/setup',
            plugins: {
                format: pluginFormat,
            },
        },
    ]

    if (options.css) {
        configs.push(
            {
                files: [GLOB_CSS, GLOB_POSTCSS],
                languageOptions: {
                    parser: parserPlain,
                },
                name: 'eslint/formatters/css',
                rules: {
                    'format/prettier': [
                        'error',
                        {
                            ...prettierOptions,
                            parser: 'css',
                        },
                    ],
                },
            },
            {
                files: [GLOB_SCSS],
                languageOptions: {
                    parser: parserPlain,
                },
                name: 'eslint/formatters/scss',
                rules: {
                    'format/prettier': [
                        'error',
                        {
                            ...prettierOptions,
                            parser: 'scss',
                        },
                    ],
                },
            },
            {
                files: [GLOB_LESS],
                languageOptions: {
                    parser: parserPlain,
                },
                name: 'eslint/formatters/less',
                rules: {
                    'format/prettier': [
                        'error',
                        {
                            ...prettierOptions,
                            parser: 'less',
                        },
                    ],
                },
            },
        )
    }

    if (options.html) {
        configs.push({
            files: [GLOB_HTML],
            languageOptions: {
                parser: parserPlain,
            },
            name: 'eslint/formatters/html',
            rules: {
                'format/prettier': [
                    'error',
                    {
                        ...prettierOptions,
                        parser: 'html',
                    },
                ],
            },
        })
    }

    if (options.svg) {
        configs.push({
            files: [GLOB_SVG],
            languageOptions: {
                parser: parserPlain,
            },
            name: 'eslint/formatters/svg',
            rules: {
                'format/prettier': [
                    'error',
                    {
                        ...prettierXmlOptions,
                        ...prettierOptions,
                        parser: 'xml',
                        plugins: [
                            '@prettier/plugin-xml',
                        ],
                    },
                ],
            },
        })
    }

    if (options.markdown) {
        const formater = options.markdown === true ? 'prettier' : options.markdown

        configs.push({
            files: [GLOB_MARKDOWN],
            languageOptions: {
                parser: parserPlain,
            },
            name: 'eslint/formatters/markdown',
            rules: {
                [`format/${formater}`]: [
                    'error',
                    formater === 'prettier' ? {
                        ...prettierOptions,
                        embeddedLanguageFormatting: 'off',
                        parser: 'markdown',
                    } : {
                        ...dprintOptions,
                        language: 'markdown',
                    },
                ],
            },
        })
    }

    if (options.graphql) {
        configs.push({
            files: [GLOB_GRAPHQL],
            languageOptions: {
                parser: parserPlain,
            },
            name: 'eslint/formatters/graphql',
            rules: {
                'format/prettier': [
                    'error',
                    {
                        ...prettierOptions,
                        parser: 'graphql',
                    },
                ],
            },
        })
    }

    return configs
}
