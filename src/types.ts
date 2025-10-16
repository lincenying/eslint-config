import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import type { ParserOptions } from '@typescript-eslint/parser'
import type { Linter } from 'eslint'
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks'

import type { VendoredPrettierOptions } from './prettier.types'
import type { ConfigNames, RuleOptions } from './typegen'

export type Awaitable<T> = T | Promise<T>

export type Rules = Record<string, Linter.RuleEntry<any> | undefined> & RuleOptions

export type { ConfigNames }

/**
 * ESLint 的 `Linter.Config` 的更新版本，
 * 为 `rules` 提供自动补全功能，并放宽了 `plugins` 和 `rules` 的类型限制，
 * 因为许多插件仍然缺乏适当的类型定义。
 */
export type TypedFlatConfigItem = Omit<Linter.Config, 'plugins' | 'rules'> & {
    /**
     * 一个包含插件名称到插件对象的键值对映射的对象。
     * 当指定 `files` 时，这些插件仅适用于匹配的文件。
     *
     * @see [在配置中使用插件](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
     */
    plugins?: Record<string, any>

    /**
     * 包含已配置规则的对象。当指定 `files` 或 `ignores` 时，这些规则配置仅适用于匹配的文件。
     */
    rules?: Rules
}

export interface OptionsFiles {
    /**
     * 自定义 glob 覆盖 “files” 选项
     */
    files?: string[]
}

export interface OptionsVue {
    /**
     * 为 Vue SFC 创建虚拟文件以启用 linting.
     *
     * @see https://github.com/antfu/eslint-processor-vue-blocks
     * @default true
     */
    sfcBlocks?: boolean | VueBlocksOptions
}

export type OptionsTypescript = (OptionsTypeScriptWithTypes & OptionsOverrides & OptionsTypeScriptErasableOnly)
    | (OptionsTypeScriptParserOptions & OptionsOverrides & OptionsTypeScriptErasableOnly)

export interface OptionsFormatters {
    /**
     * 启用对 CSS、Less、Sass 和 SCSS 的格式化支持.
     *
     * 目前仅支持Prettier.
     */
    css?: 'prettier' | boolean

    /**
     * 启用 HTML 格式支持.
     *
     * 目前仅支持Prettier.
     */
    html?: 'prettier' | boolean

    /**
     * 启用 XML 格式支持
     *
     * 目前仅支持 Prettier
     */
    xml?: 'prettier' | boolean

    /**
     * 启用 SVG 格式支持.
     *
     * 目前仅支持 Prettier
     */
    svg?: 'prettier' | boolean

    /**
     * 启用对 Markdown 的格式化支持.
     *
     * 同时支持 Prettier 和 dprint.
     *
     * 当设置为“true”时，将使用 Prettier.
     */
    markdown?: 'prettier' | 'dprint' | boolean

    /**
     * 启用 GraphQL 的格式化支持.
     */
    graphql?: 'prettier' | boolean

    /**
     * Prettier 的自定义选项.
     *
     * 默认情况下它是由我们自己的配置控制的.
     */
    prettierOptions?: VendoredPrettierOptions

    /**
     * dprint 的自定义选项.
     *
     * 默认情况下它是由我们自己的配置控制的.
     */
    dprintOptions?: boolean
}

export interface OptionsComponentExts {
    /**
     * 组件的附加扩展
     *
     * @example ['vue']
     * @default []
     */
    componentExts?: string[]
}

export interface OptionsUnicorn {
    /**
     * 是否包括“eslint-plugin-unicorn”推荐的所有规则.
     *
     * @default false
     */
    allRecommended?: boolean
}

export interface OptionsTypeScriptParserOptions {
    /**
     * TypeScript 的附加解析器选项。
     */
    parserOptions?: Partial<ParserOptions>

    /**
     * 应该识别类型的文件的全局模式.
     * @default ['**\/*.{ts,tsx}']
     */
    filesTypeAware?: string[]

    /**
     * 不应具有类型感知的文件的 Glob 模式。
     * @default ['**\/*.md\/**']
     */
    ignoresTypeAware?: string[]
}

export interface OptionsTypeScriptWithTypes {
    /**
     * 提供此选项后，将启用类型感知规则。
     * @see https://typescript-eslint.io/linting/typed-linting/
     */
    tsconfigPath?: string

    /**
     * 覆盖类型感知规则
     */
    overridesTypeAware?: TypedFlatConfigItem['rules']
}

export interface OptionsHasTypeScript {
    /**
     * 是否开启 typescript
     */
    typescript?: boolean
}

export interface OptionsStylistic {
    /**
     * 是否开启 stylistic
     */
    stylistic?: boolean | StylisticConfig
}

export interface StylisticConfig extends Pick<StylisticCustomizeOptions, 'indent' | 'quotes' | 'jsx' | 'semi'> {
    /**
     * Disable some opinionated rules to Anthony's preference.
     *
     * Including:
     * - `antfu/top-level-function`
     * - `antfu/if-newline`
     * - `antfu/curly`
     *
     * @default false
     */
    lessOpinionated?: boolean
}

export interface OptionsOverrides {
    overrides?: TypedFlatConfigItem['rules']
}

export interface OptionsProjectType {
    /**
     * 项目类型。“lib”将为库启用更严格的规则。
     *
     * @default 'app'
     */
    type?: 'app' | 'lib'
}

export interface OptionsTypeScriptErasableOnly {
    /**
     * 启用可擦除语法规则
     *
     * @see https://github.com/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only
     * @default false
     */
    erasableOnly?: boolean
}

export interface OptionsRegExp {
    /**
     * Override rulelevels
     */
    level?: 'error' | 'warn'
}

