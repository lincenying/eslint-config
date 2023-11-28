import { isPackageExists } from 'local-pkg'
import { ensurePackages, interopDefault } from '../utils'
import type { FlatConfigItem, OptionsFiles, OptionsReact } from '../types'
import { GLOB_JSX, GLOB_TSX } from '../globs'

// react refresh
const ReactRefreshAllowConstantExportPackages = [
    'vite',
]

export async function react(options: OptionsFiles & OptionsReact = {}): Promise<FlatConfigItem[]> {
    const {
        files = [GLOB_JSX, GLOB_TSX],
        jsx = true,
        overrides = {},
        typescript = true,
        version = '17.0',
    } = options

    await ensurePackages([
        'eslint-plugin-react',
        'eslint-plugin-react-hooks',
        'eslint-plugin-react-refresh',
    ])

    const [
        pluginReact,
        pluginReactHooks,
        pluginReactRefresh,
    ] = await Promise.all([
        // @ts-expect-error missing types
        interopDefault(import('eslint-plugin-react')),
        // @ts-expect-error missing types
        interopDefault(import('eslint-plugin-react-hooks')),
        // @ts-expect-error missing types
        interopDefault(import('eslint-plugin-react-refresh')),
    ] as const)

    const _isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(
        i => isPackageExists(i),
    )

    return [
        {
            name: 'eslint:react:setup',
            plugins: {
                'react': pluginReact,
                'react-hooks': pluginReactHooks,
                'react-refresh': pluginReactRefresh,
            },
        },
        {
            files,
            languageOptions: {
                parserOptions: {
                    ecmaFeatures: {
                        jsx,
                    },
                },
            },
            name: 'eslint:react:rules',
            rules: {
                // react-hooks
                'react-hooks/exhaustive-deps': 'warn',
                'react-hooks/rules-of-hooks': 'error',

                // react-refresh
                // 'react-refresh/only-export-components': [
                //     'warn',
                //     { allowConstantExport: _isAllowConstantExport },
                // ],
                'react-refresh/only-export-components': 'off',

                // react
                'react/boolean-prop-naming': 'error',
                'react/button-has-type': 'error',
                'react/default-props-match-prop-types': 'error',
                'react/destructuring-assignment': 'error',
                'react/display-name': 'error',
                'react/forbid-component-props': 'off', // 禁止组件上使用某些 props
                'react/forbid-dom-props': 'error',
                'react/forbid-elements': 'error',
                'react/forbid-foreign-prop-types': 'error',
                'react/forbid-prop-types': 'error',
                'react/function-component-definition': 'error',
                'react/hook-use-state': 'off', // useState 钩子值和 setter 变量的解构和对称命名
                'react/iframe-missing-sandbox': 'error',
                'react/jsx-boolean-value': 'error',
                'react/jsx-filename-extension': 'off', // 禁止可能包含 JSX 文件扩展名
                'react/jsx-fragments': 'error',
                'react/jsx-handler-names': 'error',
                'react/jsx-key': 'error',
                'react/jsx-max-depth': 'off', // 强制 JSX 最大深度
                'react/jsx-no-bind': 'off', // .bind()JSX 属性中禁止使用箭头函数
                'react/jsx-no-comment-textnodes': 'error',
                'react/jsx-no-constructed-context-values': 'error',
                'react/jsx-no-duplicate-props': 'error',
                'react/jsx-no-leaked-render': 'error',
                'react/jsx-no-literals': 'off', // 禁止在 JSX 中使用字符串文字
                'react/jsx-no-script-url': 'error',
                'react/jsx-no-target-blank': 'error',
                'react/jsx-no-undef': 'error',
                'react/jsx-no-useless-fragment': 'error',
                'react/jsx-pascal-case': 'error',
                'react/jsx-props-no-spreading': 'off', // 强制任何 JSX 属性都不会传播
                'react/jsx-uses-react': 'error',
                'react/jsx-uses-vars': 'error',
                'react/no-access-state-in-setstate': 'error',
                'react/no-adjacent-inline-elements': 'error',
                'react/no-array-index-key': 'error',
                'react/no-arrow-function-lifecycle': 'error',
                'react/no-children-prop': 'error',
                'react/no-danger': 'off', // 禁止使用 dangerouslySetInnerHTML
                'react/no-danger-with-children': 'error',
                'react/no-deprecated': 'error',
                'react/no-did-mount-set-state': 'error',
                'react/no-did-update-set-state': 'error',
                'react/no-direct-mutation-state': 'error',
                'react/no-find-dom-node': 'error',
                'react/no-invalid-html-attribute': 'error',
                'react/no-is-mounted': 'error',
                'react/no-multi-comp': 'error',
                'react/no-namespace': 'error',
                'react/no-object-type-as-default-prop': 'error',
                'react/no-redundant-should-component-update': 'error',
                'react/no-render-return-value': 'error',
                'react/no-set-state': 'error',
                'react/no-string-refs': 'error',
                'react/no-this-in-sfc': 'error',
                'react/no-typos': 'error',
                'react/no-unescaped-entities': 'error',
                'react/no-unknown-property': 'error',
                'react/no-unsafe': 'off', // 禁止使用不安全的生命周期方法
                'react/no-unstable-nested-components': 'error',
                'react/no-unused-class-component-methods': 'error',
                'react/no-unused-prop-types': 'error',
                'react/no-unused-state': 'error',
                'react/no-will-update-set-state': 'error',
                'react/prefer-es6-class': 'error',
                'react/prefer-exact-props': 'error',
                'react/prefer-read-only-props': 'error',
                'react/prefer-stateless-function': 'error',
                'react/prop-types': 'error',
                'react/react-in-jsx-scope': 'off', // 使用 JSX 时需要引入 React
                'react/require-default-props': 'off', // 为每个非必需 prop 强制执行 defaultProps 定义
                'react/require-optimization': 'error',
                'react/require-render-return': 'error',
                'react/self-closing-comp': 'error',
                'react/sort-comp': 'error',
                'react/sort-default-props': 'error',
                'react/sort-prop-types': 'error',
                'react/state-in-constructor': 'error',
                'react/static-property-placement': 'error',
                'react/style-prop-object': 'error',
                'react/void-dom-elements-no-children': 'error',

                ...typescript ? {
                    'react/jsx-no-undef': 'off',
                    'react/prop-type': 'off',
                } : {},

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
