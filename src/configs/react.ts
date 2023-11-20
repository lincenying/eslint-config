import { interopDefault } from '../utils'
import type { FlatConfigItem, OptionsReact } from '../types'
import { GLOB_JSX, GLOB_TSX } from '../globs'

export async function react(options: OptionsReact = {}): Promise<FlatConfigItem[]> {
    const {
        jsx = true,
        overrides = {},
        version = '17.0',
    } = options

    const [
        pluginReact,
        pluginReactHooks,
    ] = await Promise.all([
        // @ts-expect-error missing types
        interopDefault(import('eslint-plugin-react')),
        // @ts-expect-error missing types
        interopDefault(import('eslint-plugin-react-hooks')),
    ] as const)

    return [
        {
            name: 'eslint:react:setup',
            plugins: {
                'react': pluginReact,
                'react-hooks': pluginReactHooks,
            },
        },
        {
            files: [GLOB_JSX, GLOB_TSX],
            languageOptions: {
                parserOptions: {
                    ecmaFeatures: {
                        jsx,
                    },
                },
            },
            name: 'eslint:react:rules',
            rules: {
                'react-hooks/exhaustive-deps': 'warn',
                'react-hooks/rules-of-hooks': 'error',
                'react/boolean-prop-naming': 2,
                'react/button-has-type': 2,
                'react/default-props-match-prop-types': 2,
                'react/destructuring-assignment': 2,
                'react/display-name': 2,
                'react/forbid-component-props': 'off', // 禁止组件上使用某些 props
                'react/forbid-dom-props': 2,
                'react/forbid-elements': 2,
                'react/forbid-foreign-prop-types': 2,
                'react/forbid-prop-types': 2,
                'react/function-component-definition': 2,
                'react/hook-use-state': 'off', // useState 钩子值和 setter 变量的解构和对称命名
                'react/iframe-missing-sandbox': 2,
                'react/jsx-boolean-value': 2,
                'react/jsx-filename-extension': 'off', // 禁止可能包含 JSX 文件扩展名
                'react/jsx-fragments': 2,
                'react/jsx-handler-names': 2,
                'react/jsx-key': 2,
                'react/jsx-max-depth': 'off', // 强制 JSX 最大深度
                'react/jsx-no-bind': 'off', // .bind()JSX 属性中禁止使用箭头函数
                'react/jsx-no-comment-textnodes': 2,
                'react/jsx-no-constructed-context-values': 2,
                'react/jsx-no-duplicate-props': 2,
                'react/jsx-no-leaked-render': 2,
                'react/jsx-no-literals': 'off', // 禁止在 JSX 中使用字符串文字
                'react/jsx-no-script-url': 2,
                'react/jsx-no-target-blank': 2,
                'react/jsx-no-undef': 2,
                'react/jsx-no-useless-fragment': 2,
                'react/jsx-pascal-case': 2,
                'react/jsx-props-no-spreading': 'off', // 强制任何 JSX 属性都不会传播
                'react/jsx-uses-react': 2,
                'react/jsx-uses-vars': 2,
                'react/no-access-state-in-setstate': 2,
                'react/no-adjacent-inline-elements': 2,
                'react/no-array-index-key': 2,
                'react/no-arrow-function-lifecycle': 2,
                'react/no-children-prop': 2,
                'react/no-danger': 'off', // 禁止使用 dangerouslySetInnerHTML
                'react/no-danger-with-children': 2,
                'react/no-deprecated': 2,
                'react/no-did-mount-set-state': 2,
                'react/no-did-update-set-state': 2,
                'react/no-direct-mutation-state': 2,
                'react/no-find-dom-node': 2,
                'react/no-invalid-html-attribute': 2,
                'react/no-is-mounted': 2,
                'react/no-multi-comp': 2,
                'react/no-namespace': 2,
                'react/no-object-type-as-default-prop': 2,
                'react/no-redundant-should-component-update': 2,
                'react/no-render-return-value': 2,
                'react/no-set-state': 2,
                'react/no-string-refs': 2,
                'react/no-this-in-sfc': 2,
                'react/no-typos': 2,
                'react/no-unescaped-entities': 2,
                'react/no-unknown-property': 2,
                'react/no-unsafe': 'off', // 禁止使用不安全的生命周期方法
                'react/no-unstable-nested-components': 2,
                'react/no-unused-class-component-methods': 2,
                'react/no-unused-prop-types': 2,
                'react/no-unused-state': 2,
                'react/no-will-update-set-state': 2,
                'react/prefer-es6-class': 2,
                'react/prefer-exact-props': 2,
                'react/prefer-read-only-props': 2,
                'react/prefer-stateless-function': 2,
                'react/prop-types': 2,
                'react/react-in-jsx-scope': 'off', // 使用 JSX 时需要引入 React
                'react/require-default-props': 'off', // 为每个非必需 prop 强制执行 defaultProps 定义
                'react/require-optimization': 2,
                'react/require-render-return': 2,
                'react/self-closing-comp': 2,
                'react/sort-comp': 2,
                'react/sort-default-props': 2,
                'react/sort-prop-types': 2,
                'react/state-in-constructor': 2,
                'react/static-property-placement': 2,
                'react/style-prop-object': 2,
                'react/void-dom-elements-no-children': 2,

                ...overrides,
            },
            settings: {
                react: {
                    version,
                },
            },
        },
    ]
}