export interface OptionsIgnores {
    ignores?: string[]
}

export interface OptionsIsInEditor {
    isInEditor?: boolean
}

export interface OptionsUnoCSS {
    /**
     * 启用 attributify 支持.
     * @default true
     */
    attributify?: boolean
    /**
     * 启用严格模式，抛出有关阻止列表类的错误.
     * @default false
     */
    strict?: boolean
}

export interface OptionsConfig extends OptionsComponentExts, OptionsProjectType {
    /**
     * 启用 gitignore 支持.
     *
     * 传递一个对象来配置选项
     *
     * @see https://github.com/antfu/eslint-config-flat-gitignore
     * @default true
     */
    gitignore?: boolean | FlatGitignoreOptions

    /**
     * 核心规则。不能禁用。
     */
    javascript?: boolean

    /**
     * 启用 TypeScript 支持.
     *
     * 传递对象以启用 TypeScript 语言服务器支持.
     *
     * @default 根据依赖关系自动检测
     */
    typescript?: boolean | OptionsTypescript

    /**
     * 启用 JSX 相关规则.
     *
     * 目前仅包含风格规则.
     *
     * @default true
     */
    jsx?: boolean

    /**
     * eslint-plugin-unicorn 的选项.
     *
     * @default true
     */
    unicorn?: boolean | OptionsUnicorn

    /**
     * eslint-plugin-import-lite 的选项.
     * @default true
     */
    imports?: boolean

    /**
     * 启用 test 支持.
     *
     * @default true
     */
    test?: boolean | OptionsFiles

    /**
     * 启用 Vue 支持.
     *
     * @default 根据依赖关系自动检测
     */
    vue?: boolean | OptionsFiles | OptionsVue

    /**
     * 启用 JSONC 支持.
     *
     * @default true
     */
    jsonc?: boolean | OptionsFiles

    /**
     * 启用 YAML 支持.
     *
     * @default true
     */
    yaml?: boolean | OptionsFiles

    /**
     * 启用 TOML 支持.
     *
     * @default false
     */
    toml?: boolean

    /**
     * 启用 Markdown 支持.
     *
     * @default true
     */
    markdown?: boolean | OptionsFiles

    /**
     * 启用 stylistic 规则.
     *
     * @default true
     */
    stylistic?: boolean | StylisticConfig

    /**
     * 启用 regexp 规则.
     *
     * @see https://ota-meshi.github.io/eslint-plugin-regexp/
     * @default true
     */
    regexp?: boolean | (OptionsRegExp & OptionsOverrides)

    /**
     * 启用 React 支持.
     *
     * 需要安装:
     * - `@eslint-react/eslint-plugin`
     * - `eslint-plugin-react-hooks`
     * - `eslint-plugin-react-refresh`
     *
     * @default 根据依赖关系自动检测
     */
    react?: boolean | OptionsFiles

    /**
     * 启用 nextjs 支持.
     *
     * 需要安装:
     * - `@next/eslint-plugin-next`
     *
     * @default false
     */
    nextjs?: boolean | OptionsOverrides

    /**
     * 启用 unocss rules.
     *
     * 需要安装:
     * - `@unocss/eslint-plugin`
     *
     * @default false
     */
    unocss?: boolean | OptionsUnoCSS

    /**
     * 启用 pnpm（工作区/目录）支持.
     *
     * 目前它默认是禁用的，因为它仍处于实验阶段
     * 将来会根据项目使用情况智能启用
     *
     * @see https://github.com/antfu/pnpm-workspace-utils
     * @experimental
     * @default false
     */
    pnpm?: boolean

    /**
     * 使用外部格式化程序格式化文件.
     *
     * 需要安装:
     * - `eslint-plugin-format`
     *
     * @default false
     *
     * 当设置为“true”时，默认值为
     * {
     *  css: false,
     *  graphql: true,
     *  html: true,
     *  markdown: true,
     * }
     */
    formatters?: boolean | OptionsFormatters

    /**
     * 控制再编辑器中禁用某些规则.
     * @default 基于 process.env 自动检测
     */
    isInEditor?: boolean

    /**
     * 在配置中自动重命名插件.
     *
     * @default true
     */
    autoRenamePlugins?: boolean

    /**
     * 没啥用的配置
     */
    comments?: boolean | OptionsOverrides
    node?: boolean | OptionsOverrides
    jsdoc?: boolean | OptionsOverrides
    perfectionist?: boolean | OptionsOverrides
    ignores?: boolean | OptionsOverrides

    /**
     * 为每个集成提供规则覆盖
     */
    overrides?: {
        comments?: TypedFlatConfigItem['rules']
        ignores?: string[]
        imports?: TypedFlatConfigItem['rules']
        javascript?: TypedFlatConfigItem['rules']
        jsdoc?: TypedFlatConfigItem['rules']
        jsonc?: TypedFlatConfigItem['rules']
        markdown?: TypedFlatConfigItem['rules']
        nuxtjs?: TypedFlatConfigItem['rules']
        node?: TypedFlatConfigItem['rules']
        perfectionist?: TypedFlatConfigItem['rules']
        react?: TypedFlatConfigItem['rules']
        regexp?: TypedFlatConfigItem['rules']
        stylistic?: TypedFlatConfigItem['rules']
        test?: TypedFlatConfigItem['rules']
        toml?: TypedFlatConfigItem['rules']
        typescript?: TypedFlatConfigItem['rules']
        unicorn?: TypedFlatConfigItem['rules']
        unocss?: TypedFlatConfigItem['rules']
        vue?: TypedFlatConfigItem['rules']
        yaml?: TypedFlatConfigItem['rules']
    }
}
