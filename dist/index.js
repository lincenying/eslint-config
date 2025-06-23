import { FlatConfigComposer } from "eslint-flat-config-utils";
import { getPackageInfoSync, isPackageExists } from "local-pkg";
import pluginComments from "@eslint-community/eslint-plugin-eslint-comments";
import pluginAntfu from "eslint-plugin-antfu";
import pluginImportLite from "eslint-plugin-import-lite";
import pluginNode from "eslint-plugin-n";
import pluginPerfectionist from "eslint-plugin-perfectionist";
import pluginUnicorn from "eslint-plugin-unicorn";
import pluginUnusedImports from "eslint-plugin-unused-imports";
import process from "node:process";
import { fileURLToPath } from "node:url";
import globals from "globals";
import { mergeProcessors, processorPassThrough } from "eslint-merge-processors";
import * as parserPlain$1 from "eslint-parser-plain";
import { configs } from "eslint-plugin-regexp";

//#region src/configs/comments.ts
async function comments(options = {}) {
	const { overrides = {} } = options;
	return [{
		name: "eslint/comments/rules",
		plugins: { "eslint-comments": pluginComments },
		rules: {
			"eslint-comments/no-aggregating-enable": "error",
			"eslint-comments/no-duplicate-disable": "error",
			"eslint-comments/no-unlimited-disable": "error",
			"eslint-comments/no-unused-enable": "error",
			...overrides
		}
	}];
}

//#endregion
//#region src/globs.ts
const GLOB_SRC_EXT = "?([cm])[jt]s?(x)";
const GLOB_SRC = "**/*.?([cm])[jt]s?(x)";
const GLOB_JS = "**/*.?([cm])js";
const GLOB_JSX = "**/*.?([cm])jsx";
const GLOB_TS = "**/*.?([cm])ts";
const GLOB_TSX = "**/*.?([cm])tsx";
const GLOB_STYLE = "**/*.{c,le,sc}ss";
const GLOB_CSS = "**/*.css";
const GLOB_POSTCSS = "**/*.{p,post}css";
const GLOB_LESS = "**/*.less";
const GLOB_SCSS = "**/*.scss";
const GLOB_JSON = "**/*.json";
const GLOB_JSON5 = "**/*.json5";
const GLOB_JSONC = "**/*.jsonc";
const GLOB_MARKDOWN = "**/*.md";
const GLOB_MARKDOWN_IN_MARKDOWN = "**/*.md/*.md";
const GLOB_SVELTE = "**/*.svelte";
const GLOB_VUE = "**/*.vue";
const GLOB_YAML = "**/*.y?(a)ml";
const GLOB_TOML = "**/*.toml";
const GLOB_XML = "**/*.xml";
const GLOB_SVG = "**/*.svg";
const GLOB_HTML = "**/*.htm?(l)";
const GLOB_GRAPHQL = "**/*.{g,graph}ql";
const GLOB_MARKDOWN_CODE = `${GLOB_MARKDOWN}/${GLOB_SRC}`;
const GLOB_TESTS = [
	`**/__tests__/**/*.${GLOB_SRC_EXT}`,
	`**/*.spec.${GLOB_SRC_EXT}`,
	`**/*.test.${GLOB_SRC_EXT}`
];
const GLOB_ALL_SRC = [
	GLOB_SRC,
	GLOB_STYLE,
	GLOB_JSON,
	GLOB_JSON5,
	GLOB_MARKDOWN,
	GLOB_SVELTE,
	GLOB_VUE,
	GLOB_YAML,
	GLOB_HTML
];
const GLOB_EXCLUDE = [
	"**/node_modules",
	"**/dist",
	"**/package-lock.json",
	"**/yarn.lock",
	"**/pnpm-lock.yaml",
	"**/output",
	"**/coverage",
	"**/tmp",
	"**/temp",
	"**/.tmp",
	"**/.temp",
	"**/.history",
	"**/.vitepress/cache",
	"**/.nuxt",
	"**/.next",
	"**/.vercel",
	"**/.changeset",
	"**/.idea",
	"**/.output",
	"**/.vite-inspect",
	"**/.yarn",
	"**/vite.config.*.timestamp-*",
	"**/CHANGELOG*.md",
	"**/*.min.*",
	"**/LICENSE*",
	"**/__snapshots__",
	"**/auto-import?(s).d.ts",
	"**/components.d.ts"
];

//#endregion
//#region src/configs/disables.ts
async function disables() {
	return [
		{
			files: [`**/scripts/${GLOB_SRC}`],
			name: "eslint/disables/scripts",
			rules: {
				"antfu/no-top-level-await": "off",
				"no-console": "off",
				"ts/explicit-function-return-type": "off"
			}
		},
		{
			files: [`**/cli/${GLOB_SRC}`, `**/cli.${GLOB_SRC_EXT}`],
			name: "eslint/disables/cli",
			rules: {
				"antfu/no-top-level-await": "off",
				"no-console": "off"
			}
		},
		{
			files: ["**/bin/**/*", `**/bin.${GLOB_SRC_EXT}`],
			name: "eslint/disables/bin",
			rules: {
				"antfu/no-import-dist": "off",
				"antfu/no-import-node-modules-by-path": "off"
			}
		},
		{
			files: ["**/*.d.?([cm])ts"],
			name: "eslint/disables/dts",
			rules: {
				"eslint-comments/no-unlimited-disable": "off",
				"import/no-duplicates": "off",
				"no-restricted-syntax": "off",
				"unused-imports/no-unused-vars": "off"
			}
		},
		{
			files: ["**/*.js", "**/*.cjs"],
			name: "eslint/disables/cjs",
			rules: { "ts/no-require-imports": "off" }
		},
		{
			files: [`**/*.config.${GLOB_SRC_EXT}`, `**/*.config.*.${GLOB_SRC_EXT}`],
			name: "eslint/disables/config-files",
			rules: {
				"antfu/no-top-level-await": "off",
				"no-console": "off",
				"ts/explicit-function-return-type": "off"
			}
		}
	];
}

//#endregion
//#region src/utils.ts
const scopeUrl = fileURLToPath(new URL(".", import.meta.url));
const isCwdInScope = isPackageExists("@antfu/eslint-config");
const parserPlain = {
	meta: { name: "parser-plain" },
	parseForESLint: (code) => ({
		ast: {
			body: [],
			comments: [],
			loc: {
				end: code.length,
				start: 0
			},
			range: [0, code.length],
			tokens: [],
			type: "Program"
		},
		scopeManager: null,
		services: { isPlain: true },
		visitorKeys: { Program: [] }
	})
};
/**
* Combine array and non-array configs into a single array.
*/
async function combine(...configs$1) {
	const resolved = await Promise.all(configs$1);
	return resolved.flat();
}
function renameRules(rules, map) {
	return Object.fromEntries(Object.entries(rules).map(([key, value]) => {
		for (const [from, to] of Object.entries(map)) if (key.startsWith(`${from}/`)) return [to + key.slice(from.length), value];
		return [key, value];
	}));
}
function renamePluginInConfigs(configs$1, map) {
	return configs$1.map((i) => {
		const clone = { ...i };
		if (clone.rules) clone.rules = renameRules(clone.rules, map);
		if (clone.plugins) clone.plugins = Object.fromEntries(Object.entries(clone.plugins).map(([key, value]) => {
			if (key in map) return [map[key], value];
			return [key, value];
		}));
		return clone;
	});
}
function toArray(value) {
	return Array.isArray(value) ? value : [value];
}
async function interopDefault(m) {
	const resolved = await m;
	return resolved.default || resolved;
}
function isPackageInScope(name) {
	return isPackageExists(name, { paths: [scopeUrl] });
}
async function ensurePackages(packages) {
	if (process.env.CI || process.stdout.isTTY === false || isCwdInScope === false) return;
	const nonExistingPackages = packages.filter((i) => i && !isPackageInScope(i));
	if (nonExistingPackages.length === 0) return;
	const p = await import("@clack/prompts");
	const result = await p.confirm({ message: `此配置需要软件包: ${nonExistingPackages.join(", ")}. 你想安装它们吗?` });
	if (result) await import("@antfu/install-pkg").then((i) => i.installPackage(nonExistingPackages, { dev: true }));
}
function isInEditorEnv() {
	if (process.env.CI) return false;
	if (isInGitHooksOrLintStaged()) return false;
	return !!(process.env.VSCODE_PID || process.env.VSCODE_CWD || process.env.JETBRAINS_IDE || process.env.VIM || process.env.NVIM);
}
function isInGitHooksOrLintStaged() {
	return !!(process.env.GIT_PARAMS || process.env.VSCODE_GIT_COMMAND || process.env.npm_lifecycle_script?.startsWith("lint-staged"));
}

