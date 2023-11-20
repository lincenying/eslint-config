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
                ...pluginReact.configs.all.rules,
                ...pluginReactHooks.configs.recommended.rules,
                'react/forbid-component-props': 'off', // 禁止组件上使用某些 props
                'react/hook-use-state': 'off', // useState 钩子值和 setter 变量的解构和对称命名
                'react/jsx-filename-extension': 'off', // 禁止可能包含 JSX 文件扩展名
                'react/jsx-max-depth': 'off', // 强制 JSX 最大深度
                'react/jsx-no-bind': 'off', // .bind()JSX 属性中禁止使用箭头函数
                'react/jsx-no-literals': 'off', // 禁止在 JSX 中使用字符串文字
                'react/jsx-props-no-spreading': 'off', // 强制任何 JSX 属性都不会传播
                'react/no-danger': 'off', // 禁止使用 dangerouslySetInnerHTML
                'react/no-unsafe': 'off', // 禁止使用不安全的生命周期方法
                'react/react-in-jsx-scope': 'off', // 使用 JSX 时需要引入 React
                'react/require-default-props': 'off', // 为每个非必需 prop 强制执行 defaultProps 定义

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
