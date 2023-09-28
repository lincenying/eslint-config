import { FlatESLintConfigItem } from 'eslint-define-config';
import { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';
import { ParserOptions } from '@typescript-eslint/parser';
export { default as parserTs } from '@typescript-eslint/parser';
export { default as pluginAntfu } from 'eslint-plugin-antfu';
export { default as pluginComments } from 'eslint-plugin-eslint-comments';
export { default as pluginImport } from 'eslint-plugin-i';
export { default as pluginJsdoc } from 'eslint-plugin-jsdoc';
export { default as pluginJsonc } from 'eslint-plugin-jsonc';
export { default as pluginMarkdown } from 'eslint-plugin-markdown';
export { default as pluginNode } from 'eslint-plugin-n';
export { default as pluginStylistic } from '@stylistic/eslint-plugin';
export { default as pluginTs } from '@typescript-eslint/eslint-plugin';
export { default as pluginUnicorn } from 'eslint-plugin-unicorn';
export { default as pluginUnusedImports } from 'eslint-plugin-unused-imports';
export { default as pluginVue } from 'eslint-plugin-vue';
export { default as pluginYaml } from 'eslint-plugin-yml';
export { default as pluginNoOnlyTests } from 'eslint-plugin-no-only-tests';
export { default as parserVue } from 'vue-eslint-parser';
export { default as parserYaml } from 'yaml-eslint-parser';
export { default as parserJsonc } from 'jsonc-eslint-parser';

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
    tsconfigPath?: string;
}
interface OptionsHasTypeScript {
    typescript?: boolean;
}
interface OptionsStylistic {
    stylistic?: boolean;
}
interface OptionsOverrides {
    overrides?: FlatESLintConfigItem['rules'];
    ignores?: string[];
}
interface OptionsIsInEditor {
    isInEditor?: boolean;
}
interface OptionsConfig {
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
    typescript?: boolean | OptionsTypeScriptWithTypes;
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
    stylistic?: boolean;
    /**
     * Control to disable some rules in editors.
     * @default auto-detect based on the process.env
     */
    isInEditor?: boolean;
    /**
     * Provide overrides for rules for each integration.
     */
    overrides?: {
        javascript?: FlatESLintConfigItem['rules'];
        typescript?: FlatESLintConfigItem['rules'];
        stylistic?: FlatESLintConfigItem['rules'];
        test?: FlatESLintConfigItem['rules'];
        vue?: FlatESLintConfigItem['rules'];
        jsonc?: FlatESLintConfigItem['rules'];
        markdown?: FlatESLintConfigItem['rules'];
        yaml?: FlatESLintConfigItem['rules'];
        ignores?: string[];
    };
}

/**
 * Construct an array of ESLint flat config items.
 */
declare function lincy(options?: OptionsConfig & FlatESLintConfigItem, ...userConfigs: (FlatESLintConfigItem | FlatESLintConfigItem[])[]): FlatESLintConfigItem[];

declare function comments(): FlatESLintConfigItem[];

declare function ignores(options?: OptionsOverrides): FlatESLintConfigItem[];

declare function imports(options?: OptionsStylistic): FlatESLintConfigItem[];

declare function javascript(options?: OptionsIsInEditor & OptionsOverrides): FlatESLintConfigItem[];

declare function jsdoc(options?: OptionsStylistic): FlatESLintConfigItem[];

declare function jsonc(options?: OptionsStylistic & OptionsOverrides): FlatESLintConfigItem[];

declare function markdown(options?: OptionsComponentExts & OptionsOverrides): FlatESLintConfigItem[];

declare function node(): FlatESLintConfigItem[];

/**
 * Sort package.json
 *
 * Requires `jsonc` config
 */
declare function sortPackageJson(): FlatESLintConfigItem[];
/**
 * Sort tsconfig.json
 *
 * Requires `jsonc` config
 */
declare function sortTsconfig(): FlatESLintConfigItem[];

declare function stylistic(options?: OptionsOverrides): FlatESLintConfigItem[];

declare function typescript(options?: OptionsComponentExts & OptionsOverrides & OptionsTypeScriptWithTypes & OptionsTypeScriptParserOptions): FlatESLintConfigItem[];

declare function unicorn(): FlatESLintConfigItem[];

declare function vue(options?: OptionsHasTypeScript & OptionsOverrides & OptionsStylistic): FlatESLintConfigItem[];

declare function yaml(options?: OptionsOverrides & OptionsStylistic): FlatESLintConfigItem[];

declare function test(options?: OptionsIsInEditor & OptionsOverrides): FlatESLintConfigItem[];

/**
 * Combine array and non-array configs into a single array.
 */
declare function combine(...configs: (FlatESLintConfigItem | FlatESLintConfigItem[])[]): FlatESLintConfigItem[];
declare function renameRules(rules: Record<string, any>, from: string, to: string): {
    [k: string]: any;
};
declare function recordRulesStateConfigs(configs: FlatESLintConfigItem[]): FlatESLintConfigItem[];
declare function recordRulesState(rules: FlatESLintConfigItem['rules']): FlatESLintConfigItem['rules'];
declare function warnUnnecessaryOffRules(): void;

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

export { GLOB_ALL_SRC, GLOB_CSS, GLOB_EXCLUDE, GLOB_HTML, GLOB_JS, GLOB_JSON, GLOB_JSON5, GLOB_JSONC, GLOB_JSX, GLOB_LESS, GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_SCSS, GLOB_SRC, GLOB_SRC_EXT, GLOB_STYLE, GLOB_TESTS, GLOB_TS, GLOB_TSX, GLOB_VUE, GLOB_YAML, OptionsComponentExts, OptionsConfig, OptionsHasTypeScript, OptionsIsInEditor, OptionsOverrides, OptionsStylistic, OptionsTypeScriptParserOptions, OptionsTypeScriptWithTypes, combine, comments, lincy as default, ignores, imports, javascript, jsdoc, jsonc, lincy, markdown, node, recordRulesState, recordRulesStateConfigs, renameRules, sortPackageJson, sortTsconfig, stylistic, test, typescript, unicorn, vue, warnUnnecessaryOffRules, yaml };