//#endregion
//#region src/configs/stylistic.ts
const StylisticConfigDefaults = {
	indent: 4,
	jsx: true,
	lessOpinionated: false,
	quotes: "single",
	semi: false
};
async function stylistic(options = {}) {
	const { overrides = {}, stylistic: stylistic$1 = StylisticConfigDefaults } = options;
	const { indent, jsx: jsx$1, lessOpinionated, quotes, semi } = typeof stylistic$1 === "boolean" ? StylisticConfigDefaults : {
		...StylisticConfigDefaults,
		...stylistic$1
	};
	const pluginStylistic = await interopDefault(import("@stylistic/eslint-plugin"));
	const config = pluginStylistic.configs.customize({
		indent,
		jsx: jsx$1,
		pluginName: "style",
		quotes,
		semi
	});
	return [{
		name: "eslint/stylistic/rules",
		plugins: {
			antfu: pluginAntfu,
			style: pluginStylistic
		},
		rules: {
			...config.rules,
			"antfu/consistent-chaining": "error",
			"antfu/consistent-list-newline": "off",
			...lessOpinionated ? { curly: ["error", "all"] } : {
				"antfu/curly": "error",
				"antfu/if-newline": "error",
				"antfu/top-level-function": "error"
			},
			"style/brace-style": ["error", "stroustrup"],
			"style/generator-star-spacing": ["error", {
				after: true,
				before: false
			}],
			"style/multiline-ternary": ["error", "never"],
			"style/yield-star-spacing": ["error", {
				after: true,
				before: false
			}],
			...overrides
		}
	}];
}

//#endregion
//#region src/configs/formatters.ts
function mergePrettierOptions(options, overrides = {}) {
	return {
		...options,
		...overrides,
		plugins: [...overrides.plugins || [], ...options.plugins || []]
	};
}
async function formatters(options = {}, stylistic$1 = {}) {
	const defaultIndent = 4;
	const isPrettierPluginXmlInScope = isPackageInScope("@prettier/plugin-xml");
	if (options === true) {
		const isPrettierPluginXmlInScope$1 = isPackageInScope("@prettier/plugin-xml");
		options = {
			css: false,
			graphql: true,
			html: true,
			markdown: true,
			svg: isPrettierPluginXmlInScope$1,
			xml: isPrettierPluginXmlInScope$1
		};
	} else options = {
		css: options.css ?? false,
		graphql: options.graphql ?? true,
		html: options.html ?? true,
		markdown: options.markdown ?? true,
		svg: isPrettierPluginXmlInScope,
		xml: isPrettierPluginXmlInScope
	};
	await ensurePackages(["eslint-plugin-format", options.xml || options.svg ? "@prettier/plugin-xml" : void 0]);
	const { indent, quotes, semi } = {
		...StylisticConfigDefaults,
		...stylistic$1
	};
	const prettierOptions = Object.assign({
		endOfLine: "lf",
		printWidth: 200,
		semi,
		singleQuote: quotes === "single",
		tabWidth: typeof indent === "number" ? indent : defaultIndent,
		trailingComma: "all",
		useTabs: indent === "tab"
	}, options.prettierOptions || {});
	const prettierXmlOptions = {
		xmlQuoteAttributes: "double",
		xmlSelfClosingSpace: true,
		xmlSortAttributesByKey: false,
		xmlWhitespaceSensitivity: "ignore"
	};
	const dprintOptions = Object.assign({
		indentWidth: typeof indent === "number" ? indent : defaultIndent,
		quoteStyle: quotes === "single" ? "preferSingle" : "preferDouble",
		useTabs: indent === "tab"
	}, options.dprintOptions || {});
	const pluginFormat = await interopDefault(import("eslint-plugin-format"));
	const configs$1 = [{
		name: "eslint/formatter/setup",
		plugins: { format: pluginFormat }
	}];
	if (options.css) configs$1.push({
		files: [GLOB_CSS, GLOB_POSTCSS],
		languageOptions: { parser: parserPlain },
		name: "eslint/formatter/css",
		rules: { "format/prettier": ["error", mergePrettierOptions(prettierOptions, { parser: "css" })] }
	}, {
		files: [GLOB_SCSS],
		languageOptions: { parser: parserPlain },
		name: "eslint/formatter/scss",
		rules: { "format/prettier": ["error", mergePrettierOptions(prettierOptions, { parser: "scss" })] }
	}, {
		files: [GLOB_LESS],
		languageOptions: { parser: parserPlain },
		name: "eslint/formatter/less",
		rules: { "format/prettier": ["error", mergePrettierOptions(prettierOptions, { parser: "less" })] }
	});
	if (options.html) configs$1.push({
		files: [GLOB_HTML],
		languageOptions: { parser: parserPlain },
		name: "eslint/formatter/html",
		rules: { "format/prettier": ["error", mergePrettierOptions(prettierOptions, { parser: "html" })] }
	});
	if (options.xml) configs$1.push({
		files: [GLOB_XML],
		languageOptions: { parser: parserPlain },
		name: "eslint/formatter/xml",
		rules: { "format/prettier": ["error", mergePrettierOptions({
			...prettierXmlOptions,
			...prettierOptions
		}, {
			parser: "xml",
			plugins: ["@prettier/plugin-xml"]
		})] }
	});
	if (options.svg) configs$1.push({
		files: [GLOB_SVG],
		languageOptions: { parser: parserPlain },
		name: "eslint/formatter/svg",
		rules: { "format/prettier": ["error", mergePrettierOptions({
			...prettierXmlOptions,
			...prettierOptions
		}, {
			parser: "xml",
			plugins: ["@prettier/plugin-xml"]
		})] }
	});
	if (options.markdown) {
		const formater = options.markdown === true ? "prettier" : options.markdown;
		configs$1.push({
			files: [GLOB_MARKDOWN],
			ignores: [],
			languageOptions: { parser: parserPlain },
			name: "eslint/formatter/markdown",
			rules: { [`format/${formater}`]: ["error", formater === "prettier" ? mergePrettierOptions(prettierOptions, {
				embeddedLanguageFormatting: "off",
				parser: "markdown"
			}) : {
				...dprintOptions,
				language: "markdown"
			}] }
		});
	}
	if (options.graphql) configs$1.push({
		files: [GLOB_GRAPHQL],
		languageOptions: { parser: parserPlain },
		name: "eslint/formatter/graphql",
		rules: { "format/prettier": ["error", mergePrettierOptions(prettierOptions, { parser: "graphql" })] }
	});
	return configs$1;
}

//#endregion
//#region src/configs/ignores.ts
async function ignores(options = {}) {
	const { ignores: ignores$1 = [] } = options;
	return [{
		ignores: [...GLOB_EXCLUDE, ...ignores$1],
		name: "eslint/ignores"
	}];
}

//#endregion
//#region src/configs/imports.ts
async function imports(options = {}) {
	const { overrides = {}, stylistic: stylistic$1 = true } = options;
	return [{
		name: "eslint/imports/rules",
		plugins: {
			antfu: pluginAntfu,
			import: pluginImportLite
		},
		rules: {
			"antfu/import-dedupe": "error",
			"antfu/no-import-dist": "error",
			"antfu/no-import-node-modules-by-path": "error",
			"import/consistent-type-specifier-style": ["error", "prefer-top-level"],
			"import/first": "error",
			"import/no-duplicates": "error",
			"import/no-mutable-exports": "error",
			"import/no-named-default": "error",
			...stylistic$1 ? { "import/newline-after-import": ["error", { count: 1 }] } : {},
			...overrides
		}
	}];
}

