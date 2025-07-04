import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import type { ParserOptions } from '@typescript-eslint/parser'
import type { Linter } from 'eslint'
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks'

import type { VendoredPrettierOptions } from './prettier.types'
import type { ConfigNames, RuleOptions } from './typegen'

export type Awaitable<T> = T | Promise<T>

export interface Rules extends RuleOptions {}

export type { ConfigNames }

export type TypedFlatConfigItem = Omit<Linter.Config<Linter.RulesRecord & Rules>, 'plugins'> & {
    // 放宽插件类型限制，因为大多数插件还没有正确的类型信息。
    /**
     * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
     *
     * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
     */
    plugins?: Record<string, any>
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

export type OptionsTypescript = (OptionsTypeScriptWithTypes & OptionsOverrides) | (OptionsTypeScriptParserOptions & OptionsOverrides)

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
     * Type of the project. `lib` will enable more strict rules for libraries.
     *
     * @default 'app'
     */
    type?: 'app' | 'lib'
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
     * Passing an object to configure the options.
     *
     * @see https://github.com/antfu/eslint-config-flat-gitignore
     * @default true
     */
    gitignore?: boolean | FlatGitignoreOptions

    /**
     * Core rules. Can't be disabled.
     */
    javascript?: boolean

    /**
     * 启用 TypeScript 支持.
     *
     * 传递对象以启用 TypeScript 语言服务器支持.
     *
     * @default 根据依赖关系自动检测
     */
    typescript?: boolean | OptionsTypeScriptWithTypes | OptionsTypeScriptParserOptions | OptionsFiles

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
     * 为每个集成提供规则覆盖
     */
    overrides?: {
        javascript?: TypedFlatConfigItem['rules']
        typescript?: TypedFlatConfigItem['rules']
        stylistic?: TypedFlatConfigItem['rules']
        test?: TypedFlatConfigItem['rules']
        vue?: TypedFlatConfigItem['rules']
        regexp?: TypedFlatConfigItem['rules']
        react?: TypedFlatConfigItem['rules']
        svelte?: TypedFlatConfigItem['rules']
        jsonc?: TypedFlatConfigItem['rules']
        markdown?: TypedFlatConfigItem['rules']
        yaml?: TypedFlatConfigItem['rules']
        toml?: TypedFlatConfigItem['rules']
        unocss?: TypedFlatConfigItem['rules']
        perfectionist?: TypedFlatConfigItem['rules']
        unicorn?: TypedFlatConfigItem['rules']
        comments?: TypedFlatConfigItem['rules']
        node?: TypedFlatConfigItem['rules']
        imports?: TypedFlatConfigItem['rules']
        jsdoc?: TypedFlatConfigItem['rules']
        ignores?: string[]
    }
}
