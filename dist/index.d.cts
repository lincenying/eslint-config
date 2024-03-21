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
 * 来自 Prettier 的供应商类型，因此不依赖依赖项
 */
type VendoredPrettierOptions = Partial<VendoredPrettierOptionsRequired>;
interface VendoredPrettierOptionsRequired {
    /**
     * 指定换行的行长度.
     * @default 200
     */
    printWidth: number;
    /**
     * 指定每个缩进的空格数.
     */
    tabWidth: number;
    /**
     * 使用制表符而不是空格来缩进行
     */
    useTabs?: boolean;
    /**
     * 在语句末尾添加分号.
     */
    semi: boolean;
    /**
     * 使用单引号代替双引号.
     */
    singleQuote: boolean;
    /**
     * 在 JSX 中使用单引号.
     */
    jsxSingleQuote: boolean;
    /**
     * 尽可能添加尾随逗号.
     */
    trailingComma: 'none' | 'es5' | 'all';
    /**
     * 对象文字中括号之间的空格.
     */
    bracketSpacing: boolean;
    /**
     * 将多行 HTML（HTML、JSX、Vue、Angular）元素的 `>` 放在最后一行的末尾，
     * 而不是单独放在下一行（不适用于自闭合元素）。
     */
    bracketSameLine: boolean;
    /**
     * 将多行 JSX 元素的 `>` 放在最后一行的末尾，而不是单独放在下一行.
     * @deprecated 使用 bracketSameLine 代替
     */
    jsxBracketSameLine: boolean;
    /**
     * 仅格式化文件的一部分.
     */
    rangeStart: number;
    /**
     * 仅格式化文件的一部分.
     * @default Number.POSITIVE_INFINITY
     */
    rangeEnd: number;
    /**
     * 默认情况下，Prettier 将按原样包装 Markdown 文本，因为某些服务使用换行敏感渲染器.
     * 在某些情况下，您可能希望依靠编辑器/查看器软包装，因此此选项允许您选择退出.
     * @default "preserve"
     */
    proseWrap: 'always' | 'never' | 'preserve';
    /**
     * 箭头函数参数周围包含括号.
     * @default "always"
     */
    arrowParens: 'avoid' | 'always';
    /**
     * 为 Prettier 提供支持新语言的能力.
     */
    plugins: Array<string | any>;
    /**
     * 如何处理 HTML 中的空格.
     * @default "css"
     */
    htmlWhitespaceSensitivity: 'css' | 'strict' | 'ignore';
    /**
     * 应用哪个换行符.
     * @default "lf"
     */
    endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
    /**
     * 引用对象中的属性时发生更改.
     * @default "as-needed"
     */
    quoteProps: 'as-needed' | 'consistent' | 'preserve';
    /**
     * 是否缩进Vue文件中<script>和<style>标签内的代码.
     * @default false
     */
    vueIndentScriptAndStyle: boolean;
    /**
     * 在 HTML、Vue 和 JSX 中强制每行使用单一属性.
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
    /**
     * 应该识别类型的文件的全局模式.
     * @default ['**\/*.{ts,tsx}']
     */
    filesTypeAware?: string[];
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
     * 启用 svelte 支持.
     *
     * 需要安装:
     * - `eslint-plugin-svelte`
     * - `svelte-eslint-parser`
     *
     * @default false
     */
    svelte?: boolean;
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
     * 启用 TOML 支持.
     *
     * @default false
     */
    toml?: boolean;
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
     * Automatically rename plugins in the config.
     *
     * @default true
     */
    autoRenamePlugins?: boolean;
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
        svelte?: FlatConfigItem['rules'];
        jsonc?: FlatConfigItem['rules'];
        markdown?: FlatConfigItem['rules'];
        yaml?: FlatConfigItem['rules'];
        toml?: FlatConfigItem['rules'];
        unocss?: FlatConfigItem['rules'];
        ignores?: string[];
    };
}

declare const defaultPluginRenaming: {
    '@stylistic': string;
    '@typescript-eslint': string;
    'import-x': string;
    n: string;
    vitest: string;
    yml: string;
};
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

declare function toml(options?: OptionsOverrides & OptionsStylistic & OptionsFiles): Promise<FlatConfigItem[]>;

/**
 * Combine array and non-array configs into a single array.
 */
declare function combine(...configs: Awaitable<UserConfigItem | UserConfigItem[]>[]): Promise<UserConfigItem[]>;
/**
 * Rename plugin prefixes in a rule object.
 * Accepts a map of prefixes to rename.
 *
 * @example
 * ```ts
 * import { renameRules } from '@lincy/eslint-config'
 *
 * export default [{
 *   rules: renameRules(
 *     {
 *       '@typescript-eslint/indent': 'error'
 *     },
 *     { '@typescript-eslint': 'ts' }
 *   )
 * }]
 * ```
 */
declare function renameRules(rules: Record<string, any>, map: Record<string, string>): {
    [k: string]: any;
};
/**
 * Rename plugin names a flat configs array
 *
 * @example
 * ```ts
 * import { renamePluginInConfigs } from '@lincy/eslint-config'
 * import someConfigs from './some-configs'
 *
 * export default renamePluginInConfigs(someConfigs, {
 *   '@typescript-eslint': 'ts',
 *   'import-x': 'import',
 * })
 * ```
 */
declare function renamePluginInConfigs(configs: UserConfigItem[], map: Record<string, string>): UserConfigItem[];
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
declare const GLOB_SVELTE = "**/*.svelte";
declare const GLOB_VUE = "**/*.vue";
declare const GLOB_YAML = "**/*.y?(a)ml";
declare const GLOB_TOML = "**/*.toml";
declare const GLOB_HTML = "**/*.htm?(l)";
declare const GLOB_MARKDOWN_CODE = "**/*.md/**/*.?([cm])[jt]s?(x)";
declare const GLOB_TESTS: string[];
declare const GLOB_ALL_SRC: string[];
declare const GLOB_EXCLUDE: string[];

export { type Awaitable, type FlatConfigItem, GLOB_ALL_SRC, GLOB_CSS, GLOB_EXCLUDE, GLOB_HTML, GLOB_JS, GLOB_JSON, GLOB_JSON5, GLOB_JSONC, GLOB_JSX, GLOB_LESS, GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN, GLOB_POSTCSS, GLOB_SCSS, GLOB_SRC, GLOB_SRC_EXT, GLOB_STYLE, GLOB_SVELTE, GLOB_TESTS, GLOB_TOML, GLOB_TS, GLOB_TSX, GLOB_VUE, GLOB_YAML, type OptionsComponentExts, type OptionsConfig, type OptionsFiles, type OptionsFormatters, type OptionsHasTypeScript, type OptionsIgnores, type OptionsIsInEditor, type OptionsOverrides, type OptionsReact, type OptionsStylistic, type OptionsTypeScriptParserOptions, type OptionsTypeScriptWithTypes, type OptionsUnoCSS, type OptionsVue, type Rules, type StylisticConfig, StylisticConfigDefaults, type StylisticOverridesConfig, type UserConfigItem, type WrapRuleConfig, combine, comments, lincy as default, defaultPluginRenaming, ensurePackages, formatters, ignores, imports, interopDefault, javascript, jsdoc, jsonc, lincy, markdown, node, perfectionist, react, renamePluginInConfigs, renameRules, sortPackageJson, sortTsconfig, stylistic, test, toArray, toml, typescript, unicorn, unocss, vue, yaml };