//#endregion
//#region src/configs/javascript.ts
async function javascript(options = {}) {
	const { isInEditor = false, overrides = {} } = options;
	return [{
		languageOptions: {
			ecmaVersion: 2022,
			globals: {
				...globals.browser,
				...globals.es2021,
				...globals.node,
				document: "readonly",
				navigator: "readonly",
				window: "readonly"
			},
			parserOptions: {
				ecmaFeatures: { jsx: true },
				ecmaVersion: 2022,
				sourceType: "module"
			},
			sourceType: "module"
		},
		linterOptions: { reportUnusedDisableDirectives: true },
		name: "eslint/javascript/setup"
	}, {
		name: "eslint/javascript/rules",
		plugins: {
			"antfu": pluginAntfu,
			"unused-imports": pluginUnusedImports
		},
		rules: {
			"accessor-pairs": ["error", {
				enforceForClassMembers: true,
				setWithoutGet: true
			}],
			"antfu/no-top-level-await": "error",
			"array-callback-return": "error",
			"block-scoped-var": "error",
			"constructor-super": "error",
			"default-case-last": "error",
			"dot-notation": ["error", { allowKeywords: true }],
			"eqeqeq": ["error", "smart"],
			"new-cap": ["error", {
				capIsNew: false,
				newIsCap: true,
				properties: true
			}],
			"no-alert": "error",
			"no-array-constructor": "error",
			"no-async-promise-executor": "error",
			"no-caller": "error",
			"no-case-declarations": "error",
			"no-class-assign": "error",
			"no-compare-neg-zero": "error",
			"no-cond-assign": ["error", "always"],
			"no-console": "off",
			"no-const-assign": "error",
			"no-control-regex": "error",
			"no-debugger": "error",
			"no-delete-var": "error",
			"no-dupe-args": "error",
			"no-dupe-class-members": "error",
			"no-dupe-keys": "error",
			"no-duplicate-case": "error",
			"no-empty": ["error", { allowEmptyCatch: true }],
			"no-empty-character-class": "error",
			"no-empty-pattern": "error",
			"no-eval": "error",
			"no-ex-assign": "error",
			"no-extend-native": "error",
			"no-extra-bind": "error",
			"no-extra-boolean-cast": "error",
			"no-fallthrough": "error",
			"no-func-assign": "error",
			"no-global-assign": "error",
			"no-implied-eval": "error",
			"no-import-assign": "error",
			"no-invalid-regexp": "error",
			"no-irregular-whitespace": "error",
			"no-iterator": "error",
			"no-labels": ["error", {
				allowLoop: false,
				allowSwitch: false
			}],
			"no-lone-blocks": "error",
			"no-loss-of-precision": "error",
			"no-misleading-character-class": "error",
			"no-multi-str": "error",
			"no-new": "error",
			"no-new-func": "error",
			"no-new-native-nonconstructor": "error",
			"no-new-wrappers": "error",
			"no-obj-calls": "error",
			"no-octal": "error",
			"no-octal-escape": "error",
			"no-proto": "error",
			"no-prototype-builtins": "error",
			"no-redeclare": ["error", { builtinGlobals: false }],
			"no-regex-spaces": "error",
			"no-restricted-globals": [
				"error",
				{
					message: "Use `globalThis` instead.",
					name: "global"
				},
				{
					message: "Use `globalThis` instead.",
					name: "self"
				}
			],
			"no-restricted-properties": [
				"error",
				{
					message: "Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.",
					property: "__proto__"
				},
				{
					message: "Use `Object.defineProperty` instead.",
					property: "__defineGetter__"
				},
				{
					message: "Use `Object.defineProperty` instead.",
					property: "__defineSetter__"
				},
				{
					message: "Use `Object.getOwnPropertyDescriptor` instead.",
					property: "__lookupGetter__"
				},
				{
					message: "Use `Object.getOwnPropertyDescriptor` instead.",
					property: "__lookupSetter__"
				}
			],
			"no-restricted-syntax": [
				"error",
				"TSEnumDeclaration[const=true]",
				"TSExportAssignment"
			],
			"no-self-assign": ["error", { props: true }],
			"no-self-compare": "error",
			"no-sequences": "error",
			"no-shadow-restricted-names": "error",
			"no-sparse-arrays": "error",
			"no-template-curly-in-string": "error",
			"no-this-before-super": "error",
			"no-throw-literal": "error",
			"no-undef": "error",
			"no-undef-init": "error",
			"no-unexpected-multiline": "error",
			"no-unmodified-loop-condition": "error",
			"no-unneeded-ternary": ["error", { defaultAssignment: false }],
			"no-unreachable": "error",
			"no-unreachable-loop": "error",
			"no-unsafe-finally": "error",
			"no-unsafe-negation": "error",
			"no-unused-expressions": ["error", {
				allowShortCircuit: true,
				allowTaggedTemplates: true,
				allowTernary: true
			}],
			"no-unused-vars": ["warn", {
				args: "none",
				caughtErrors: "none",
				ignoreRestSiblings: true,
				vars: "all"
			}],
			"no-use-before-define": ["error", {
				classes: false,
				functions: false,
				variables: true
			}],
			"no-useless-backreference": "error",
			"no-useless-call": "error",
			"no-useless-catch": "error",
			"no-useless-computed-key": "error",
			"no-useless-constructor": "error",
			"no-useless-rename": "error",
			"no-useless-return": "error",
			"no-var": "error",
			"no-with": "error",
			"object-shorthand": [
				"error",
				"always",
				{
					avoidQuotes: true,
					ignoreConstructors: false
				}
			],
			"one-var": ["error", { initialized: "never" }],
			"prefer-arrow-callback": ["error", {
				allowNamedFunctions: false,
				allowUnboundThis: true
			}],
			"prefer-const": [isInEditor ? "warn" : "error", {
				destructuring: "all",
				ignoreReadBeforeAssign: true
			}],
			"prefer-exponentiation-operator": "error",
			"prefer-promise-reject-errors": "error",
			"prefer-regex-literals": ["error", { disallowRedundantWrapping: true }],
			"prefer-rest-params": "error",
			"prefer-spread": "error",
			"prefer-template": "error",
			"symbol-description": "error",
			"unicode-bom": ["error", "never"],
			"unused-imports/no-unused-imports": isInEditor ? "warn" : "error",
			"unused-imports/no-unused-vars": ["error", {
				args: "after-used",
				argsIgnorePattern: "^_",
				ignoreRestSiblings: true,
				vars: "all",
				varsIgnorePattern: "^_"
			}],
			"use-isnan": ["error", {
				enforceForIndexOf: true,
				enforceForSwitchCase: true
			}],
			"valid-typeof": ["error", { requireStringLiterals: true }],
			"vars-on-top": "error",
			"yoda": ["error", "never"],
			...overrides
		}
	}];
}

//#endregion
//#region src/configs/jsdoc.ts
async function jsdoc(options = {}) {
	const { overrides = {}, stylistic: stylistic$1 = true } = options;
	return [{
		name: "eslint/jsdoc/rules",
		plugins: { jsdoc: await interopDefault(import("eslint-plugin-jsdoc")) },
		rules: {
			"jsdoc/check-access": "warn",
			"jsdoc/check-param-names": "warn",
			"jsdoc/check-property-names": "warn",
			"jsdoc/check-types": "warn",
			"jsdoc/empty-tags": "warn",
			"jsdoc/implements-on-classes": "warn",
			"jsdoc/no-defaults": "warn",
			"jsdoc/no-multi-asterisks": "warn",
			"jsdoc/require-param-name": "warn",
			"jsdoc/require-property": "warn",
			"jsdoc/require-property-description": "warn",
			"jsdoc/require-property-name": "warn",
			"jsdoc/require-returns-check": "warn",
			"jsdoc/require-returns-description": "warn",
			"jsdoc/require-yields-check": "warn",
			...stylistic$1 ? {
				"jsdoc/check-alignment": "warn",
				"jsdoc/multiline-blocks": "warn"
			} : {},
			...overrides
		}
	}];
}

//#endregion
//#region src/configs/jsonc.ts
async function jsonc(options = {}) {
	const { files = [
		GLOB_JSON,
		GLOB_JSON5,
		GLOB_JSONC
	], overrides = {}, stylistic: stylistic$1 = true } = options;
	const [pluginJsonc, parserJsonc] = await Promise.all([interopDefault(import("eslint-plugin-jsonc")), interopDefault(import("jsonc-eslint-parser"))]);
	return [{
		name: "eslint/jsonc/setup",
		plugins: { jsonc: pluginJsonc }
	}, {
		files,
		languageOptions: { parser: parserJsonc },
		name: "eslint/jsonc/rules",
		rules: {
			"jsonc/no-bigint-literals": "error",
			"jsonc/no-binary-expression": "error",
			"jsonc/no-binary-numeric-literals": "error",
			"jsonc/no-dupe-keys": "error",
			"jsonc/no-escape-sequence-in-identifier": "error",
			"jsonc/no-floating-decimal": "error",
			"jsonc/no-hexadecimal-numeric-literals": "error",
			"jsonc/no-infinity": "error",
			"jsonc/no-multi-str": "error",
			"jsonc/no-nan": "error",
			"jsonc/no-number-props": "error",
			"jsonc/no-numeric-separators": "error",
			"jsonc/no-octal": "error",
			"jsonc/no-octal-escape": "error",
			"jsonc/no-octal-numeric-literals": "error",
			"jsonc/no-parenthesized": "error",
			"jsonc/no-plus-sign": "error",
			"jsonc/no-regexp-literals": "error",
			"jsonc/no-sparse-arrays": "error",
			"jsonc/no-template-literals": "error",
			"jsonc/no-undefined-value": "error",
			"jsonc/no-unicode-codepoint-escapes": "error",
			"jsonc/no-useless-escape": "error",
			"jsonc/space-unary-ops": "error",
			"jsonc/valid-json-number": "error",
			"jsonc/vue-custom-block/no-parsing-error": "error",
			...stylistic$1 ? {
				"jsonc/array-bracket-spacing": ["error", "never"],
				"jsonc/comma-dangle": ["error", "never"],
				"jsonc/comma-style": ["error", "last"],
				"jsonc/indent": ["error", 2],
				"jsonc/key-spacing": ["error", {
					afterColon: true,
					beforeColon: false
				}],
				"jsonc/object-curly-newline": ["error", {
					consistent: true,
					multiline: true
				}],
				"jsonc/object-curly-spacing": ["error", "always"],
				"jsonc/object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
				"jsonc/quote-props": "error",
				"jsonc/quotes": "error"
			} : {},
			...overrides
		}
	}];
}

//#endregion
//#region src/configs/jsx.ts
async function jsx() {
	return [{
		files: [GLOB_JSX, GLOB_TSX],
		languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		name: "eslint/jsx/setup"
	}];
}

