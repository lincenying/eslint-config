import { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';
import { ParserOptions } from '@typescript-eslint/parser';
import * as parser from '@typescript-eslint/parser';
export { parser as parserTs };
import { RuleConfig, MergeIntersection, RenamePrefix, VitestRules, YmlRules, NRules, Prefix, ImportRules, EslintRules, JsoncRules, VueRules, EslintCommentsRules, FlatESLintConfigItem } from '@antfu/eslint-define-config';
import { RuleOptions as RuleOptions$1 } from '@eslint-types/jsdoc/types';
import { RuleOptions } from '@eslint-types/typescript-eslint/types';
import { RuleOptions as RuleOptions$2 } from '@eslint-types/unicorn/types';
import { Rules as Rules$1 } from 'eslint-plugin-antfu';
export { default as pluginAntfu } from 'eslint-plugin-antfu';
import { UnprefixedRuleOptions } from '@stylistic/eslint-plugin';
export { default as pluginStylistic } from '@stylistic/eslint-plugin';
export { default as pluginComments } from 'eslint-plugin-eslint-comments';
import * as eslintPluginI from 'eslint-plugin-i';
export { eslintPluginI as pluginImport };
export { default as pluginJsdoc } from 'eslint-plugin-jsdoc';
import * as eslintPluginJsonc from 'eslint-plugin-jsonc';
export { eslintPluginJsonc as pluginJsonc };
export { default as pluginMarkdown } from 'eslint-plugin-markdown';
export { default as pluginNode } from 'eslint-plugin-n';
export { default as pluginTs } from '@typescript-eslint/eslint-plugin';
export { default as pluginUnicorn } from 'eslint-plugin-unicorn';
export { default as pluginUnusedImports } from 'eslint-plugin-unused-imports';
export { default as pluginVue } from 'eslint-plugin-vue';
import * as eslintPluginYml from 'eslint-plugin-yml';
export { eslintPluginYml as pluginYaml };
export { default as pluginNoOnlyTests } from 'eslint-plugin-no-only-tests';
export { default as pluginSortKeys } from 'eslint-plugin-sort-keys';
export { default as pluginPerfectionist } from 'eslint-plugin-perfectionist';
export { default as parserVue } from 'vue-eslint-parser';
export { default as parserYaml } from 'yaml-eslint-parser';
export { default as parserJsonc } from 'jsonc-eslint-parser';

type WrapRuleConfig<T extends {
    [key: string]: any;
}> = {
    [K in keyof T]: T[K] extends RuleConfig ? T[K] : RuleConfig<T[K]>;
};
type Rules = WrapRuleConfig<MergeIntersection<RenamePrefix<RuleOptions, '@typescript-eslint/', 'ts/'> & RenamePrefix<VitestRules, 'vitest/', 'test/'> & RenamePrefix<YmlRules, 'yml/', 'yaml/'> & RenamePrefix<NRules, 'n/', 'node/'> & Prefix<UnprefixedRuleOptions, 'style/'> & Prefix<Rules$1, 'antfu/'> & RuleOptions$1 & ImportRules & EslintRules & JsoncRules & VueRules & RuleOptions$2 & EslintCommentsRules & {
    'test/no-only-tests': RuleConfig<[]>;
}>>;
type ConfigItem = Omit<FlatESLintConfigItem<Rules, false>, 'plugins'> & {
    /**
     * Custom name of each config item
     */
    name?: string;
    /**
     * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
     *
     * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
     */
    plugins?: Record<string, any>;
};
interface OptionsComponentExts {
    /**
     * Additional extensions for components.
     *
     * @example ['vue']
     * @default []
     */
    componentExts?: string[];
}
interface OptionsTypeScriptParserOptions {
    /**
     * Additional parser options for TypeScript.
     */
    parserOptions?: Partial<ParserOptions>;
}
interface OptionsTypeScriptWithTypes {
    /**
     * When this options is provided, type aware rules will be enabled.
     * @see https://typescript-eslint.io/linting/typed-linting/
     */
    tsconfigPath?: string | string[];
}
interface OptionsHasTypeScript {
    typescript?: boolean;
}
interface OptionsStylistic {
    stylistic?: boolean | StylisticConfig;
}
interface StylisticConfig {
    indent?: number | 'tab';
    quotes?: 'single' | 'double';
    jsx?: boolean;
}
interface StylisticOverridesConfig extends OptionsStylistic {
    overrides?: ConfigItem['rules'];
}
interface OptionsOverrides {
    overrides?: ConfigItem['rules'];
}
interface OptionsIgnores {
    ignores?: string[];
}
interface OptionsIsInEditor {
    isInEditor?: boolean;
}
interface OptionsConfig extends OptionsComponentExts {
    /**
     * Enable gitignore support.
     *
     * Passing an object to configure the options.
     *
     * @see https://github.com/antfu/eslint-config-flat-gitignore
     * @default true
     */
    gitignore?: boolean | FlatGitignoreOptions;
    /**
     * Enable TypeScript support.
     *
     * Passing an object to enable TypeScript Language Server support.
     *
     * @default auto-detect based on the dependencies
     */
    typescript?: boolean | OptionsTypeScriptWithTypes | OptionsTypeScriptParserOptions;
    /**
     * Enable JSX related rules.
     *
     * Currently only stylistic rules are included.
     *
     * @default true
     */
    jsx?: boolean;
    /**
     * Enable test support.
     *
     * @default true
     */
    test?: boolean;
    /**
     * Enable Vue support.
     *
     * @default auto-detect based on the dependencies
     */
    vue?: boolean;
    /**
     * Enable JSONC support.
     *
     * @default true
     */
    jsonc?: boolean;
    /**
     * Enable YAML support.
     *
     * @default true
     */
    yaml?: boolean;
    /**
     * Enable Markdown support.
     *
     * @default true
     */
    markdown?: boolean;
    /**
     * Enable stylistic rules.
     *
     * @default true
     */
    stylistic?: boolean | StylisticConfig;
    /**
     * Control to disable some rules in editors.
     * @default auto-detect based on the process.env
     */
    isInEditor?: boolean;
    /**
     * Provide overrides for rules for each integration.
     */
    overrides?: {
        javascript?: ConfigItem['rules'];
        typescript?: ConfigItem['rules'];
        stylistic?: ConfigItem['rules'];
        test?: ConfigItem['rules'];
        vue?: ConfigItem['rules'];
        jsonc?: ConfigItem['rules'];
        markdown?: ConfigItem['rules'];
        yaml?: ConfigItem['rules'];
        ignores?: string[];
    };
}

/**
 * Construct an array of ESLint flat config items.
 */
declare function lincy(options?: OptionsConfig & ConfigItem, ...userConfigs: (ConfigItem | ConfigItem[])[]): ConfigItem[];

declare function comments(): ConfigItem[];

declare function ignores(options?: OptionsIgnores): ConfigItem[];

declare function imports(options?: OptionsStylistic): ConfigItem[];

declare function javascript(options?: OptionsIsInEditor & OptionsOverrides): ConfigItem[];

declare function jsdoc(options?: OptionsStylistic): ConfigItem[];

declare function jsonc(options?: OptionsStylistic & OptionsOverrides): ConfigItem[];

declare function markdown(options?: OptionsComponentExts & OptionsOverrides): ConfigItem[];

declare function node(): ConfigItem[];

/**
 * Sort package.json
 *
 * Requires `jsonc` config
 */
declare function sortPackageJson(): ConfigItem[];
/**
 * Sort tsconfig.json
 *
 * Requires `jsonc` config
 */
declare function sortTsconfig(): ConfigItem[];

declare function stylistic(options?: StylisticOverridesConfig): ConfigItem[];

declare function typescript(options?: OptionsComponentExts & OptionsOverrides & OptionsTypeScriptWithTypes & OptionsTypeScriptParserOptions): ConfigItem[];

declare function unicorn(): ConfigItem[];

declare function vue(options?: OptionsHasTypeScript & OptionsOverrides & OptionsStylistic): ConfigItem[];

declare function yaml(options?: OptionsOverrides & OptionsStylistic): ConfigItem[];

declare function test(options?: OptionsIsInEditor & OptionsOverrides): ConfigItem[];

/**
 * Optional perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
declare function perfectionist(): ConfigItem[];

/**
 * Combine array and non-array configs into a single array.
 */
declare function combine(...configs: (ConfigItem | ConfigItem[])[]): ConfigItem[];
declare function renameRules(rules: Record<string, any>, from: string, to: string): {
    [k: string]: any;
};
declare function toArray<T>(value: T | T[]): T[];

declare const GLOB_SRC_EXT = "?([cm])[jt]s?(x)";
declare const GLOB_SRC = "**/*.?([cm])[jt]s?(x)";
declare const GLOB_JS = "**/*.?([cm])js";
declare const GLOB_JSX = "**/*.?([cm])jsx";
declare const GLOB_TS = "**/*.?([cm])ts";
declare const GLOB_TSX = "**/*.?([cm])tsx";
declare const GLOB_STYLE = "**/*.{c,le,sc}ss";
declare const GLOB_CSS = "**/*.css";
declare const GLOB_LESS = "**/*.less";
declare const GLOB_SCSS = "**/*.scss";
declare const GLOB_JSON = "**/*.json";
declare const GLOB_JSON5 = "**/*.json5";
declare const GLOB_JSONC = "**/*.jsonc";
declare const GLOB_MARKDOWN = "**/*.md";
declare const GLOB_VUE = "**/*.vue";
declare const GLOB_YAML = "**/*.y?(a)ml";
declare const GLOB_HTML = "**/*.htm?(l)";
declare const GLOB_MARKDOWN_CODE = "**/*.md/**/*.?([cm])[jt]s?(x)";
declare const GLOB_TESTS: string[];
declare const GLOB_ALL_SRC: string[];
declare const GLOB_EXCLUDE: string[];

export { ConfigItem, GLOB_ALL_SRC, GLOB_CSS, GLOB_EXCLUDE, GLOB_HTML, GLOB_JS, GLOB_JSON, GLOB_JSON5, GLOB_JSONC, GLOB_JSX, GLOB_LESS, GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_SCSS, GLOB_SRC, GLOB_SRC_EXT, GLOB_STYLE, GLOB_TESTS, GLOB_TS, GLOB_TSX, GLOB_VUE, GLOB_YAML, OptionsComponentExts, OptionsConfig, OptionsHasTypeScript, OptionsIgnores, OptionsIsInEditor, OptionsOverrides, OptionsStylistic, OptionsTypeScriptParserOptions, OptionsTypeScriptWithTypes, Rules, StylisticConfig, StylisticOverridesConfig, WrapRuleConfig, combine, comments, lincy as default, ignores, imports, javascript, jsdoc, jsonc, lincy, markdown, node, perfectionist, renameRules, sortPackageJson, sortTsconfig, stylistic, test, toArray, typescript, unicorn, vue, yaml };
