import type { OptionsFiles, OptionsHasTypeScript, OptionsOverrides, OptionsStylistic, OptionsVue, TypedFlatConfigItem } from '../types'

import { mergeProcessors } from 'eslint-merge-processors'
import { getPackageInfoSync } from 'local-pkg'

import { GLOB_VUE } from '../globs'
import { interopDefault } from '../utils'

const pkg = getPackageInfoSync('vue')
let vueVersion = pkg && pkg.version
vueVersion = (vueVersion && vueVersion[0])
vueVersion = Number.isNaN(vueVersion) ? '3' : vueVersion

export async function vue(
    options: OptionsHasTypeScript & OptionsOverrides & OptionsStylistic & OptionsFiles & OptionsVue = {},
): Promise<TypedFlatConfigItem[]> {
    const {
        files = [GLOB_VUE],
        overrides = {},
        stylistic = true,
    } = options

    const sfcBlocks = options.sfcBlocks === true ? {} : options.sfcBlocks ?? {}

    const {
        indent = 4,
    } = typeof stylistic === 'boolean' ? {} : stylistic

    const [
        pluginVue,
        parserVue,
        processorVueBlocks,
    ] = await Promise.all([
        interopDefault(import('eslint-plugin-vue')),
        interopDefault(import('vue-eslint-parser')),
        interopDefault(import('eslint-processor-vue-blocks')),
    ] as const)

    return [
        {
            // This allows Vue plugin to work with auto imports
            // https://github.com/vuejs/eslint-plugin-vue/pull/2422
            languageOptions: {
                globals: {
                    computed: 'readonly',
                    defineEmits: 'readonly',
                    defineExpose: 'readonly',
                    defineProps: 'readonly',
                    onMounted: 'readonly',
                    onUnmounted: 'readonly',
                    reactive: 'readonly',
                    ref: 'readonly',
                    shallowReactive: 'readonly',
                    shallowRef: 'readonly',
                    toRef: 'readonly',
                    toRefs: 'readonly',
                    watch: 'readonly',
                    watchEffect: 'readonly',
                },
            },
            name: 'eslint/vue/setup',
            plugins: {
                vue: pluginVue,
            },
        },
        {
            files,
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
            name: 'eslint/vue/rules',
            processor: sfcBlocks === false ? pluginVue.processors['.vue'] : mergeProcessors([
                pluginVue.processors['.vue'],
                processorVueBlocks({
                    ...sfcBlocks,
                    blocks: {
                        styles: true,
                        ...sfcBlocks.blocks,
                    },
                }),
            ]),
            rules: {
                ...pluginVue.configs.base.rules as any,

                ...vueVersion === '2' ? {
                    ...pluginVue.configs['vue2-essential'].rules as any,
                    ...pluginVue.configs['vue2-strongly-recommended'].rules as any,
                    ...pluginVue.configs['vue2-recommended'].rules as any,
                } : {
                    ...pluginVue.configs['flat/essential'].map(c => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}) as any,
                    ...pluginVue.configs['flat/strongly-recommended'].map(c => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}) as any,
                    ...pluginVue.configs['flat/recommended'].map(c => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}) as any,
                },

                'antfu/no-top-level-await': 'off',
                'node/prefer-global/process': 'off',
                'ts/explicit-function-return-type': 'off',

                'vue/block-order': ['error', {
                    order: ['template', 'script', 'style'],
                }],
                'vue/component-name-in-template-casing': ['error', 'PascalCase'],
                'vue/component-options-name-casing': ['error', 'PascalCase'],
                'vue/custom-event-name-casing': vueVersion === '3' ? ['error', 'camelCase'] : ['error', 'kebab-case'],
                ...(vueVersion === '2' ? {
                    'vue/require-explicit-emits': 'off',
                } : null),
                'no-irregular-whitespace': 'off',
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
                'vue/no-irregular-whitespace': ['error', {
                    skipComments: false,
                    skipHTMLAttributeValues: false,
                    skipHTMLTextContents: true,
                    skipRegExps: false,
                    skipStrings: true,
                    skipTemplates: false,
                }],
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
                'vue/no-unused-refs': 'warn',
                'vue/no-useless-v-bind': 'error',
                'vue/no-v-html': 'off',
                'vue/no-v-text-v-html-on-component': 'off',
                'vue/object-shorthand': [
                    'error',
                    'always',
                    {
                        avoidQuotes: true,
                        ignoreConstructors: false,
                    },
                ],
                'vue/prefer-separate-static-class': 'error',
                'vue/prefer-template': 'error',
                'vue/prop-name-casing': ['error', 'camelCase'],
                'vue/require-default-prop': 'off',
                'vue/require-prop-types': 'off',
                'vue/singleline-html-element-content-newline': 'off',
                'vue/space-infix-ops': 'error',
                'vue/space-unary-ops': ['error', { nonwords: false, words: true }],

                ...(stylistic ? {
                    'vue/array-bracket-spacing': ['error', 'never'],
                    'vue/arrow-spacing': ['error', { after: true, before: true }],
                    'vue/block-spacing': ['error', 'always'],
                    'vue/block-tag-newline': ['error', {
                        multiline: 'always',
                        singleline: 'always',
                    }],
                    'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: false }],
                    'vue/comma-dangle': ['error', 'always-multiline'],
                    'vue/comma-spacing': ['error', { after: true, before: false }],
                    'vue/comma-style': ['error', 'last'],
                    'vue/html-comment-content-spacing': ['error', 'always', {
                        exceptions: ['-'],
                    }],
                    'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
                    'vue/keyword-spacing': ['error', { after: true, before: true }],
                    'vue/object-curly-newline': 'off',
                    'vue/object-curly-spacing': ['error', 'always'],
                    'vue/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
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