//#endregion
//#region src/configs/markdown.ts
async function markdown(options = {}) {
	const { componentExts = [], files = [GLOB_MARKDOWN], overrides = {} } = options;
	const markdown$1 = await interopDefault(import("@eslint/markdown"));
	return [
		{
			name: "eslint/markdown/setup",
			plugins: { markdown: markdown$1 }
		},
		{
			files,
			ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
			name: "eslint/markdown/processor",
			processor: mergeProcessors([markdown$1.processors.markdown, processorPassThrough])
		},
		{
			files,
			languageOptions: { parser: parserPlain$1 },
			name: "eslint/markdown/parser"
		},
		{
			files: [GLOB_MARKDOWN_CODE, ...componentExts.map((ext) => `${GLOB_MARKDOWN}/**/*.${ext}`)],
			languageOptions: { parserOptions: { ecmaFeatures: { impliedStrict: true } } },
			name: "eslint/markdown/disables",
			rules: {
				"antfu/no-top-level-await": "off",
				"import/newline-after-import": "off",
				"no-alert": "off",
				"no-console": "off",
				"no-labels": "off",
				"no-lone-blocks": "off",
				"no-restricted-syntax": "off",
				"no-undef": "off",
				"no-unused-expressions": "off",
				"no-unused-labels": "off",
				"no-unused-vars": "off",
				"node/prefer-global/process": "off",
				"style/comma-dangle": "off",
				"style/eol-last": "off",
				"ts/consistent-type-imports": "off",
				"ts/explicit-function-return-type": "off",
				"ts/no-namespace": "off",
				"ts/no-redeclare": "off",
				"ts/no-require-imports": "off",
				"ts/no-unused-expressions": "off",
				"ts/no-unused-vars": "off",
				"ts/no-use-before-define": "off",
				"unicode-bom": "off",
				"unused-imports/no-unused-imports": "off",
				"unused-imports/no-unused-vars": "off",
				"ts/await-thenable": "off",
				"ts/dot-notation": "off",
				"ts/no-floating-promises": "off",
				"ts/no-for-in-array": "off",
				"ts/no-implied-eval": "off",
				"ts/no-misused-promises": "off",
				"ts/no-unnecessary-type-assertion": "off",
				"ts/no-unsafe-argument": "off",
				"ts/no-unsafe-assignment": "off",
				"ts/no-unsafe-call": "off",
				"ts/no-unsafe-member-access": "off",
				"ts/no-unsafe-return": "off",
				"ts/restrict-plus-operands": "off",
				"ts/restrict-template-expressions": "off",
				"ts/unbound-method": "off",
				...overrides
			}
		}
	];
}

//#endregion
//#region src/configs/node.ts
async function node(options = {}) {
	const { overrides = {} } = options;
	return [{
		name: "eslint/node/rules",
		plugins: { node: pluginNode },
		rules: {
			"node/handle-callback-err": ["error", "^(err|error)$"],
			"node/no-deprecated-api": "error",
			"node/no-exports-assign": "error",
			"node/no-new-require": "error",
			"node/no-path-concat": "error",
			"node/prefer-global/buffer": ["error", "never"],
			"node/prefer-global/process": ["error", "never"],
			"node/process-exit-as-throw": "error",
			...overrides
		}
	}];
}

//#endregion
//#region src/configs/perfectionist.ts
/**
* Optional perfectionist plugin for props and items sorting.
*
* @see https://github.com/azat-io/eslint-plugin-perfectionist
*/
async function perfectionist(options = {}) {
	const { overrides = {} } = options;
	return [{
		name: "eslint/perfectionist/setup",
		plugins: { perfectionist: pluginPerfectionist },
		rules: {
			"perfectionist/sort-exports": ["error", {
				order: "asc",
				type: "natural"
			}],
			"perfectionist/sort-imports": ["error", {
				groups: [
					"type",
					"builtin-type",
					[
						"index-type",
						"parent-type",
						"sibling-type",
						"internal-type"
					],
					"builtin",
					"external",
					"internal",
					[
						"index",
						"parent",
						"sibling"
					],
					"side-effect",
					"object",
					"unknown"
				],
				internalPattern: ["^~/.*", "^@/.*"],
				newlinesBetween: "ignore",
				order: "asc",
				type: "natural"
			}],
			"perfectionist/sort-named-exports": ["error", {
				order: "asc",
				type: "natural"
			}],
			"perfectionist/sort-named-imports": ["error", {
				order: "asc",
				type: "natural"
			}],
			...overrides
		}
	}];
}

//#endregion
//#region src/configs/pnpm.ts
async function pnpm() {
	const [pluginPnpm, yamlParser, jsoncParser] = await Promise.all([
		interopDefault(import("eslint-plugin-pnpm")),
		interopDefault(import("yaml-eslint-parser")),
		interopDefault(import("jsonc-eslint-parser"))
	]);
	return [{
		files: ["package.json", "**/package.json"],
		languageOptions: { parser: jsoncParser },
		name: "eslint/pnpm/package-json",
		plugins: { pnpm: pluginPnpm },
		rules: {
			"pnpm/json-enforce-catalog": "error",
			"pnpm/json-prefer-workspace-settings": "error",
			"pnpm/json-valid-catalog": "error"
		}
	}, {
		files: ["pnpm-workspace.yaml"],
		languageOptions: { parser: yamlParser },
		name: "eslint/pnpm/pnpm-workspace-yaml",
		plugins: { pnpm: pluginPnpm },
		rules: {
			"pnpm/yaml-no-duplicate-catalog-item": "error",
			"pnpm/yaml-no-unused-catalog-item": "error"
		}
	}];
}

//#endregion
//#region src/configs/react.ts
const ReactRefreshAllowConstantExportPackages = ["vite"];
const RemixPackages = [
	"@remix-run/node",
	"@remix-run/react",
	"@remix-run/serve",
	"@remix-run/dev"
];
const ReactRouterPackages = [
	"@react-router/node",
	"@react-router/react",
	"@react-router/serve",
	"@react-router/dev"
];
const NextJsPackages = ["next"];
async function react(options = {}) {
	const { files = [GLOB_SRC], filesTypeAware = [GLOB_TS, GLOB_TSX], ignoresTypeAware = [`${GLOB_MARKDOWN}/**`], overrides = {}, tsconfigPath } = options;
	await ensurePackages([
		"@eslint-react/eslint-plugin",
		"eslint-plugin-react-hooks",
		"eslint-plugin-react-refresh"
	]);
	const isTypeAware = !!tsconfigPath;
	const typeAwareRules = { "react/no-leaked-conditional-rendering": "warn" };
	const [pluginReact, pluginReactHooks, pluginReactRefresh] = await Promise.all([
		interopDefault(import("@eslint-react/eslint-plugin")),
		interopDefault(import("eslint-plugin-react-hooks")),
		interopDefault(import("eslint-plugin-react-refresh"))
	]);
	const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some((i) => isPackageExists(i));
	const isUsingRemix = RemixPackages.some((i) => isPackageExists(i));
	const isUsingReactRouter = ReactRouterPackages.some((i) => isPackageExists(i));
	const isUsingNext = NextJsPackages.some((i) => isPackageExists(i));
	const plugins = pluginReact.configs.all.plugins;
	return [
		{
			name: "eslint/react/setup",
			plugins: {
				"react": plugins["@eslint-react"],
				"react-dom": plugins["@eslint-react/dom"],
				"react-hooks": pluginReactHooks,
				"react-hooks-extra": plugins["@eslint-react/hooks-extra"],
				"react-naming-convention": plugins["@eslint-react/naming-convention"],
				"react-refresh": pluginReactRefresh,
				"react-web-api": plugins["@eslint-react/web-api"]
			}
		},
		{
			files,
			languageOptions: {
				parserOptions: { ecmaFeatures: { jsx: true } },
				sourceType: "module"
			},
			name: "eslint/react/rules",
			rules: {
				"react-dom/no-dangerously-set-innerhtml": "warn",
				"react-dom/no-dangerously-set-innerhtml-with-children": "error",
				"react-dom/no-find-dom-node": "error",
				"react-dom/no-flush-sync": "error",
				"react-dom/no-hydrate": "error",
				"react-dom/no-missing-button-type": "warn",
				"react-dom/no-missing-iframe-sandbox": "warn",
				"react-dom/no-namespace": "error",
				"react-dom/no-render": "error",
				"react-dom/no-render-return-value": "error",
				"react-dom/no-script-url": "warn",
				"react-dom/no-unsafe-iframe-sandbox": "warn",
				"react-dom/no-unsafe-target-blank": "warn",
				"react-dom/no-use-form-state": "error",
				"react-dom/no-void-elements-with-children": "error",
				"react-hooks-extra/no-direct-set-state-in-use-effect": "warn",
				"react-hooks-extra/no-unnecessary-use-prefix": "warn",
				"react-hooks-extra/prefer-use-state-lazy-initialization": "warn",
				"react-hooks/exhaustive-deps": "warn",
				"react-hooks/rules-of-hooks": "error",
				"react-refresh/only-export-components": ["warn", {
					allowConstantExport: isAllowConstantExport,
					allowExportNames: [...isUsingNext ? [
						"dynamic",
						"dynamicParams",
						"revalidate",
						"fetchCache",
						"runtime",
						"preferredRegion",
						"maxDuration",
						"config",
						"generateStaticParams",
						"metadata",
						"generateMetadata",
						"viewport",
						"generateViewport"
					] : [], ...isUsingRemix || isUsingReactRouter ? [
						"meta",
						"links",
						"headers",
						"loader",
						"action"
					] : []]
				}],
				"react-web-api/no-leaked-event-listener": "warn",
				"react-web-api/no-leaked-interval": "warn",
				"react-web-api/no-leaked-resize-observer": "warn",
				"react-web-api/no-leaked-timeout": "warn",
				"react/jsx-no-duplicate-props": "warn",
				"react/jsx-uses-vars": "warn",
				"react/no-access-state-in-setstate": "error",
				"react/no-array-index-key": "warn",
				"react/no-children-count": "warn",
				"react/no-children-for-each": "warn",
				"react/no-children-map": "warn",
				"react/no-children-only": "warn",
				"react/no-children-to-array": "warn",
				"react/no-clone-element": "warn",
				"react/no-comment-textnodes": "warn",
				"react/no-component-will-mount": "error",
				"react/no-component-will-receive-props": "error",
				"react/no-component-will-update": "error",
				"react/no-context-provider": "warn",
				"react/no-create-ref": "error",
				"react/no-default-props": "error",
				"react/no-direct-mutation-state": "error",
				"react/no-duplicate-jsx-props": "warn",
				"react/no-duplicate-key": "warn",
				"react/no-forward-ref": "warn",
				"react/no-implicit-key": "warn",
				"react/no-missing-key": "error",
				"react/no-nested-component-definitions": "error",
				"react/no-prop-types": "error",
				"react/no-redundant-should-component-update": "error",
				"react/no-set-state-in-component-did-mount": "warn",
				"react/no-set-state-in-component-did-update": "warn",
				"react/no-set-state-in-component-will-update": "warn",
				"react/no-string-refs": "error",
				"react/no-unsafe-component-will-mount": "warn",
				"react/no-unsafe-component-will-receive-props": "warn",
				"react/no-unsafe-component-will-update": "warn",
				"react/no-unstable-context-value": "warn",
				"react/no-unstable-default-props": "warn",
				"react/no-unused-class-component-members": "warn",
				"react/no-unused-state": "warn",
				"react/no-use-context": "warn",
				"react/no-useless-forward-ref": "warn",
				"react/use-jsx-vars": "warn",
				...overrides
			}
		},
		...isTypeAware ? [{
			files: filesTypeAware,
			ignores: ignoresTypeAware,
			name: "eslint/react/type-aware-rules",
			rules: { ...typeAwareRules }
		}] : []
	];
}

