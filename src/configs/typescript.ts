import type { OptionsComponentExts, OptionsFiles, OptionsOverrides, OptionsProjectType, OptionsTypeScriptParserOptions, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from '../types'

import process from 'node:process'

import { GLOB_MARKDOWN, GLOB_SRC, GLOB_TS, GLOB_TSX } from '../globs'
import { pluginAntfu } from '../plugins'
import { interopDefault, renameRules } from '../utils'

export async function typescript(
    options: OptionsFiles & OptionsComponentExts & OptionsOverrides & OptionsTypeScriptWithTypes & OptionsTypeScriptParserOptions & OptionsProjectType = {},
): Promise<TypedFlatConfigItem[]> {
    const {
        componentExts = [],
        overrides = {},
        parserOptions = {},
        type = 'app',
    } = options

    const files = options.files ?? [
        GLOB_SRC,
        ...componentExts.map(ext => `**/*.${ext}`),
    ]

    const ignoresTypeAware = options.ignoresTypeAware ?? [
        `${GLOB_MARKDOWN}/**`,
    ]

    const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX]
    const tsconfigPath = options?.tsconfigPath ? options.tsconfigPath : undefined

    const isTypeAware = !!tsconfigPath

    const typeAwareRules: TypedFlatConfigItem['rules'] = {
        'dot-notation': 'off',
        'no-implied-eval': 'off',
        'ts/await-thenable': 'error',
        'ts/dot-notation': ['error', { allowKeywords: true }],
        'ts/no-floating-promises': 'error',
        'ts/no-for-in-array': 'error',
        'ts/no-implied-eval': 'error',
        'ts/no-misused-promises': 'error',
        'ts/no-unnecessary-type-assertion': 'error',
        'ts/no-unsafe-argument': 'error',
        'ts/no-unsafe-assignment': 'error',
        'ts/no-unsafe-call': 'error',
        'ts/no-unsafe-member-access': 'error',
        'ts/no-unsafe-return': 'error',
        'ts/promise-function-async': 'error',
        'ts/restrict-plus-operands': 'error',
        'ts/restrict-template-expressions': 'error',
        'ts/return-await': ['error', 'in-try-catch'],
        'ts/strict-boolean-expressions': ['error', { allowNullableBoolean: true, allowNullableObject: true }],
        'ts/switch-exhaustiveness-check': 'error',
        'ts/unbound-method': 'error',
    }

    const [
        pluginTs,
        parserTs,
    ] = await Promise.all([
        interopDefault(import('@typescript-eslint/eslint-plugin')),
        interopDefault(import('@typescript-eslint/parser')),
    ] as const)

    function makeParser(typeAware: boolean, files: string[], ignores?: string[]): TypedFlatConfigItem {
        return {
            files,
            ...ignores ? { ignores } : {},
            languageOptions: {
                parser: parserTs,
                parserOptions: {
                    extraFileExtensions: componentExts.map(ext => `.${ext}`),
                    sourceType: 'module',
                    ...(typeAware ? {
                        projectService: {
                            allowDefaultProject: ['./*.js'],
                            defaultProject: tsconfigPath,
                        },
                        tsconfigRootDir: process.cwd(),
                    } : {}),
                    ...parserOptions as any,
                },
            },
            name: `eslint/typescript/${typeAware ? 'type-aware-parser' : 'parser'}`,
        }
    }

    return [
        {
            // Install the plugins without globs, so they can be configured separately.
            name: 'eslint/typescript/setup',
            plugins: {
                antfu: pluginAntfu,
                ts: pluginTs as any,
            },
        },
        // assign type-aware parser for type-aware files and type-unaware parser for the rest
        ...isTypeAware ? [
            makeParser(false, files),
            makeParser(true, filesTypeAware, ignoresTypeAware),
        ] : [
            makeParser(false, files),
        ],
        {
            files,
            name: 'eslint/typescript/rules',
            rules: {
                ...renameRules(
                    pluginTs.configs['eslint-recommended'].overrides![0].rules!,
                    { '@typescript-eslint': 'ts' },
                ),
                ...renameRules(
                    pluginTs.configs.strict.rules!,
                    { '@typescript-eslint': 'ts' },
                ),

                'no-dupe-class-members': 'off',
                'no-redeclare': 'off',

                'no-unused-expressions': 'off',
                'no-use-before-define': 'off',
                'no-useless-constructor': 'off',
                'ts/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
                'ts/consistent-type-definitions': ['error', 'interface'],
                'ts/consistent-type-imports': ['error', {
                    disallowTypeAnnotations: false,
                    fixStyle: 'separate-type-imports',
                    prefer: 'type-imports',
                }],
                'ts/method-signature-style': ['error', 'property'],
                'ts/no-dupe-class-members': 'error',
                'ts/no-dynamic-delete': 'off',
                'ts/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
                'ts/no-explicit-any': 'off',
                'ts/no-extraneous-class': 'off',
                'ts/no-import-type-side-effects': 'error',
                'ts/no-invalid-void-type': 'off',
                'ts/no-non-null-assertion': 'off',
                'ts/no-redeclare': ['error', { builtinGlobals: false }],
                'ts/no-require-imports': 'error',
                'ts/no-unused-expressions': ['error', {
                    // allowShortCircuit 设置为 true 将允许你在表达式中使用短路计算（默认值：false）
                    allowShortCircuit: true,
                    // allowTaggedTemplates 设置为 true 将使你能够在表达式中使用标记模板字面量（默认值：false）
                    allowTaggedTemplates: true,
                    // allowTernary 设置为 true 将使你能够在表达式中使用三元运算符，类似于短路计算（默认值：false）
                    allowTernary: true,
                }],
                'ts/no-unused-vars': [
                    'warn',
                    {
                        args: 'all',
                        argsIgnorePattern: '^_',
                        caughtErrors: 'all',
                        caughtErrorsIgnorePattern: '^_',
                        destructuredArrayIgnorePattern: '^_',
                        ignoreRestSiblings: true,
                        varsIgnorePattern: '^_',
                    },
                ],
                'ts/no-use-before-define': ['error', { classes: false, functions: false, variables: true }],
                'ts/no-useless-constructor': 'off',
                'ts/no-wrapper-object-types': 'error',
                'ts/triple-slash-reference': 'off',
                'ts/unified-signatures': 'off',
                'unused-imports/no-unused-vars': 'off',
                ...(type === 'lib' ? {
                    'ts/explicit-function-return-type': ['error', {
                        allowExpressions: true,
                        allowHigherOrderFunctions: true,
                        allowIIFEs: true,
                    }],
                } : {}),
                ...overrides,
            },
        },
        ...isTypeAware ? [{
            files: filesTypeAware,
            ignores: ignoresTypeAware,
            name: 'eslint/typescript/rules-type-aware',
            rules: {
                ...typeAwareRules,
                ...overrides,
            },
        }] : [],
    ]
}
