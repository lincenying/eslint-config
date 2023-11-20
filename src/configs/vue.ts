import { getPackageInfoSync } from 'local-pkg'
import { interopDefault } from '../utils'
import type { FlatConfigItem, OptionsHasTypeScript, OptionsOverrides, OptionsStylistic } from '../types'
import { GLOB_VUE } from '../globs'

const pkg = getPackageInfoSync('vue')
let vueVersion = pkg && pkg.version
vueVersion = (vueVersion && vueVersion[0])
vueVersion = Number.isNaN(vueVersion) ? '3' : vueVersion

export async function vue(
    options: OptionsHasTypeScript & OptionsOverrides & OptionsStylistic = {},
): Promise<FlatConfigItem[]> {
    const {
        overrides = {},
        stylistic = true,
    } = options

    const {
        indent = 4,
    } = typeof stylistic === 'boolean' ? {} : stylistic

    const [
        pluginVue,
        parserVue,
    ] = await Promise.all([
        // @ts-expect-error missing types
        interopDefault(import('eslint-plugin-vue')),
        interopDefault(import('vue-eslint-parser')),
    ] as const)

    return [
        {
            name: 'eslint:vue:setup',
            plugins: {
                vue: pluginVue,
            },
        },
        {
            files: [GLOB_VUE],
            languageOptions: {
                parser: parserVue,
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true,
                    },
                    extraFileExtensions: ['.vue'],
                    parser: options.typescript ? await interopDefault(import('@typescript-eslint/parser')) as any : null,
                    sourceType: 'module',
                },
            },
            name: 'eslint:vue:rules',
            processor: pluginVue.processors['.vue'],
            rules: {
                ...pluginVue.configs.base.rules as any,
                ...(vueVersion === '3' ? {
                    ...pluginVue.configs['vue3-essential'].rules as any,
                    ...pluginVue.configs['vue3-strongly-recommended'].rules as any,
                    ...pluginVue.configs['vue3-recommended'].rules as any,
                } : {
                    ...pluginVue.configs.essential.rules as any,
                    ...pluginVue.configs['strongly-recommended'].rules as any,
                    ...pluginVue.configs.recommended.rules as any,
                }),

                'node/prefer-global/process': 'off',

                'vue/block-order': ['error', {
                    order: ['template', 'script', 'style'],
                }],
                'vue/component-name-in-template-casing': ['error', 'PascalCase'],
                'vue/component-options-name-casing': ['error', 'PascalCase'],
                'vue/custom-event-name-casing': vueVersion === '3' ? ['error', 'camelCase'] : ['error', 'kebab-case'],
                ...(vueVersion === '2' ? {
                    'vue/require-explicit-emits': 'off',
                } : null),
                'vue/define-macros-order': ['error', {
                    order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
                }],
                'vue/dot-location': ['error', 'property'],
                'vue/dot-notation': ['error', { allowKeywords: true }],
                'vue/eqeqeq': ['error', 'smart'],
                'vue/html-indent': ['error', indent, {
                    alignAttributesVertically: true,
                    attribute: 1,
                    baseIndent: 1,
                    closeBracket: 0,
                    ignores: [],
                }],
                'vue/html-self-closing': ['error', {
                    html: {
                        component: 'any',
                        normal: 'any',
                        void: 'never',
                    },
                    math: 'always',
                    svg: 'always',
                }],
                'vue/max-attributes-per-line': 'off',
                'vue/multi-word-component-names': 'off',
                'vue/no-constant-condition': 'warn',
                'vue/no-dupe-keys': 'off',
                'vue/no-empty-pattern': 'error',
                'vue/no-extra-parens': ['error', 'functions'],
                'vue/no-irregular-whitespace': 'error',
                'vue/no-loss-of-precision': 'error',
                'vue/no-restricted-syntax': [
                    'error',
                    'DebuggerStatement',
                    'LabeledStatement',
                    'WithStatement',
                ],
                'vue/no-restricted-v-bind': ['error', '/^v-/'],

                'vue/no-setup-props-reactivity-loss': 'off',
                'vue/no-sparse-arrays': 'error',
                'vue/no-unused-refs': 'error',
                'vue/no-useless-v-bind': 'error',
                'vue/no-v-html': 'off',
                'vue/no-v-text-v-html-on-component': 'off',
                'vue/object-shorthand': ['error', 'always', {
                    avoidQuotes: true,
                    ignoreConstructors: false,
                }],
                'vue/prefer-separate-static-class': 'error',
                'vue/prefer-template': 'error',
                'vue/require-default-prop': 'off',
                'vue/require-prop-types': 'off',
                'vue/singleline-html-element-content-newline': 'off',
                'vue/space-infix-ops': 'error',
                'vue/space-unary-ops': ['error', { nonwords: false, words: true }],

                ...(stylistic ? {
                    'vue/array-bracket-spacing': ['error', 'never'],
                    'vue/arrow-spacing': ['error', { after: true, before: true }],
                    'vue/block-spacing': ['error', 'always'],
                    'vue/block-tag-newline': ['error', { multiline: 'always', singleline: 'always' }],
                    'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
                    'vue/comma-dangle': ['error', 'always-multiline'],
                    'vue/comma-spacing': ['error', { after: true, before: false }],
                    'vue/comma-style': ['error', 'last'],
                    'vue/html-comment-content-spacing': ['error', 'always', { exceptions: ['-'] }],
                    'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
                    'vue/keyword-spacing': ['error', { after: true, before: true }],
                    'vue/object-curly-newline': 'off',
                    'vue/object-curly-spacing': ['error', 'always'],
                    'vue/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
                    'vue/operator-linebreak': ['error', 'before'],
                    'vue/padding-line-between-blocks': ['error', 'always'],
                    'vue/quote-props': ['error', 'consistent-as-needed'],
                    'vue/space-in-parens': ['error', 'never'],
                    'vue/template-curly-spacing': 'error',
                } : {}),

                ...overrides,
            },
        },
    ]
}