//#endregion
//#region src/configs/regexp.ts
async function regexp(options = {}) {
	const config = configs["flat/recommended"];
	const rules = { ...config.rules };
	if (options.level === "warn") {
		for (const key in rules) if (rules[key] === "error") rules[key] = "warn";
	}
	return [{
		...config,
		name: "eslint/regexp/rules",
		rules: {
			...rules,
			...options.overrides
		}
	}];
}

//#endregion
//#region src/configs/sort.ts
/**
* Sort package.json
*
* Requires `jsonc` config
*/
async function sortPackageJson() {
	return [{
		files: ["**/package.json"],
		name: "eslint/sort/package-json",
		rules: {
			"jsonc/sort-array-values": ["error", {
				order: { type: "asc" },
				pathPattern: "^files$"
			}],
			"jsonc/sort-keys": [
				"error",
				{
					order: [
						"publisher",
						"name",
						"displayName",
						"type",
						"version",
						"private",
						"packageManager",
						"description",
						"contributors",
						"author",
						"license",
						"funding",
						"homepage",
						"repository",
						"bugs",
						"keywords",
						"categories",
						"sideEffects",
						"imports",
						"exports",
						"main",
						"module",
						"unpkg",
						"jsdelivr",
						"types",
						"typesVersions",
						"bin",
						"icon",
						"files",
						"engines",
						"activationEvents",
						"contributes",
						"scripts",
						"peerDependencies",
						"peerDependenciesMeta",
						"dependencies",
						"optionalDependencies",
						"devDependencies",
						"pnpm",
						"overrides",
						"resolutions",
						"husky",
						"simple-git-hooks",
						"lint-staged",
						"eslintConfig"
					],
					pathPattern: "^$"
				},
				{
					order: { type: "asc" },
					pathPattern: "^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$"
				},
				{
					order: { type: "asc" },
					pathPattern: "^(?:resolutions|overrides|pnpm.overrides)$"
				},
				{
					order: [
						"types",
						"import",
						"require",
						"default"
					],
					pathPattern: "^exports.*$"
				},
				{
					order: [
						"pre-commit",
						"prepare-commit-msg",
						"commit-msg",
						"post-commit",
						"pre-rebase",
						"post-rewrite",
						"post-checkout",
						"post-merge",
						"pre-push",
						"pre-auto-gc"
					],
					pathPattern: "^(?:gitHooks|husky|simple-git-hooks)$"
				}
			]
		}
	}];
}
/**
* Sort tsconfig.json
*
* Requires `jsonc` config
*/
function sortTsconfig() {
	return [{
		files: ["**/tsconfig.json", "**/tsconfig.*.json"],
		name: "eslint/sort/tsconfig",
		rules: { "jsonc/sort-keys": [
			"error",
			{
				order: [
					"extends",
					"compilerOptions",
					"references",
					"files",
					"include",
					"exclude"
				],
				pathPattern: "^$"
			},
			{
				order: [
					"incremental",
					"composite",
					"tsBuildInfoFile",
					"disableSourceOfProjectReferenceRedirect",
					"disableSolutionSearching",
					"disableReferencedProjectLoad",
					"target",
					"jsx",
					"jsxFactory",
					"jsxFragmentFactory",
					"jsxImportSource",
					"lib",
					"moduleDetection",
					"noLib",
					"reactNamespace",
					"useDefineForClassFields",
					"emitDecoratorMetadata",
					"experimentalDecorators",
					"libReplacement",
					"baseUrl",
					"rootDir",
					"rootDirs",
					"customConditions",
					"module",
					"moduleResolution",
					"moduleSuffixes",
					"noResolve",
					"paths",
					"resolveJsonModule",
					"resolvePackageJsonExports",
					"resolvePackageJsonImports",
					"typeRoots",
					"types",
					"allowArbitraryExtensions",
					"allowImportingTsExtensions",
					"allowUmdGlobalAccess",
					"allowJs",
					"checkJs",
					"maxNodeModuleJsDepth",
					"strict",
					"strictBindCallApply",
					"strictFunctionTypes",
					"strictNullChecks",
					"strictPropertyInitialization",
					"allowUnreachableCode",
					"allowUnusedLabels",
					"alwaysStrict",
					"exactOptionalPropertyTypes",
					"noFallthroughCasesInSwitch",
					"noImplicitAny",
					"noImplicitOverride",
					"noImplicitReturns",
					"noImplicitThis",
					"noPropertyAccessFromIndexSignature",
					"noUncheckedIndexedAccess",
					"noUnusedLocals",
					"noUnusedParameters",
					"useUnknownInCatchVariables",
					"declaration",
					"declarationDir",
					"declarationMap",
					"downlevelIteration",
					"emitBOM",
					"emitDeclarationOnly",
					"importHelpers",
					"importsNotUsedAsValues",
					"inlineSourceMap",
					"inlineSources",
					"mapRoot",
					"newLine",
					"noEmit",
					"noEmitHelpers",
					"noEmitOnError",
					"outDir",
					"outFile",
					"preserveConstEnums",
					"preserveValueImports",
					"removeComments",
					"sourceMap",
					"sourceRoot",
					"stripInternal",
					"allowSyntheticDefaultImports",
					"esModuleInterop",
					"forceConsistentCasingInFileNames",
					"isolatedModules",
					"preserveSymlinks",
					"verbatimModuleSyntax",
					"erasableSyntaxOnly",
					"skipDefaultLibCheck",
					"skipLibCheck"
				],
				pathPattern: "^compilerOptions$"
			}
		] }
	}];
}

//#endregion
//#region src/configs/test.ts
async function test(options = {}) {
	const { files = GLOB_TESTS, isInEditor = false, overrides = {} } = options;
	const [pluginVitest, pluginNoOnlyTests] = await Promise.all([interopDefault(import("@vitest/eslint-plugin")), interopDefault(import("eslint-plugin-no-only-tests"))]);
	return [{
		name: "eslint/test/setup",
		plugins: { test: {
			...pluginVitest,
			rules: {
				...pluginVitest.rules,
				...pluginNoOnlyTests.rules
			}
		} }
	}, {
		files,
		name: "eslint/test/rules",
		rules: {
			"test/consistent-test-it": ["error", {
				fn: "it",
				withinDescribe: "it"
			}],
			"test/no-identical-title": "error",
			"test/no-import-node-test": "error",
			"test/no-only-tests": isInEditor ? "warn" : "error",
			"test/prefer-hooks-in-order": "error",
			"test/prefer-lowercase-title": "error",
			"antfu/no-top-level-await": "off",
			"no-unused-expressions": "off",
			"node/prefer-global/process": "off",
			"ts/explicit-function-return-type": "off",
			...overrides
		}
	}];
}

