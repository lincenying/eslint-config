import type { Linter } from 'eslint'
import type { RuleOptions } from './typegen'
import type { Awaitable, ConfigNames, OptionsConfig, TypedFlatConfigItem } from './types'

import { FlatConfigComposer } from 'eslint-flat-config-utils'
import { isPackageExists } from 'local-pkg'
import {
    comments,
    disables,
    ignores,
    imports,
    javascript,
    jsdoc,
    jsonc,
    jsx,
    markdown,
    node,
    perfectionist,
    pnpm,
    react,
    sortPackageJson,
    sortTsconfig,
    stylistic,
    test,
    toml,
    typescript,
    unicorn,
    unocss,
    vue,
    yaml,
} from './configs'
import { formatters } from './configs/formatters'

import { regexp } from './configs/regexp'
import { interopDefault, isInEditorEnv } from './utils'

const flatConfigProps = [
    'name',
    'languageOptions',
    'linterOptions',
    'processor',
    'plugins',
    'rules',
    'settings',
] satisfies (keyof TypedFlatConfigItem)[]

const VuePackages = [
    'vue',
    'nuxt',
    'vitepress',
    '@slidev/cli',
]

export const defaultPluginRenaming = {
    '@eslint-react': 'react',
    '@eslint-react/dom': 'react-dom',
    '@eslint-react/hooks-extra': 'react-hooks-extra',
    '@eslint-react/naming-convention': 'react-naming-convention',

    '@stylistic': 'style',
    '@typescript-eslint': 'ts',
    'import-lite': 'import',
    'n': 'node',
    'vitest': 'test',
    'yml': 'yaml',
}

/**
 * 构建 ESLint 平面配置项数组
 *
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  生成 ESLint 配置的选项
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
 *  要与生成的配置合并的用户配置
 * @returns {Promise<TypedFlatConfigItem[]>}
 *  合并的 ESLint 配置
 */
