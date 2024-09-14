import type { Awaitable, OptionsConfig, TypedFlatConfigItem } from './types'

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
    'import-x': 'import',
    'n': 'node',
    'vitest': 'test',
    'yml': 'yaml',
}

const ReactPackages = [
    'react',
    'next',
]

/**
 * 构造一个ESLint扁平化配置项数组。
 */
export function lincy(
    options: OptionsConfig & Omit<TypedFlatConfigItem, 'files'> = {},
    ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]
): FlatConfigComposer<TypedFlatConfigItem> {
    const {
        autoRenamePlugins = true,
        componentExts = [],
        gitignore: enableGitignore = true,
        jsx: enableJsx = true,
        overrides = {},
        react: enableReact = ReactPackages.some(i => isPackageExists(i)),
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

    const stylisticOptions = options.stylistic === false ? false : (typeof options.stylistic === 'object' ? options.stylistic : {})

    const tsconfigPath = typeof enableTypeScript !== 'boolean' && 'tsconfigPath' in enableTypeScript ? enableTypeScript.tsconfigPath : undefined

    if (stylisticOptions) {
        if (!('jsx' in stylisticOptions)) {
            stylisticOptions.jsx = enableJsx
        }
    }

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

    // Base configs
    configs.push(
        ignores({
            ignores: overrides.ignores,
        }),
        javascript({
            isInEditor,
            overrides: overrides.javascript,
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

    // In the future we may support more component extensions like Svelte or so
    if (enableVue) {
        componentExts.push('vue')
    }

    if (enableTypeScript) {
        configs.push(typescript({
            ...(typeof enableTypeScript !== 'boolean' ? enableTypeScript : {}),
            componentExts,
            overrides: overrides.typescript,
            tsconfigPath,
            type: options.type,
        }))
    }

    if (enableJsx) {
        configs.push(jsx())
    }

    if (stylisticOptions) {
        configs.push(stylistic({
            overrides: overrides.stylistic,
            stylistic: stylisticOptions,
        }))
    }

    if (enableRegexp) {
        configs.push(regexp({
            ...(typeof enableRegexp === 'boolean' ? {} : enableRegexp),
            overrides: overrides.regexp,
        }))
    }

    if (options.test ?? true) {
        configs.push(test({
            ...(typeof options.test !== 'boolean' ? options.test : {}),
            isInEditor,
            overrides: overrides.test,
        }))
    }

    if (enableVue) {
        configs.push(vue({
            ...(typeof options.vue !== 'boolean' ? options.vue : {}),
            overrides: overrides.vue,
            stylistic: stylisticOptions,
            typescript: !!enableTypeScript,
        }))
    }

    if (enableReact) {
        configs.push(react({
            tsconfigPath,
            ...(typeof enableReact !== 'boolean' ? enableReact : {}),
            overrides: overrides.react,
        }))
    }

    if (enableUnoCSS) {
        configs.push(unocss({
            ...(typeof enableUnoCSS === 'boolean' ? {} : enableUnoCSS),
            overrides: overrides.unocss,
        }))
    }

    if (options.jsonc ?? true) {
        configs.push(
            jsonc({
                ...(typeof options.jsonc !== 'boolean' ? options.jsonc : {}),
                overrides: overrides.jsonc,
                stylistic: stylisticOptions,
            }),
            sortPackageJson(),
            sortTsconfig(),
        )
    }

    if (options.yaml ?? true) {
        configs.push(yaml({
            ...(typeof options.yaml !== 'boolean' ? options.yaml : {}),
            overrides: overrides.yaml,
            stylistic: stylisticOptions,
        }))
    }

    if (options.toml) {
        configs.push(toml({
            overrides: overrides.toml,
            stylistic: stylisticOptions,
        }))
    }

    if (options.markdown ?? true) {
        configs.push(markdown({
            ...(typeof options.markdown !== 'boolean' ? options.markdown : {}),
            componentExts,
            overrides: overrides.markdown,
        }))
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
        if (key in options) {
            acc[key] = options[key] as any
        }
        return acc
    }, {} as TypedFlatConfigItem)

    if (Object.keys(fusedConfig).length) {
        configs.push([fusedConfig])
    }

    let composer = new FlatConfigComposer<TypedFlatConfigItem>()

    composer = composer.append(
        ...configs,
        ...userConfigs,
    )

    if (autoRenamePlugins) {
        composer = composer.renamePlugins(defaultPluginRenaming)
    }

    return composer
}