//#endregion
//#region src/configs/toml.ts
async function toml(options = {}) {
	const { files = [GLOB_TOML], overrides = {}, stylistic: stylistic$1 = true } = options;
	const { indent = 4 } = typeof stylistic$1 === "boolean" ? {} : stylistic$1;
	const [pluginToml, parserToml] = await Promise.all([interopDefault(import("eslint-plugin-toml")), interopDefault(import("toml-eslint-parser"))]);
	return [{
		name: "eslint/toml/setup",
		plugins: { toml: pluginToml }
	}, {
		files,
		languageOptions: { parser: parserToml },
		name: "eslint/toml/rules",
		rules: {
			"style/spaced-comment": "off",
			"toml/comma-style": "error",
			"toml/keys-order": "error",
			"toml/no-space-dots": "error",
			"toml/no-unreadable-number-separator": "error",
			"toml/precision-of-fractional-seconds": "error",
			"toml/precision-of-integer": "error",
			"toml/tables-order": "error",
			"toml/vue-custom-block/no-parsing-error": "error",
			...stylistic$1 ? {
				"toml/array-bracket-newline": "error",
				"toml/array-bracket-spacing": "error",
				"toml/array-element-newline": "error",
				"toml/indent": ["error", indent === "tab" ? 4 : indent],
				"toml/inline-table-curly-spacing": "error",
				"toml/key-spacing": "error",
				"toml/padding-line-between-pairs": "error",
				"toml/padding-line-between-tables": "error",
				"toml/quoted-keys": "error",
				"toml/spaced-comment": "error",
				"toml/table-bracket-spacing": "error"
			} : {},
			...overrides
		}
	}];
}

//#endregion
//#region src/configs/typescript.ts
async function typescript(options = {}) {
	const { componentExts = [], overrides = {}, parserOptions = {}, type = "app" } = options;
	const files = options.files ?? [GLOB_SRC, ...componentExts.map((ext) => `**/*.${ext}`)];
	const ignoresTypeAware = options.ignoresTypeAware ?? [`${GLOB_MARKDOWN}/**`];
	const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX];
	const tsconfigPath = options?.tsconfigPath ? options.tsconfigPath : void 0;
	const isTypeAware = !!tsconfigPath;
	const typeAwareRules = {
		"dot-notation": "off",
		"no-implied-eval": "off",
		"ts/await-thenable": "error",
		"ts/dot-notation": ["error", { allowKeywords: true }],
		"ts/no-floating-promises": "error",
		"ts/no-for-in-array": "error",
		"ts/no-implied-eval": "error",
		"ts/no-misused-promises": "error",
		"ts/no-unnecessary-type-assertion": "error",
		"ts/no-unsafe-argument": "error",
		"ts/no-unsafe-assignment": "error",
		"ts/no-unsafe-call": "error",
		"ts/no-unsafe-member-access": "error",
		"ts/no-unsafe-return": "error",
		"ts/promise-function-async": "error",
		"ts/restrict-plus-operands": "error",
		"ts/restrict-template-expressions": "error",
		"ts/return-await": ["error", "in-try-catch"],
		"ts/strict-boolean-expressions": ["error", {
			allowNullableBoolean: true,
			allowNullableObject: true
		}],
		"ts/switch-exhaustiveness-check": "error",
		"ts/unbound-method": "error"
	};
	const [pluginTs, parserTs] = await Promise.all([interopDefault(import("@typescript-eslint/eslint-plugin")), interopDefault(import("@typescript-eslint/parser"))]);
	function makeParser(typeAware, files$1, ignores$1) {
		return {
			files: files$1,
			...ignores$1 ? { ignores: ignores$1 } : {},
			languageOptions: {
				parser: parserTs,
				parserOptions: {
					extraFileExtensions: componentExts.map((ext) => `.${ext}`),
					sourceType: "module",
					...typeAware ? {
						projectService: {
							allowDefaultProject: ["./*.js"],
							defaultProject: tsconfigPath
						},
						tsconfigRootDir: process.cwd()
					} : {},
					...parserOptions
				}
			},
			name: `eslint/typescript/${typeAware ? "type-aware-parser" : "parser"}`
		};
	}
	return [
		{
			name: "eslint/typescript/setup",
			plugins: {
				antfu: pluginAntfu,
				ts: pluginTs
			}
		},
		...isTypeAware ? [makeParser(false, files), makeParser(true, filesTypeAware, ignoresTypeAware)] : [makeParser(false, files)],
		{
			files,
			name: "eslint/typescript/rules",
			rules: {
				...renameRules(pluginTs.configs["eslint-recommended"].overrides[0].rules, { "@typescript-eslint": "ts" }),
				...renameRules(pluginTs.configs.strict.rules, { "@typescript-eslint": "ts" }),
				"no-dupe-class-members": "off",
				"no-redeclare": "off",
				"no-unused-expressions": "off",
				"no-use-before-define": "off",
				"no-useless-constructor": "off",
				"ts/ban-ts-comment": ["error", { "ts-ignore": "allow-with-description" }],
				"ts/consistent-type-definitions": ["error", "interface"],
				"ts/consistent-type-imports": ["error", {
					disallowTypeAnnotations: false,
					fixStyle: "separate-type-imports",
					prefer: "type-imports"
				}],
				"ts/method-signature-style": ["error", "property"],
				"ts/no-dupe-class-members": "error",
				"ts/no-dynamic-delete": "off",
				"ts/no-empty-object-type": ["error", { allowInterfaces: "always" }],
				"ts/no-explicit-any": "off",
				"ts/no-extraneous-class": "off",
				"ts/no-import-type-side-effects": "error",
				"ts/no-invalid-void-type": "off",
				"ts/no-non-null-assertion": "off",
				"ts/no-redeclare": ["error", { builtinGlobals: false }],
				"ts/no-require-imports": "error",
				"ts/no-unused-expressions": ["error", {
					allowShortCircuit: true,
					allowTaggedTemplates: true,
					allowTernary: true
				}],
				"ts/no-unused-vars": ["warn", {
					args: "all",
					argsIgnorePattern: "^_",
					caughtErrors: "all",
					caughtErrorsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
					ignoreRestSiblings: true,
					varsIgnorePattern: "^_"
				}],
				"ts/no-use-before-define": ["error", {
					classes: false,
					functions: false,
					variables: true
				}],
				"ts/no-useless-constructor": "off",
				"ts/no-wrapper-object-types": "error",
				"ts/triple-slash-reference": "off",
				"ts/unified-signatures": "off",
				"unused-imports/no-unused-vars": "off",
				...type === "lib" ? { "ts/explicit-function-return-type": ["error", {
					allowExpressions: true,
					allowHigherOrderFunctions: true,
					allowIIFEs: true
				}] } : {},
				...overrides
			}
		},
		...isTypeAware ? [{
			files: filesTypeAware,
			ignores: ignoresTypeAware,
			name: "eslint/typescript/rules-type-aware",
			rules: {
				...typeAwareRules,
				...overrides
			}
		}] : []
	];
}

//#endregion
//#region src/configs/unicorn.ts
async function unicorn(options = {}) {
	return [{
		name: "eslint/unicorn/rules",
		plugins: { unicorn: pluginUnicorn },
		rules: {
			...options.allRecommended ? pluginUnicorn.configs["flat/recommended"].rules : {
				"unicorn/consistent-empty-array-spread": "error",
				"unicorn/error-message": "error",
				"unicorn/escape-case": "error",
				"unicorn/new-for-builtins": "error",
				"unicorn/no-instanceof-array": "error",
				"unicorn/no-new-array": "error",
				"unicorn/no-new-buffer": "error",
				"unicorn/number-literal-case": "error",
				"unicorn/prefer-dom-node-text-content": "error",
				"unicorn/prefer-includes": "error",
				"unicorn/prefer-node-protocol": "error",
				"unicorn/prefer-number-properties": "error",
				"unicorn/prefer-string-starts-ends-with": "error",
				"unicorn/prefer-type-error": "error",
				"unicorn/throw-new-error": "error"
			},
			...options.overrides
		}
	}];
}

//#endregion
//#region src/configs/unocss.ts
async function unocss(options = {}) {
	const { attributify = true, overrides = {}, strict = false } = options;
	await ensurePackages(["@unocss/eslint-plugin"]);
	const [pluginUnoCSS] = await Promise.all([interopDefault(import("@unocss/eslint-plugin"))]);
	return [{
		name: "eslint/unocss/rules",
		plugins: { unocss: pluginUnoCSS },
		rules: {
			"unocss/order": "off",
			...attributify ? { "unocss/order-attributify": "warn" } : {},
			...strict ? { "unocss/blocklist": "error" } : {},
			...overrides
		}
	}];
}

