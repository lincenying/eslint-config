import { Linter } from 'eslint';
import { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';
import { ParserOptions } from '@typescript-eslint/parser';
import { RuleConfig, MergeIntersection, RenamePrefix, VitestRules, YmlRules, NRules, Prefix, ReactHooksRules, ReactRules, ImportRules, EslintRules, JsoncRules, VueRules, EslintCommentsRules, FlatESLintConfigItem } from '@antfu/eslint-define-config';
import { RuleOptions as RuleOptions$1 } from '@eslint-types/jsdoc/types';
import { RuleOptions } from '@eslint-types/typescript-eslint/types';
import { RuleOptions as RuleOptions$2 } from '@eslint-types/unicorn/types';
import { Rules as Rules$1 } from 'eslint-plugin-antfu';
import { UnprefixedRuleOptions } from '@stylistic/eslint-plugin';

type WrapRuleConfig<T extends {
    [key: string]: any;
}> = {
    [K in keyof T]: T[K] extends RuleConfig ? T[K] : RuleConfig<T[K]>;
};
type Awaitable<T> = T | Promise<T>;
type Rules = WrapRuleConfig<MergeIntersection<RenamePrefix<RuleOptions, '@typescript-eslint/', 'ts/'> & RenamePrefix<VitestRules, 'vitest/', 'test/'> & RenamePrefix<YmlRules, 'yml/', 'yaml/'> & RenamePrefix<NRules, 'n/', 'node/'> & Prefix<UnprefixedRuleOptions, 'style/'> & Prefix<Rules$1, 'antfu/'> & ReactHooksRules & ReactRules & RuleOptions$1 & ImportRules & EslintRules & JsoncRules & VueRules & RuleOptions$2 & EslintCommentsRules & {
    'test/no-only-tests': RuleConfig<[]>;
}>>;
type FlatConfigItem = Omit<FlatESLintConfigItem<Rules, false>, 'plugins'> & {
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
type UserConfigItem = FlatConfigItem | Linter.FlatConfig;
interface OptionsFiles {
    /**
     * Override the `files` option to provide custom globs.
     */
    files?: string[];
}
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
    overrides?: FlatConfigItem['rules'];
}
interface OptionsOverrides {
    overrides?: FlatConfigItem['rules'];
}
interface OptionsIgnores {
    ignores?: string[];
}
interface OptionsIsInEditor {
    isInEditor?: boolean;
}
interface OptionsReact {
    jsx?: boolean;
    version?: string;
    overrides?: FlatConfigItem['rules'];
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
    typescript?: boolean | OptionsTypeScriptWithTypes | OptionsTypeScriptParserOptions | OptionsFiles;
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
    test?: boolean | OptionsFiles;
    /**
     * Enable Vue support.
     *
     * @default auto-detect based on the dependencies
     */
    vue?: boolean | OptionsFiles;
    /**
     * Enable React support.
     *
     * @default auto-detect based on the dependencies
     */
    react?: boolean | OptionsReact | OptionsFiles;
    /**
     * Enable JSONC support.
     *
     * @default true
     */
    jsonc?: boolean | OptionsFiles;
    /**
     * Enable YAML support.
     *
     * @default true
     */
    yaml?: boolean | OptionsFiles;
    /**
     * Enable Markdown support.
     *
     * @default true
     */
    markdown?: boolean | OptionsFiles;
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
        javascript?: FlatConfigItem['rules'];
        typescript?: FlatConfigItem['rules'];
        stylistic?: FlatConfigItem['rules'];
        test?: FlatConfigItem['rules'];
        vue?: FlatConfigItem['rules'];
        react?: FlatConfigItem['rules'];
        jsonc?: FlatConfigItem['rules'];
        markdown?: FlatConfigItem['rules'];
        yaml?: FlatConfigItem['rules'];
        ignores?: string[];
    };
}

/**
 * Construct an array of ESLint flat config items.
 */
