import type { Linter } from 'eslint'
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import type { ParserOptions } from '@typescript-eslint/parser'
import type {
    EslintCommentsRules,
    EslintRules,
    FlatESLintConfigItem,
    ImportRules,
    JsoncRules,
    MergeIntersection,
    NRules,
    Prefix,
    RenamePrefix,
    RuleConfig,
    VitestRules,
    VueRules,
    YmlRules,
} from '@antfu/eslint-define-config'
import type { RuleOptions as JSDocRules } from '@eslint-types/jsdoc/types'
import type { RuleOptions as TypeScriptRules } from '@eslint-types/typescript-eslint/types'
import type { RuleOptions as UnicornRules } from '@eslint-types/unicorn/types'
import type { Rules as AntfuRules } from 'eslint-plugin-antfu'
import type { UnprefixedRuleOptions as StylisticRules } from '@stylistic/eslint-plugin'

export type WrapRuleConfig<T extends { [key: string]: any }> = {
    [K in keyof T]: T[K] extends RuleConfig ? T[K] : RuleConfig<T[K]>
}

export type Awaitable<T> = T | Promise<T>

export type Rules = WrapRuleConfig<
  MergeIntersection<
      RenamePrefix<TypeScriptRules, '@typescript-eslint/', 'ts/'> &
      RenamePrefix<VitestRules, 'vitest/', 'test/'> &
      RenamePrefix<YmlRules, 'yml/', 'yaml/'> &
      RenamePrefix<NRules, 'n/', 'node/'> &
      Prefix<StylisticRules, 'style/'> &
      Prefix<AntfuRules, 'antfu/'> &
      JSDocRules &
      ImportRules &
      EslintRules &
      JsoncRules &
      VueRules &
      UnicornRules &
      EslintCommentsRules &
      {
          'test/no-only-tests': RuleConfig<[]>
      }
  >
>

export type FlatConfigItem = Omit<FlatESLintConfigItem<Rules, false>, 'plugins'> & {
    /**
     * Custom name of each config item
     */
    name?: string

    // Relax plugins type limitation, as most of the plugins did not have correct type info yet.
    /**
     * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
     *
     * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
     */
    plugins?: Record<string, any>
}

export type UserConfigItem = FlatConfigItem | Linter.FlatConfig

export interface OptionsComponentExts {
    /**
     * Additional extensions for components.
     *
     * @example ['vue']
     * @default []
     */
    componentExts?: string[]
}

export interface OptionsTypeScriptParserOptions {
    /**
     * Additional parser options for TypeScript.
     */
    parserOptions?: Partial<ParserOptions>
}

export interface OptionsTypeScriptWithTypes {
    /**
     * When this options is provided, type aware rules will be enabled.
     * @see https://typescript-eslint.io/linting/typed-linting/
     */
    tsconfigPath?: string | string[]
}

export interface OptionsHasTypeScript {
    typescript?: boolean
}

export interface OptionsStylistic {
    stylistic?: boolean | StylisticConfig
}

export interface StylisticConfig {
    indent?: number | 'tab'
    quotes?: 'single' | 'double'
    jsx?: boolean
}

export interface StylisticOverridesConfig extends OptionsStylistic {
    overrides?: FlatConfigItem['rules']
}

export interface OptionsOverrides {
    overrides?: FlatConfigItem['rules']
}

export interface OptionsIgnores {
    ignores?: string[]
}

export interface OptionsIsInEditor {
    isInEditor?: boolean
}

export interface OptionsReact {
    jsx?: boolean
    version?: string
    overrides?: FlatConfigItem['rules']
}

export interface OptionsConfig extends OptionsComponentExts {
    /**
     * Enable gitignore support.
     *
     * Passing an object to configure the options.
     *
     * @see https://github.com/antfu/eslint-config-flat-gitignore
     * @default true
     */
    gitignore?: boolean | FlatGitignoreOptions

    /**
     * Enable TypeScript support.
     *
     * Passing an object to enable TypeScript Language Server support.
     *
     * @default auto-detect based on the dependencies
     */
    typescript?: boolean | OptionsTypeScriptWithTypes | OptionsTypeScriptParserOptions

    /**
     * Enable JSX related rules.
     *
     * Currently only stylistic rules are included.
     *
     * @default true
     */
    jsx?: boolean

    /**
     * Enable test support.
     *
     * @default true
     */
    test?: boolean

    /**
     * Enable Vue support.
     *
     * @default auto-detect based on the dependencies
     */
    vue?: boolean

    /**
     * Enable React support.
     *
     * @default auto-detect based on the dependencies
     */
    react?: boolean

    /**
     * Enable JSONC support.
     *
     * @default true
     */
    jsonc?: boolean

    /**
     * Enable YAML support.
     *
     * @default true
     */
    yaml?: boolean

    /**
     * Enable Markdown support.
     *
     * @default true
     */
    markdown?: boolean

    /**
     * Enable stylistic rules.
     *
     * @default true
     */
    stylistic?: boolean | StylisticConfig

    /**
     * Control to disable some rules in editors.
     * @default auto-detect based on the process.env
     */
    isInEditor?: boolean

    /**
     * Provide overrides for rules for each integration.
     */
    overrides?: {
        javascript?: FlatConfigItem['rules']
        typescript?: FlatConfigItem['rules']
        stylistic?: FlatConfigItem['rules']
        test?: FlatConfigItem['rules']
        vue?: FlatConfigItem['rules']
        react?: FlatConfigItem['rules']
        jsonc?: FlatConfigItem['rules']
        markdown?: FlatConfigItem['rules']
        yaml?: FlatConfigItem['rules']
        ignores?: string[]
    }
}