//#endregion
//#region src/configs/vue.ts
const pkg = getPackageInfoSync("vue");
let vueVersion = pkg && pkg.version;
vueVersion = vueVersion && vueVersion[0];
vueVersion = Number.isNaN(vueVersion) ? "3" : vueVersion;
async function vue(options = {}) {
	const { files = [GLOB_VUE], overrides = {}, stylistic: stylistic$1 = true } = options;
	const sfcBlocks = options.sfcBlocks === true ? {} : options.sfcBlocks ?? {};
	const { indent = 4 } = typeof stylistic$1 === "boolean" ? {} : stylistic$1;
	const [pluginVue, parserVue, processorVueBlocks] = await Promise.all([
		interopDefault(import("eslint-plugin-vue")),
		interopDefault(import("vue-eslint-parser")),
		interopDefault(import("eslint-processor-vue-blocks"))
	]);
	return [{
		languageOptions: { globals: {
			computed: "readonly",
			defineEmits: "readonly",
			defineExpose: "readonly",
			defineProps: "readonly",
			onMounted: "readonly",
			onUnmounted: "readonly",
			reactive: "readonly",
			ref: "readonly",
			shallowReactive: "readonly",
			shallowRef: "readonly",
			toRef: "readonly",
			toRefs: "readonly",
			watch: "readonly",
			watchEffect: "readonly"
		} },
		name: "eslint/vue/setup",
		plugins: { vue: pluginVue }
	}, {
		files,
		languageOptions: {
			parser: parserVue,
			parserOptions: {
				ecmaFeatures: { jsx: true },
				extraFileExtensions: [".vue"],
				parser: options.typescript ? await interopDefault(import("@typescript-eslint/parser")) : null,
				sourceType: "module"
			}
		},
		name: "eslint/vue/rules",
		processor: sfcBlocks === false ? pluginVue.processors[".vue"] : mergeProcessors([pluginVue.processors[".vue"], processorVueBlocks({
			...sfcBlocks,
			blocks: {
				styles: true,
				...sfcBlocks.blocks
			}
		})]),
		rules: {
			...pluginVue.configs.base.rules,
			...vueVersion === "2" ? {
				...pluginVue.configs["vue2-essential"].rules,
				...pluginVue.configs["vue2-strongly-recommended"].rules,
				...pluginVue.configs["vue2-recommended"].rules
			} : {
				...pluginVue.configs["flat/essential"].map((c) => c.rules).reduce((acc, c) => ({
					...acc,
					...c
				}), {}),
				...pluginVue.configs["flat/strongly-recommended"].map((c) => c.rules).reduce((acc, c) => ({
					...acc,
					...c
				}), {}),
				...pluginVue.configs["flat/recommended"].map((c) => c.rules).reduce((acc, c) => ({
					...acc,
					...c
				}), {})
			},
			"antfu/no-top-level-await": "off",
			"node/prefer-global/process": "off",
			"ts/explicit-function-return-type": "off",
			"vue/block-order": ["error", { order: [
				"template",
				"script",
				"style"
			] }],
			"vue/component-name-in-template-casing": ["error", "PascalCase"],
			"vue/component-options-name-casing": ["error", "PascalCase"],
			"vue/custom-event-name-casing": vueVersion === "3" ? ["error", "camelCase"] : ["error", "kebab-case"],
			...vueVersion === "2" ? { "vue/require-explicit-emits": "off" } : null,
			"no-irregular-whitespace": "off",
			"vue/define-macros-order": ["error", { order: [
				"defineOptions",
				"defineProps",
				"defineEmits",
				"defineSlots"
			] }],
			"vue/dot-location": ["error", "property"],
			"vue/dot-notation": ["error", { allowKeywords: true }],
			"vue/eqeqeq": ["error", "smart"],
			"vue/html-indent": [
				"error",
				indent,
				{
					alignAttributesVertically: true,
					attribute: 1,
					baseIndent: 1,
					closeBracket: 0,
					ignores: []
				}
			],
			"vue/html-self-closing": ["error", {
				html: {
					component: "any",
					normal: "any",
					void: "never"
				},
				math: "always",
				svg: "always"
			}],
			"vue/max-attributes-per-line": "off",
			"vue/multi-word-component-names": "off",
			"vue/no-constant-condition": "warn",
			"vue/no-dupe-keys": "off",
			"vue/no-empty-pattern": "error",
			"vue/no-extra-parens": ["error", "functions"],
			"vue/no-irregular-whitespace": ["error", {
				skipComments: false,
				skipHTMLAttributeValues: false,
				skipHTMLTextContents: true,
				skipRegExps: false,
				skipStrings: true,
				skipTemplates: false
			}],
			"vue/no-loss-of-precision": "error",
			"vue/no-restricted-syntax": [
				"error",
				"DebuggerStatement",
				"LabeledStatement",
				"WithStatement"
			],
			"vue/no-restricted-v-bind": ["error", "/^v-/"],
			"vue/no-setup-props-reactivity-loss": "off",
			"vue/no-sparse-arrays": "error",
			"vue/no-unused-refs": "warn",
			"vue/no-useless-v-bind": "error",
			"vue/no-v-html": "off",
			"vue/no-v-text-v-html-on-component": "off",
			"vue/object-shorthand": [
				"error",
				"always",
				{
					avoidQuotes: true,
					ignoreConstructors: false
				}
			],
			"vue/prefer-separate-static-class": "error",
			"vue/prefer-template": "error",
			"vue/prop-name-casing": ["error", "camelCase"],
			"vue/require-default-prop": "off",
			"vue/require-prop-types": "off",
			"vue/singleline-html-element-content-newline": "off",
			"vue/space-infix-ops": "error",
			"vue/space-unary-ops": ["error", {
				nonwords: false,
				words: true
			}],
			...stylistic$1 ? {
				"vue/array-bracket-spacing": ["error", "never"],
				"vue/arrow-spacing": ["error", {
					after: true,
					before: true
				}],
				"vue/block-spacing": ["error", "always"],
				"vue/block-tag-newline": ["error", {
					multiline: "always",
					singleline: "always"
				}],
				"vue/brace-style": [
					"error",
					"stroustrup",
					{ allowSingleLine: false }
				],
				"vue/comma-dangle": ["error", "always-multiline"],
				"vue/comma-spacing": ["error", {
					after: true,
					before: false
				}],
				"vue/comma-style": ["error", "last"],
				"vue/html-comment-content-spacing": [
					"error",
					"always",
					{ exceptions: ["-"] }
				],
				"vue/key-spacing": ["error", {
					afterColon: true,
					beforeColon: false
				}],
				"vue/keyword-spacing": ["error", {
					after: true,
					before: true
				}],
				"vue/object-curly-newline": "off",
				"vue/object-curly-spacing": ["error", "always"],
				"vue/object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
				"vue/operator-linebreak": ["error", "before"],
				"vue/padding-line-between-blocks": ["error", "always"],
				"vue/quote-props": ["error", "consistent-as-needed"],
				"vue/space-in-parens": ["error", "never"],
				"vue/template-curly-spacing": "error"
			} : {},
			...overrides
		}
	}];
}

//#endregion
//#region src/configs/yaml.ts
async function yaml(options = {}) {
	const { files = [GLOB_YAML], overrides = {}, stylistic: stylistic$1 = true } = options;
	const { quotes = "single" } = typeof stylistic$1 === "boolean" ? {} : stylistic$1;
	const [pluginYaml, parserYaml] = await Promise.all([interopDefault(import("eslint-plugin-yml")), interopDefault(import("yaml-eslint-parser"))]);
	return [
		{
			name: "eslint/yaml/setup",
			plugins: { yaml: pluginYaml }
		},
		{
			files,
			languageOptions: { parser: parserYaml },
			name: "eslint/yaml/rules",
			rules: {
				"style/spaced-comment": "off",
				"yaml/block-mapping": "error",
				"yaml/block-sequence": "error",
				"yaml/no-empty-key": "error",
				"yaml/no-empty-sequence-entry": "error",
				"yaml/no-irregular-whitespace": "error",
				"yaml/plain-scalar": "error",
				"yaml/vue-custom-block/no-parsing-error": "error",
				...stylistic$1 ? {
					"yaml/block-mapping-question-indicator-newline": "error",
					"yaml/block-sequence-hyphen-indicator-newline": "error",
					"yaml/flow-mapping-curly-newline": "error",
					"yaml/flow-mapping-curly-spacing": "error",
					"yaml/flow-sequence-bracket-newline": "error",
					"yaml/flow-sequence-bracket-spacing": "error",
					"yaml/indent": ["error", 2],
					"yaml/key-spacing": "error",
					"yaml/no-tab-indent": "error",
					"yaml/quotes": ["error", {
						avoidEscape: true,
						prefer: quotes === "backtick" ? "single" : quotes
					}],
					"yaml/spaced-comment": "error"
				} : {},
				...overrides
			}
		},
		{
			files: ["pnpm-workspace.yaml"],
			name: "eslint/yaml/pnpm-workspace",
			rules: { "yaml/sort-keys": [
				"error",
				{
					order: [
						"packages",
						"overrides",
						"patchedDependencies",
						"hoistPattern",
						"catalog",
						"catalogs",
						"allowedDeprecatedVersions",
						"allowNonAppliedPatches",
						"configDependencies",
						"ignoredBuiltDependencies",
						"ignoredOptionalDependencies",
						"neverBuiltDependencies",
						"onlyBuiltDependencies",
						"onlyBuiltDependenciesFile",
						"packageExtensions",
						"peerDependencyRules",
						"supportedArchitectures"
					],
					pathPattern: "^$"
				},
				{
					order: { type: "asc" },
					pathPattern: ".*"
				}
			] }
		}
	];
}