declare function lincy(options?: OptionsConfig & FlatConfigItem, ...userConfigs: Awaitable<UserConfigItem | UserConfigItem[]>[]): Promise<UserConfigItem[]>;

declare function comments(): Promise<FlatConfigItem[]>;

declare function ignores(options?: OptionsIgnores): Promise<FlatConfigItem[]>;

declare function imports(options?: OptionsStylistic): Promise<FlatConfigItem[]>;

declare function javascript(options?: OptionsIsInEditor & OptionsOverrides): Promise<FlatConfigItem[]>;

declare function jsdoc(options?: OptionsStylistic): Promise<FlatConfigItem[]>;

declare function jsonc(options?: OptionsFiles & OptionsStylistic & OptionsOverrides): Promise<FlatConfigItem[]>;

declare function markdown(options?: OptionsFiles & OptionsComponentExts & OptionsOverrides): Promise<FlatConfigItem[]>;

declare function node(): Promise<FlatConfigItem[]>;

/**
 * Sort package.json
 *
 * Requires `jsonc` config
 */
declare function sortPackageJson(): Promise<FlatConfigItem[]>;
/**
 * Sort tsconfig.json
 *
 * Requires `jsonc` config
 */
declare function sortTsconfig(): FlatConfigItem[];

declare function stylistic(options?: StylisticOverridesConfig): Promise<FlatConfigItem[]>;

declare function typescript(options?: OptionsFiles & OptionsComponentExts & OptionsOverrides & OptionsTypeScriptWithTypes & OptionsTypeScriptParserOptions): Promise<FlatConfigItem[]>;

declare function unicorn(): Promise<FlatConfigItem[]>;

declare function vue(options?: OptionsFiles & OptionsHasTypeScript & OptionsOverrides & OptionsStylistic): Promise<FlatConfigItem[]>;

declare function yaml(options?: OptionsFiles & OptionsOverrides & OptionsStylistic): Promise<FlatConfigItem[]>;

declare function test(options?: OptionsFiles & OptionsIsInEditor & OptionsOverrides): Promise<FlatConfigItem[]>;

/**
 * Optional perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
declare function perfectionist(): Promise<FlatConfigItem[]>;

declare function react(options?: OptionsFiles & OptionsReact): Promise<FlatConfigItem[]>;

/**
 * Combine array and non-array configs into a single array.
 */
declare function combine(...configs: Awaitable<UserConfigItem | UserConfigItem[]>[]): Promise<UserConfigItem[]>;
declare function renameRules(rules: Record<string, any>, from: string, to: string): {
    [k: string]: any;
};
declare function toArray<T>(value: T | T[]): T[];
declare function interopDefault<T>(m: Awaitable<T>): Promise<T extends {
    default: infer U;
} ? U : T>;

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

export { type Awaitable, type FlatConfigItem, GLOB_ALL_SRC, GLOB_CSS, GLOB_EXCLUDE, GLOB_HTML, GLOB_JS, GLOB_JSON, GLOB_JSON5, GLOB_JSONC, GLOB_JSX, GLOB_LESS, GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_SCSS, GLOB_SRC, GLOB_SRC_EXT, GLOB_STYLE, GLOB_TESTS, GLOB_TS, GLOB_TSX, GLOB_VUE, GLOB_YAML, type OptionsComponentExts, type OptionsConfig, type OptionsFiles, type OptionsHasTypeScript, type OptionsIgnores, type OptionsIsInEditor, type OptionsOverrides, type OptionsReact, type OptionsStylistic, type OptionsTypeScriptParserOptions, type OptionsTypeScriptWithTypes, type Rules, type StylisticConfig, type StylisticOverridesConfig, type UserConfigItem, type WrapRuleConfig, combine, comments, lincy as default, ignores, imports, interopDefault, javascript, jsdoc, jsonc, lincy, markdown, node, perfectionist, react, renameRules, sortPackageJson, sortTsconfig, stylistic, test, toArray, typescript, unicorn, vue, yaml };
