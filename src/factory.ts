import process from 'node:process'
import fs from 'node:fs'
import { isPackageExists } from 'local-pkg'
import { FlatConfigComposer } from 'eslint-flat-config-utils'
import {
    comments,
    ignores,
    imports,
    javascript,
    jsdoc,
    jsonc,
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
import type { Awaitable, OptionsConfig, TypedFlatConfigItem } from './types'
import { interopDefault } from './utils'
import { formatters } from './configs/formatters'

const flatConfigProps: (keyof TypedFlatConfigItem)[] = [
    'name',
    'files',
    'ignores',
    'languageOptions',
    'linterOptions',
    'processor',
    'plugins',
    'rules',
    'settings',
]

const VuePackages = [
    'vue',
    'nuxt',
    'vitepress',
    '@slidev/cli',
]

export const defaultPluginRenaming = {
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
    options: OptionsConfig & TypedFlatConfigItem = {},
    ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]
): FlatConfigComposer<TypedFlatConfigItem> {
    const {
        autoRenamePlugins = true,
        componentExts = [],
        gitignore: enableGitignore = true,
        isInEditor = !!((process.env.VSCODE_PID || process.env.JETBRAINS_IDE || process.env.VIM) && !process.env.CI),
        overrides = {},
        react: enableReact = ReactPackages.some(i => isPackageExists(i)),
        typescript: enableTypeScript = isPackageExists('typescript'),
        unocss: enableUnoCSS = false,
        vue: enableVue = VuePackages.some(i => isPackageExists(i)),
    } = options

    const stylisticOptions = options.stylistic === false ? false : (typeof options.stylistic === 'object' ? options.stylistic : {})

    if (stylisticOptions) {
        if (!('jsx' in stylisticOptions)) {
            stylisticOptions.jsx = options.jsx ?? true
        }
    }

    const configs: Awaitable<TypedFlatConfigItem[]>[] = []

    if (enableGitignore) {
        if (typeof enableGitignore !== 'boolean') {
            configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r(enableGitignore)]))
        }
        else {
            if (fs.existsSync('.gitignore')) {
                configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r()]))
            }
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
        comments(),
        node(),
        jsdoc({
            stylistic: stylisticOptions,
        }),
        imports({
            stylistic: stylisticOptions,
        }),
        unicorn(),

        // Optional plugins (installed but not enabled by default)
        perfectionist(),
    )

    // In the future we may support more component extensions like Svelte or so
    if (enableVue) {
        componentExts.push('vue')
    }

    if (enableTypeScript) {
        configs.push(typescript({
            ...(typeof enableTypeScript !== 'boolean' ? enableTypeScript : {}),
            componentExts,
            overrides: overrides.typescript,
        }))
    }

    if (stylisticOptions) {
        configs.push(stylistic({
            overrides: overrides.stylistic,
            stylistic: stylisticOptions,
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
            ...(typeof enableReact !== 'boolean' ? enableReact : {}),
            overrides: overrides.react,
            typescript: !!enableTypeScript,
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