//#endregion
//#region src/factory.ts
const flatConfigProps = [
	"name",
	"languageOptions",
	"linterOptions",
	"processor",
	"plugins",
	"rules",
	"settings"
];
const VuePackages = [
	"vue",
	"nuxt",
	"vitepress",
	"@slidev/cli"
];
const defaultPluginRenaming = {
	"@eslint-react": "react",
	"@eslint-react/dom": "react-dom",
	"@eslint-react/hooks-extra": "react-hooks-extra",
	"@eslint-react/naming-convention": "react-naming-convention",
	"@stylistic": "style",
	"@typescript-eslint": "ts",
	"import-lite": "import",
	"n": "node",
	"vitest": "test",
	"yml": "yaml"
};
/**
* 构建 ESLint 平面配置项数组
*
* @param {OptionsConfig & TypedFlatConfigItem} options
*  生成 ESLint 配置的选项
* @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
*  要与生成的配置合并的用户配置
* @returns {Promise<TypedFlatConfigItem[]>}
*  合并的 ESLint 配置
*/
function lincy(options = {}, ...userConfigs) {
	const { autoRenamePlugins = true, componentExts = [], gitignore: enableGitignore = true, ignores: ignoresList = [], imports: enableImports = true, jsx: enableJsx = true, overrides = {}, pnpm: enableCatalogs = false, react: enableReact = false, regexp: enableRegexp = true, typescript: enableTypeScript = isPackageExists("typescript"), unicorn: enableUnicorn = true, unocss: enableUnoCSS = false, vue: enableVue = VuePackages.some((i) => isPackageExists(i)) } = options;
	let isInEditor = options.isInEditor;
	if (isInEditor == null) {
		isInEditor = isInEditorEnv();
		if (isInEditor) console.log("[@lincy/eslint-config] Detected running in editor, some rules are disabled.");
	}
	const stylisticOptions = options.stylistic === false ? false : typeof options.stylistic === "object" ? options.stylistic : {};
	if (stylisticOptions && !("jsx" in stylisticOptions)) stylisticOptions.jsx = enableJsx;
	const configs$1 = [];
	if (enableGitignore) if (typeof enableGitignore !== "boolean") configs$1.push(interopDefault(import("eslint-config-flat-gitignore")).then((r) => [r({
		name: "eslint/gitignore",
		...enableGitignore
	})]));
	else configs$1.push(interopDefault(import("eslint-config-flat-gitignore")).then((r) => [r({
		name: "eslint/gitignore",
		strict: false
	})]));
	const typescriptOptions = resolveSubOptions(options, "typescript");
	const tsconfigPath = "tsconfigPath" in typescriptOptions ? typescriptOptions.tsconfigPath : void 0;
	configs$1.push(ignores({ ignores: [...overrides.ignores || [], ...ignoresList] }), javascript({
		isInEditor,
		overrides: getOverrides(options, "javascript")
	}), comments({ overrides: overrides.comments }), node({ overrides: overrides.node }), jsdoc({
		overrides: overrides.jsdoc,
		stylistic: stylisticOptions
	}), imports({
		overrides: overrides.imports,
		stylistic: stylisticOptions
	}), perfectionist({ overrides: overrides.perfectionist }));
	if (enableUnicorn) configs$1.push(unicorn({
		...enableUnicorn === true ? {} : enableUnicorn,
		overrides: overrides.unicorn
	}));
	if (enableImports) configs$1.push(imports({
		overrides: overrides.imports,
		stylistic: stylisticOptions
	}));
	if (enableVue) componentExts.push("vue");
	if (enableJsx) configs$1.push(jsx());
	if (enableTypeScript) configs$1.push(typescript({
		...typescriptOptions,
		componentExts,
		overrides: getOverrides(options, "typescript"),
		tsconfigPath,
		type: options.type
	}));
	if (stylisticOptions) configs$1.push(stylistic({
		overrides: getOverrides(options, "stylistic"),
		stylistic: stylisticOptions
	}));
	if (enableRegexp) configs$1.push(regexp({
		...resolveSubOptions(options, "regexp"),
		...getOverrides(options, "regexp")
	}));
	if (options.test ?? true) configs$1.push(test({
		...resolveSubOptions(options, "test"),
		isInEditor,
		overrides: getOverrides(options, "test")
	}));
	if (enableVue) configs$1.push(vue({
		...resolveSubOptions(options, "vue"),
		overrides: getOverrides(options, "vue"),
		stylistic: stylisticOptions,
		typescript: !!enableTypeScript
	}));
	if (enableReact) configs$1.push(react({
		...typescriptOptions,
		...resolveSubOptions(options, "react"),
		overrides: getOverrides(options, "react"),
		tsconfigPath
	}));
	if (enableUnoCSS) configs$1.push(unocss({
		...resolveSubOptions(options, "unocss"),
		overrides: getOverrides(options, "unocss")
	}));
	if (options.jsonc ?? true) configs$1.push(jsonc({
		...resolveSubOptions(options, "jsonc"),
		overrides: getOverrides(options, "jsonc"),
		stylistic: stylisticOptions
	}), sortPackageJson(), sortTsconfig());
	if (enableCatalogs) configs$1.push(pnpm());
	if (options.yaml ?? true) configs$1.push(yaml({
		...resolveSubOptions(options, "yaml"),
		overrides: getOverrides(options, "yaml"),
		stylistic: stylisticOptions
	}));
	if (options.toml ?? true) configs$1.push(toml({
		overrides: getOverrides(options, "toml"),
		stylistic: stylisticOptions
	}));
	if (options.markdown ?? true) configs$1.push(markdown({
		...resolveSubOptions(options, "markdown"),
		componentExts,
		overrides: getOverrides(options, "markdown")
	}));
	if (options.formatters) configs$1.push(formatters(options.formatters, typeof stylisticOptions === "boolean" ? {} : stylisticOptions));
	configs$1.push(disables());
	if ("files" in options) throw new Error("[@lincy/eslint-config] 第一个参数不应包含“files”属性，因为选项应该是全局的。请将其放在第二个或更后面的配置中。");
	const fusedConfig = flatConfigProps.reduce((acc, key) => {
		if (key in options) acc[key] = options[key];
		return acc;
	}, {});
	if (Object.keys(fusedConfig).length) configs$1.push([fusedConfig]);
	let composer = new FlatConfigComposer();
	composer = composer.append(...configs$1, ...userConfigs);
	if (autoRenamePlugins) composer = composer.renamePlugins(defaultPluginRenaming);
	if (isInEditor) composer = composer.disableRulesFix([
		"unused-imports/no-unused-imports",
		"test/no-only-tests",
		"prefer-const"
	], { builtinRules: () => import(["eslint", "use-at-your-own-risk"].join("/")).then((r) => r.builtinRules) });
	return composer;
}
function resolveSubOptions(options, key) {
	return typeof options[key] === "boolean" ? {} : options[key] || {};
}
function getOverrides(options, key) {
	const sub = resolveSubOptions(options, key);
	return {
		...options.overrides?.[key],
		..."overrides" in sub ? sub.overrides : {}
	};
}

//#endregion
//#region src/index.ts
var src_default = lincy;

//#endregion
export { GLOB_ALL_SRC, GLOB_CSS, GLOB_EXCLUDE, GLOB_GRAPHQL, GLOB_HTML, GLOB_JS, GLOB_JSON, GLOB_JSON5, GLOB_JSONC, GLOB_JSX, GLOB_LESS, GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN, GLOB_POSTCSS, GLOB_SCSS, GLOB_SRC, GLOB_SRC_EXT, GLOB_STYLE, GLOB_SVELTE, GLOB_SVG, GLOB_TESTS, GLOB_TOML, GLOB_TS, GLOB_TSX, GLOB_VUE, GLOB_XML, GLOB_YAML, StylisticConfigDefaults, combine, comments, src_default as default, defaultPluginRenaming, disables, ensurePackages, formatters, getOverrides, ignores, imports, interopDefault, isInEditorEnv, isInGitHooksOrLintStaged, isPackageInScope, javascript, jsdoc, jsonc, jsx, lincy, markdown, node, parserPlain, perfectionist, pnpm, react, regexp, renamePluginInConfigs, renameRules, resolveSubOptions, sortPackageJson, sortTsconfig, stylistic, test, toArray, toml, typescript, unicorn, unocss, vue, yaml };