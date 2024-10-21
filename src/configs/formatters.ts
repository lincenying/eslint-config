import type { VendoredPrettierOptions, VendoredPrettierRuleOptions } from '../prettier.types'
import type { OptionsFormatters, StylisticConfig, TypedFlatConfigItem } from '../types'

import { GLOB_CSS, GLOB_GRAPHQL, GLOB_HTML, GLOB_LESS, GLOB_MARKDOWN, GLOB_POSTCSS, GLOB_SCSS, GLOB_SVG, GLOB_XML } from '../globs'
import { ensurePackages, interopDefault, isPackageInScope, parserPlain } from '../utils'
import { StylisticConfigDefaults } from './stylistic'

function mergePrettierOptions(
    options: VendoredPrettierOptions,
    overrides: VendoredPrettierRuleOptions = {},
): VendoredPrettierRuleOptions {
    return {
        ...options,
        ...overrides,
        plugins: [
            ...(overrides.plugins || []),
            ...(options.plugins || []),
        ],
    }
}

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

    const prettierXmlOptions: VendoredPrettierOptions = {
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
                        mergePrettierOptions(prettierOptions, {
                            ...prettierOptions,
                            parser: 'css',
                        }),
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
                        mergePrettierOptions(prettierOptions, {
                            ...prettierOptions,
                            parser: 'scss',
                        }),
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
                        mergePrettierOptions(prettierOptions, {
                            ...prettierOptions,
                            parser: 'less',
                        }),
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
                    mergePrettierOptions(prettierOptions, {
                        ...prettierOptions,
                        parser: 'html',
                    }),
                ],
            },
        })
    }

    if (options.xml) {
        configs.push({
            files: [GLOB_XML],
            languageOptions: {
                parser: parserPlain,
            },
            name: 'eslint/formatter/xml',
            rules: {
                'format/prettier': [
                    'error',
                    mergePrettierOptions({ ...prettierXmlOptions, ...prettierOptions }, {
                        parser: 'xml',
                        plugins: [
                            '@prettier/plugin-xml',
                        ],
                    }),
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
                    mergePrettierOptions({ ...prettierXmlOptions, ...prettierOptions }, {
                        parser: 'xml',
                        plugins: [
                            '@prettier/plugin-xml',
                        ],
                    }),
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
                    formater === 'prettier' ? mergePrettierOptions(prettierOptions, {
                        embeddedLanguageFormatting: 'off',
                        parser: 'markdown',
                    }) : {
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
                    mergePrettierOptions(prettierOptions, {
                        parser: 'graphql',
                    }),
                ],
            },
        })
    }

    return configs
}
