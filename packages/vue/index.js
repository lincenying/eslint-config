const { isPackageExists, getPackageInfoSync } = require('local-pkg')

const TS = isPackageExists('typescript')

const pkg = getPackageInfoSync('vue')
let vueVersion = pkg && pkg.version
vueVersion = +(vueVersion && vueVersion[0])
vueVersion = Number.isNaN(vueVersion) ? 3 : vueVersion

if (!TS) {
    console.warn(
        '[@lincy/eslint-config] TypeScript is not installed, fallback to JS only.',
    )
}

const tsEslintParser = {
    parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.vue'],
        ecmaFeatures: {
            jsx: true,
        },
    },
}

module.exports = {
    globals: {
        // Reactivity Transform
        $: 'readonly',
        $$: 'readonly',
        $ref: 'readonly',
        $shallowRef: 'readonly',
        $computed: 'readonly',
        $customRef: 'readonly',
        $toRef: 'readonly',
    },
    overrides: [{
        files: ['*.vue'],
        parser: 'vue-eslint-parser',
        ...(TS ? tsEslintParser : null),
        globals: {
            defineOptions: 'readonly',
            defineProps: 'readonly',
            defineEmits: 'readonly',
            definePropsRefs: 'readonly',
        },
        rules: {
            'no-unused-vars': 'off',
            'no-undef': 'off',
            ...(TS ? { '@typescript-eslint/no-unused-vars': 'off' } : null),
        },
    }],
    extends: [
        ...(vueVersion === 3 ? ['plugin:vue/vue3-recommended'] : ['plugin:vue/recommended']),
        ...(TS ? ['@lincy/eslint-config-ts'] : ['@lincy/eslint-config-basic']),
    ],
    plugins: [
    ],
    rules: {
        'vue/max-attributes-per-line': 'off',
        'vue/no-v-html': 'off',
        'vue/require-prop-types': 'off',
        'vue/require-default-prop': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/prefer-import-from-vue': 'off',
        'vue/no-v-text-v-html-on-component': 'off',
        'vue/no-dupe-keys': 'off',

        // reactivity transform
        'vue/no-setup-props-destructure': 'off',

        'vue/component-tags-order': ['error', {
            order: ['template', 'script', 'style'],
        }],
        'vue/block-tag-newline': ['error', {
            singleline: 'always',
            multiline: 'always',
        }],
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        'vue/custom-event-name-casing': vueVersion === 3 ? ['error', 'camelCase'] : ['error', 'kebab-case'],
        ...(vueVersion === 2 ? { 'vue/require-explicit-emits': 'off' } : null),
        'vue/define-macros-order': ['error', {
            order: ['defineProps', 'defineEmits'],
        }],
        'vue/html-indent': ['error', 4, {
            attribute: 1,
            baseIndent: 1,
            closeBracket: 0,
            alignAttributesVertically: true,
            ignores: [],
        }],
        'vue/html-comment-content-spacing': ['error', 'always', {
            exceptions: ['-'],
        }],
        'vue/html-self-closing': ['error', {
            html: {
                void: 'never',
                normal: 'any',
                component: 'any',
            },
            svg: 'always',
            math: 'always',
        }],
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        'vue/no-useless-v-bind': 'error',
        'vue/no-unused-refs': 'error',
        'vue/padding-line-between-blocks': ['error', 'always'],
        'vue/prefer-separate-static-class': 'error',

        // extensions
        'vue/array-bracket-spacing': ['error', 'never'],
        'vue/arrow-spacing': ['error', { before: true, after: true }],
        'vue/block-spacing': ['error', 'always'],
        'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
        'vue/comma-dangle': ['error', 'always-multiline'],
        'vue/comma-spacing': ['error', { before: false, after: true }],
        'vue/comma-style': ['error', 'last'],
        'vue/dot-location': ['error', 'property'],
        'vue/dot-notation': ['error', { allowKeywords: true }],
        'vue/eqeqeq': ['error', 'smart'],
        // 'vue/func-call-spacing': ['off', 'never'],
        'vue/key-spacing': ['error', { beforeColon: false, afterColon: true }],
        'vue/keyword-spacing': ['error', { before: true, after: true }],
        'vue/no-constant-condition': 'warn',
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
        'vue/no-sparse-arrays': 'error',
        'vue/object-curly-newline': ['error', { multiline: true, consistent: true }],
        'vue/object-curly-spacing': ['error', 'always'],
        'vue/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
        'vue/object-shorthand': ['error', 'always', {
            ignoreConstructors: false,
            avoidQuotes: true,
        }],
        'vue/operator-linebreak': ['error', 'before'],
        'vue/prefer-template': 'error',
        'vue/quote-props': ['error', 'consistent-as-needed'],
        'vue/space-in-parens': ['error', 'never'],
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': ['error', { words: true, nonwords: false }],
        'vue/template-curly-spacing': 'error',
        'vue/singleline-html-element-content-newline': 'off',
    },
}