export function lincy(
    options: OptionsConfig & Omit<TypedFlatConfigItem, 'files'> = {},
    ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
    const {
        autoRenamePlugins = true,
        componentExts = [],
        gitignore: enableGitignore = true,
        ignores: ignoresList = [],
        imports: enableImports = true,
        jsx: enableJsx = true,
        overrides = {},
        pnpm: enableCatalogs = false,
        react: enableReact = false,
        regexp: enableRegexp = true,
        typescript: enableTypeScript = isPackageExists('typescript'),
        unicorn: enableUnicorn = true,
        unocss: enableUnoCSS = false,
        vue: enableVue = VuePackages.some(i => isPackageExists(i)),
    } = options

    let isInEditor = options.isInEditor
    if (isInEditor == null) {
        isInEditor = isInEditorEnv()
        if (isInEditor)

            console.log('[@lincy/eslint-config] Detected running in editor, some rules are disabled.')
    }

    const stylisticOptions = options.stylistic === false ? false : typeof options.stylistic === 'object' ? options.stylistic : {}

    if (stylisticOptions && !('jsx' in stylisticOptions))
        stylisticOptions.jsx = enableJsx

    const configs: Awaitable<TypedFlatConfigItem[]>[] = []

    if (enableGitignore) {
        if (typeof enableGitignore !== 'boolean') {
            configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r({
                name: 'eslint/gitignore',
                ...enableGitignore,
            })]))
        }
        else {
            configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r({
                name: 'eslint/gitignore',
                strict: false,
            })]))
        }
    }

    const typescriptOptions = resolveSubOptions(options, 'typescript')
    const tsconfigPath = 'tsconfigPath' in typescriptOptions ? typescriptOptions.tsconfigPath : undefined

    // Base configs
    configs.push(
        ignores({
            ignores: [
                ...(overrides.ignores || []),
                ...ignoresList,
            ],
        }),
        javascript({
            isInEditor,
            overrides: getOverrides(options, 'javascript'),
        }),
        comments({
            overrides: overrides.comments,
        }),
        node({
            overrides: overrides.node,
        }),
        jsdoc({
            overrides: overrides.jsdoc,
            stylistic: stylisticOptions,
        }),
        imports({
            overrides: overrides.imports,
            stylistic: stylisticOptions,
        }),
        // Optional plugins (installed but not enabled by default)
        perfectionist({
            overrides: overrides.perfectionist,
        }),
    )

    if (enableUnicorn) {
        configs.push(unicorn({
            ...(enableUnicorn === true ? {} : enableUnicorn),
            overrides: overrides.unicorn,
        }))
    }

    if (enableImports) {
        configs.push(
            imports({
                overrides: overrides.imports,
                stylistic: stylisticOptions,
            }),
        )
    }

    if (enableVue) {
        componentExts.push('vue')
    }

    if (enableJsx) {
        configs.push(jsx())
    }

    if (enableTypeScript) {
        configs.push(typescript({
            ...typescriptOptions,
            componentExts,
            overrides: getOverrides(options, 'typescript'),
            tsconfigPath,
            type: options.type,
        }))
    }

    if (stylisticOptions) {
        configs.push(stylistic({
            overrides: getOverrides(options, 'stylistic'),
            stylistic: stylisticOptions,
        }))
    }

    if (enableRegexp) {
        configs.push(regexp({
            ...resolveSubOptions(options, 'regexp'),
            ...getOverrides(options, 'regexp'),
        }))
    }

    if (options.test ?? true) {
        configs.push(test({
            ...resolveSubOptions(options, 'test'),
            isInEditor,
            overrides: getOverrides(options, 'test'),
        }))
    }

    if (enableVue) {
        configs.push(vue({
            ...resolveSubOptions(options, 'vue'),
            overrides: getOverrides(options, 'vue'),
            stylistic: stylisticOptions,
            typescript: !!enableTypeScript,
        }))
    }

    if (enableReact) {
        configs.push(react({
            ...typescriptOptions,
            ...resolveSubOptions(options, 'react'),
            overrides: getOverrides(options, 'react'),
            tsconfigPath,
        }))
    }

    if (enableUnoCSS) {
        configs.push(unocss({
            ...resolveSubOptions(options, 'unocss'),
            overrides: getOverrides(options, 'unocss'),
        }))
    }

    if (options.jsonc ?? true) {
        configs.push(
            jsonc({
                ...resolveSubOptions(options, 'jsonc'),
                overrides: getOverrides(options, 'jsonc'),
                stylistic: stylisticOptions,
            }),
            sortPackageJson(),
            sortTsconfig(),
        )
    }

    if (enableCatalogs) {
        configs.push(
            pnpm(),
        )
    }

    if (options.yaml ?? true) {
        configs.push(yaml({
            ...resolveSubOptions(options, 'yaml'),
            overrides: getOverrides(options, 'yaml'),
            stylistic: stylisticOptions,
        }))
    }

    if (options.toml ?? true) {
        configs.push(toml({
            overrides: getOverrides(options, 'toml'),
            stylistic: stylisticOptions,
        }))
    }

    if (options.markdown ?? true) {
        configs.push(
            markdown(
                {
                    ...resolveSubOptions(options, 'markdown'),
                    componentExts,
                    overrides: getOverrides(options, 'markdown'),
                },
            ),
        )
    }

    if (options.formatters) {
        configs.push(formatters(
            options.formatters,
            typeof stylisticOptions === 'boolean' ? {} : stylisticOptions,
        ))
    }

    configs.push(
        disables(),
    )

    if ('files' in options) {
        throw new Error('[@lincy/eslint-config] 第一个参数不应包含“files”属性，因为选项应该是全局的。请将其放在第二个或更后面的配置中。')
    }

    // User can optionally pass a flat config item to the first argument
    // We pick the known keys as ESLint would do schema validation
    const fusedConfig = flatConfigProps.reduce((acc, key) => {
        if (key in options)
            acc[key] = options[key] as any
        return acc
    }, {} as TypedFlatConfigItem)
    if (Object.keys(fusedConfig).length)
        configs.push([fusedConfig])

    let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()

    composer = composer
        .append(
            ...configs,
            ...userConfigs as any,
        )

    if (autoRenamePlugins) {
        composer = composer
            .renamePlugins(defaultPluginRenaming)
    }

    if (isInEditor) {
        composer = composer
            .disableRulesFix([
                'unused-imports/no-unused-imports',
                'test/no-only-tests',
                'prefer-const',
            ], {
                builtinRules: () => import(['eslint', 'use-at-your-own-risk'].join('/')).then(r => r.builtinRules),
            })
    }

    return composer
}

export type ResolvedOptions<T> = T extends boolean
    ? never
    : NonNullable<T>

export function resolveSubOptions<K extends keyof OptionsConfig>(
    options: OptionsConfig,
    key: K,
): ResolvedOptions<OptionsConfig[K]> {
    return typeof options[key] === 'boolean' ? {} as any : options[key] || {} as any
}

export function getOverrides<K extends keyof OptionsConfig>(
    options: OptionsConfig,
    key: K,
): Partial<Linter.RulesRecord & RuleOptions> {
    const sub = resolveSubOptions(options, key)
    return {
        ...(options.overrides as any)?.[key],
        ...'overrides' in sub ? sub.overrides : {},
    }
}
