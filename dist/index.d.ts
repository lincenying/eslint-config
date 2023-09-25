import { FlatESLintConfigItem } from 'eslint-define-config';
import { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';
export { default as pluginAntfu } from 'eslint-plugin-antfu';
export { default as pluginComments } from 'eslint-plugin-eslint-comments';
export { default as pluginImport } from 'eslint-plugin-i';
export { default as pluginJsdoc } from 'eslint-plugin-jsdoc';
export { default as pluginJsonc } from 'eslint-plugin-jsonc';
export { default as pluginMarkdown } from 'eslint-plugin-markdown';
export { default as pluginNode } from 'eslint-plugin-n';
export { default as pluginStylisticJs } from '@stylistic/eslint-plugin-js';
export { default as pluginStylisticTs } from '@stylistic/eslint-plugin-ts';
export { default as pluginTs } from '@typescript-eslint/eslint-plugin';
export { default as pluginUnicorn } from 'eslint-plugin-unicorn';
export { default as pluginUnusedImports } from 'eslint-plugin-unused-imports';
export { default as pluginVue } from 'eslint-plugin-vue';
export { default as pluginYml } from 'eslint-plugin-yml';
export { default as pluginNoOnlyTests } from 'eslint-plugin-no-only-tests';
export { default as parserTs } from '@typescript-eslint/parser';
export { default as parserVue } from 'vue-eslint-parser';
export { default as parserYml } from 'yaml-eslint-parser';
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
interface OptionsTypeScriptWithLanguageServer {
    tsconfigPath: string;
    tsconfigRootDir?: string;
}
interface OptionsHasTypeScript {
    typescript?: boolean;
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
    typescript?: boolean | OptionsTypeScriptWithLanguageServer;
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
}

/**
 * Construct an array of ESLint flat config items.
 */
declare function lincy(options?: OptionsConfig & FlatESLintConfigItem, ...userConfigs: (FlatESLintConfigItem | FlatESLintConfigItem[])[]): FlatESLintConfigItem[];

declare const comments: FlatESLintConfigItem[];

declare const ignores: FlatESLintConfigItem[];

declare const imports: FlatESLintConfigItem[];

declare function javascript(options?: OptionsIsInEditor): FlatESLintConfigItem[];

declare const jsdoc: FlatESLintConfigItem[];

declare const jsonc: FlatESLintConfigItem[];

declare function markdown(options?: OptionsComponentExts): FlatESLintConfigItem[];

declare const node: FlatESLintConfigItem[];

/**
 * Sort package.json
 *
 * Requires `jsonc` config
 */
declare const sortPackageJson: FlatESLintConfigItem[];
/**
 * Sort tsconfig.json
 *
 * Requires `jsonc` config
 */
declare const sortTsconfig: FlatESLintConfigItem[];

declare const javascriptStylistic: FlatESLintConfigItem[];
declare const typescriptStylistic: FlatESLintConfigItem[];

declare function typescript(options?: OptionsComponentExts): FlatESLintConfigItem[];
declare function typescriptWithLanguageServer(options: OptionsTypeScriptWithLanguageServer & OptionsComponentExts): FlatESLintConfigItem[];

declare const unicorn: FlatESLintConfigItem[];

declare function vue(options?: OptionsHasTypeScript): FlatESLintConfigItem[];

declare const yml: FlatESLintConfigItem[];

declare function test(options?: OptionsIsInEditor): FlatESLintConfigItem[];

/**
 * Combine array and non-array configs into a single array.
 */
declare function combine(...configs: (FlatESLintConfigItem | FlatESLintConfigItem[])[]): FlatESLintConfigItem[];
declare function renameRules(rules: Record<string, any>, from: string, to: string): {
    [k: string]: any;
};

export { OptionsComponentExts, OptionsConfig, OptionsHasTypeScript, OptionsIsInEditor, OptionsTypeScriptWithLanguageServer, combine, comments, lincy as default, ignores, imports, javascript, javascriptStylistic, jsdoc, jsonc, lincy, markdown, node, renameRules, sortPackageJson, sortTsconfig, test, typescript, typescriptStylistic, typescriptWithLanguageServer, unicorn, vue, yml };
