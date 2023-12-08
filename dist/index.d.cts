import { Linter } from 'eslint';
import { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';
import { ParserOptions } from '@typescript-eslint/parser';
import { Options } from 'eslint-processor-vue-blocks';
import { RuleConfig, MergeIntersection, RenamePrefix, VitestRules, YmlRules, NRules, Prefix, ReactHooksRules, ReactRules, ImportRules, EslintRules, JsoncRules, VueRules, EslintCommentsRules, FlatESLintConfigItem } from '@antfu/eslint-define-config';
import { RuleOptions as RuleOptions$1 } from '@eslint-types/jsdoc/types';
import { RuleOptions } from '@eslint-types/typescript-eslint/types';
import { RuleOptions as RuleOptions$2 } from '@eslint-types/unicorn/types';
import { Rules as Rules$1 } from 'eslint-plugin-antfu';
import { UnprefixedRuleOptions, StylisticCustomizeOptions } from '@stylistic/eslint-plugin';

/**
 * Vendor types from Prettier so we don't rely on the dependency.
 */
type VendoredPrettierOptions = Partial<VendoredPrettierOptionsRequired>;
interface VendoredPrettierOptionsRequired {
    /**
     * Specify the number of spaces per indentation-level.
     */
    tabWidth: number;
    /**
     * Indent lines with tabs instead of spaces
     */
    useTabs?: boolean;
    /**
     * Print semicolons at the ends of statements.
     */
    semi: boolean;
    /**
     * Use single quotes instead of double quotes.
     */
    singleQuote: boolean;
    /**
     * Use single quotes in JSX.
     */
    jsxSingleQuote: boolean;
    /**
     * Print trailing commas wherever possible.
     */
    trailingComma: 'none' | 'es5' | 'all';
    /**
     * Print spaces between brackets in object literals.
     */
    bracketSpacing: boolean;
    /**
     * Put the `>` of a multi-line HTML (HTML, JSX, Vue, Angular) element at the end of the last line instead of being
     * alone on the next line (does not apply to self closing elements).
     */
    bracketSameLine: boolean;
    /**
     * Put the `>` of a multi-line JSX element at the end of the last line instead of being alone on the next line.
     * @deprecated use bracketSameLine instead
     */
    jsxBracketSameLine: boolean;
    /**
     * Format only a segment of a file.
     */
    rangeStart: number;
    /**
     * Format only a segment of a file.
     * @default Number.POSITIVE_INFINITY
     */
    rangeEnd: number;
    /**
     * By default, Prettier will wrap markdown text as-is since some services use a linebreak-sensitive renderer.
     * In some cases you may want to rely on editor/viewer soft wrapping instead, so this option allows you to opt out.
     * @default "preserve"
     */
    proseWrap: 'always' | 'never' | 'preserve';
    /**
     * Include parentheses around a sole arrow function parameter.
     * @default "always"
     */
    arrowParens: 'avoid' | 'always';
    /**
     * Provide ability to support new languages to prettier.
     */
    plugins: Array<string | any>;
    /**
     * How to handle whitespaces in HTML.
     * @default "css"
     */
    htmlWhitespaceSensitivity: 'css' | 'strict' | 'ignore';
    /**
     * Which end of line characters to apply.
     * @default "lf"
     */
    endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
    /**
     * Change when properties in objects are quoted.
     * @default "as-needed"
     */
    quoteProps: 'as-needed' | 'consistent' | 'preserve';
    /**
     * Whether or not to indent the code inside <script> and <style> tags in Vue files.
     * @default false
     */
    vueIndentScriptAndStyle: boolean;
    /**
     * Enforce single attribute per line in HTML, Vue and JSX.
     * @default false
     */
    singleAttributePerLine: boolean;
}

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
     * 每个配置项的自定义名称
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
     * 自定义 glob 覆盖 “files” 选项
     */
    files?: string[];
}
interface OptionsVue {
    /**
     * 为 Vue SFC 创建虚拟文件以启用 linting.
     *
     * @see https://github.com/antfu/eslint-processor-vue-blocks
     * @default true
     */
    sfcBlocks?: boolean | Options;
}
interface OptionsFormatters {
    /**
     * 启用对 CSS、Less、Sass 和 SCSS 的格式化支持.
     *
     * 目前仅支持Prettier.
     */
    css?: 'prettier' | boolean;
    /**
     * 启用 HTML 格式支持.
     *
     * 目前仅支持Prettier.
     */
    html?: 'prettier' | boolean;
    /**
     * 启用 TOML 格式支持.
     *
     * 目前仅支持dprint.
     */
    toml?: 'dprint' | boolean;
    /**
     * 启用对 Markdown 的格式化支持.
     *
     * 同时支持 Prettier 和 dprint.
     *
     * 当设置为“true”时，将使用 Prettier.
     */
    markdown?: 'prettier' | 'dprint' | boolean;
    /**
     * 启用 GraphQL 的格式化支持.
     */
    graphql?: 'prettier' | boolean;
    /**
     * Prettier 的自定义选项.
     *
     * 默认情况下它是由我们自己的配置控制的.
     */
    prettierOptions?: VendoredPrettierOptions;
    /**
     * dprint 的自定义选项.
     *
     * 默认情况下它是由我们自己的配置控制的.
     */
    dprintOptions?: boolean;
}
interface OptionsComponentExts {
    /**
     * 组件的附加扩展
     *
     * @example ['vue']
     * @default []
     */
    componentExts?: string[];
}
interface OptionsTypeScriptParserOptions {
    /**
     * TypeScript 的附加解析器选项。
     */
    parserOptions?: Partial<ParserOptions>;
}
interface OptionsTypeScriptWithTypes {
    /**
     * 提供此选项后，将启用类型感知规则。
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
interface StylisticConfig extends Pick<StylisticCustomizeOptions, 'indent' | 'quotes' | 'jsx' | 'semi'> {
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
    typescript?: boolean;
    jsx?: boolean;
    /** react 版本 */
    version?: string;
    overrides?: FlatConfigItem['rules'];
}
interface OptionsUnoCSS {
    /**
     * 启用 attributify 支持.
     * @default true
     */
    attributify?: boolean;
    /**
     * 启用严格模式，抛出有关阻止列表类的错误.
     * @default false
     */
    strict?: boolean;
    overrides?: FlatConfigItem['rules'];
}
interface OptionsConfig extends OptionsComponentExts {
    /**
     * 启用 gitignore 支持.
     *
     * Passing an object to configure the options.
     *
     * @see https://github.com/antfu/eslint-config-flat-gitignore
     * @default true
     */
    gitignore?: boolean | FlatGitignoreOptions;
    /**
     * 启用 TypeScript 支持.
     *
     * 传递对象以启用 TypeScript 语言服务器支持.
     *
     * @default 根据依赖关系自动检测
     */
    typescript?: boolean | OptionsTypeScriptWithTypes | OptionsTypeScriptParserOptions | OptionsFiles;
    /**
     * 启用 JSX 相关规则.
     *
     * 目前仅包含风格规则.
     *
     * @default true
     */
    jsx?: boolean;
    /**
     * 启用 test 支持.
     *
     * @default true
     */
    test?: boolean | OptionsFiles;
    /**
     * 启用 Vue 支持.
     *
     * @default 根据依赖关系自动检测
     */
    vue?: boolean | OptionsFiles | OptionsVue;
    /**
     * 启用 React 支持.
     *
     * 需要安装:
     * - `eslint-plugin-react`
     * - `eslint-plugin-react-hooks`
     * - `eslint-plugin-react-refresh`
     *
     * @default 根据依赖关系自动检测
     */
    react?: boolean | OptionsReact | OptionsFiles;
    /**
     * 启用 unocss rules.
     *
     * 需要安装:
     * - `@unocss/eslint-plugin`
     *
     * @default false
     */
    unocss?: boolean | OptionsUnoCSS;
    /**
     * 使用外部格式化程序格式化文件.
     *
     * 需要安装:
     * - `eslint-plugin-format`
     *
     * @default false
     */
    formatters?: boolean | OptionsFormatters;
    /**
     * 启用 JSONC 支持.
     *
     * @default true
     */
    jsonc?: boolean | OptionsFiles;
    /**
     * 启用 YAML 支持.
     *
     * @default true
     */
    yaml?: boolean | OptionsFiles;
    /**
     * 启用 Markdown 支持.
     *
     * @default true
     */
    markdown?: boolean | OptionsFiles;
    /**
     * 启用 stylistic 规则.
     *
     * @default true
     */
    stylistic?: boolean | StylisticConfig;
    /**
     * 控制再编辑器中禁用某些规则.
     * @default 基于 process.env 自动检测
     */
    isInEditor?: boolean;
    /**
     * 为每个集成提供规则覆盖
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
        unocss?: FlatConfigItem['rules'];
        ignores?: string[];
    };
}

/**
 * 构造一个ESLint扁平化配置项数组。
 */
declare function lincy(options?: OptionsConfig & FlatConfigItem, ...userConfigs: Awaitable<UserConfigItem | UserConfigItem[]>[]): Promise<UserConfigItem[]>;

declare function comments(): Promise<FlatConfigItem[]>;

declare function ignores(options?: OptionsIgnores): Promise<FlatConfigItem[]>;

declare function imports(options?: OptionsStylistic): Promise<FlatConfigItem[]>;

declare function javascript(options?: OptionsIsInEditor & OptionsOverrides): Promise<FlatConfigItem[]>;

declare function jsdoc(options?: OptionsStylistic): Promise<FlatConfigItem[]>;

declare function jsonc(options?: OptionsFiles & OptionsStylistic & OptionsOverrides): Promise<FlatConfigItem[]>;

declare function markdown(options?: OptionsFiles & OptionsComponentExts & OptionsOverrides): Promise<FlatConfigItem[]>;

/**
 * Optional perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
declare function perfectionist(): Promise<FlatConfigItem[]>;

declare function formatters(options?: OptionsFormatters | true, stylistic?: StylisticConfig): Promise<FlatConfigItem[]>;

declare function node(): Promise<FlatConfigItem[]>;

declare function react(options?: OptionsFiles & OptionsReact): Promise<FlatConfigItem[]>;

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

declare const StylisticConfigDefaults: StylisticConfig;
declare function stylistic(options?: StylisticOverridesConfig): Promise<FlatConfigItem[]>;

declare function test(options?: OptionsFiles & OptionsIsInEditor & OptionsOverrides): Promise<FlatConfigItem[]>;

declare function typescript(options?: OptionsFiles & OptionsComponentExts & OptionsOverrides & OptionsTypeScriptWithTypes & OptionsTypeScriptParserOptions): Promise<FlatConfigItem[]>;

declare function unicorn(): Promise<FlatConfigItem[]>;

declare function unocss(options?: OptionsUnoCSS): Promise<FlatConfigItem[]>;

declare function vue(options?: OptionsHasTypeScript & OptionsOverrides & OptionsStylistic & OptionsFiles & OptionsVue): Promise<FlatConfigItem[]>;

declare function yaml(options?: OptionsFiles & OptionsOverrides & OptionsStylistic): Promise<FlatConfigItem[]>;

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
declare function ensurePackages(packages: string[]): Promise<void>;

declare const GLOB_SRC_EXT = "?([cm])[jt]s?(x)";
declare const GLOB_SRC = "**/*.?([cm])[jt]s?(x)";
declare const GLOB_JS = "**/*.?([cm])js";
declare const GLOB_JSX = "**/*.?([cm])jsx";
declare const GLOB_TS = "**/*.?([cm])ts";
declare const GLOB_TSX = "**/*.?([cm])tsx";
declare const GLOB_STYLE = "**/*.{c,le,sc}ss";
declare const GLOB_CSS = "**/*.css";
declare const GLOB_POSTCSS = "**/*.{p,post}css";
declare const GLOB_LESS = "**/*.less";
declare const GLOB_SCSS = "**/*.scss";
declare const GLOB_JSON = "**/*.json";
declare const GLOB_JSON5 = "**/*.json5";
declare const GLOB_JSONC = "**/*.jsonc";
declare const GLOB_MARKDOWN = "**/*.md";
declare const GLOB_MARKDOWN_IN_MARKDOWN = "**/*.md/*.md";
declare const GLOB_VUE = "**/*.vue";
declare const GLOB_YAML = "**/*.y?(a)ml";
declare const GLOB_HTML = "**/*.htm?(l)";
declare const GLOB_MARKDOWN_CODE = "**/*.md/**/*.?([cm])[jt]s?(x)";
declare const GLOB_TESTS: string[];
declare const GLOB_ALL_SRC: string[];
declare const GLOB_EXCLUDE: string[];

export { type Awaitable, type FlatConfigItem, GLOB_ALL_SRC, GLOB_CSS, GLOB_EXCLUDE, GLOB_HTML, GLOB_JS, GLOB_JSON, GLOB_JSON5, GLOB_JSONC, GLOB_JSX, GLOB_LESS, GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN, GLOB_POSTCSS, GLOB_SCSS, GLOB_SRC, GLOB_SRC_EXT, GLOB_STYLE, GLOB_TESTS, GLOB_TS, GLOB_TSX, GLOB_VUE, GLOB_YAML, type OptionsComponentExts, type OptionsConfig, type OptionsFiles, type OptionsFormatters, type OptionsHasTypeScript, type OptionsIgnores, type OptionsIsInEditor, type OptionsOverrides, type OptionsReact, type OptionsStylistic, type OptionsTypeScriptParserOptions, type OptionsTypeScriptWithTypes, type OptionsUnoCSS, type OptionsVue, type Rules, type StylisticConfig, StylisticConfigDefaults, type StylisticOverridesConfig, type UserConfigItem, type WrapRuleConfig, combine, comments, lincy as default, ensurePackages, formatters, ignores, imports, interopDefault, javascript, jsdoc, jsonc, lincy, markdown, node, perfectionist, react, renameRules, sortPackageJson, sortTsconfig, stylistic, test, toArray, typescript, unicorn, unocss, vue, yaml };
