# @lincy/eslint-config Eslint扁平化规则

[![npm](https://img.shields.io/npm/v/@lincy/eslint-config?color=444&label=)](https://npmjs.com/package/@lincy/eslint-config)

- 单引号，无结尾分号
- 自动格式化
- 专为与 TypeScript、Vue(2/3) 一起使用而设计，开箱即用
- 也适用于 json、yaml、markdown、react
- import导入排序, 对象字⾯量项尾逗号
- 合理的默认值，最佳实践，只需一行配置
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- 使用 [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
- **风格原则**: 读取最小，差异稳定

## Usage

### Install

```bash
pnpm add -D eslint @lincy/eslint-config
```

### Create config file

```js
// eslint.config.js
import lincy from '@lincy/eslint-config'

export default lincy()
```

> 通常您不需要`.eslintignore`，因为它已由预设提供。

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## VS Code support (auto fix)

安装[VS Code ESLint扩展](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

将以下设置添加到您的“settings.json”：

```jsonc
{
  // 开启eslint扁平化配置
  "eslint.experimental.useFlatConfig": true,

  // 禁用默认的格式化
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // 开启自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": false
  },

  // 在 IDE 中静默样式规则，但仍会自动修复它们
  "eslint.rules.customizations": [
    { "rule": "@stylistic/*", "severity": "off" },
    { "rule": "*-indent", "severity": "off" },
    { "rule": "*-spacing", "severity": "off" },
    { "rule": "*-spaces", "severity": "off" },
    { "rule": "*-order", "severity": "off" },
    { "rule": "*-dangle", "severity": "off" },
    { "rule": "*-newline", "severity": "off" },
    { "rule": "*quotes", "severity": "off" },
    { "rule": "*semi", "severity": "off" }
  ],

  // 为所有支持的语言启用 eslint
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml"
  ]
}
```

## 定制化

通常你只需要导入 `lincy` 预设：

#### esm
如果 package.json 中开启了`"type": "module",`

```js
// eslint.config.js
import lincy from '@lincy/eslint-config'

// or
// import { lincy } from '@lincy/eslint-config'

export default lincy()
```

#### cjs
如果 package.json 中没有开启`"type": "module",`

```js
// eslint.config.js
const lincy = require('@lincy/eslint-config').lincy

module.exports = lincy()
```

您可以单独配置每个功能，例如：

```js
// eslint.config.js
import lincy from '@lincy/eslint-config'

export default lincy({
    // 是否启用 stylistic 格式化规则
    stylistic: true, // 默认值: true
    // 是否启用 typescript 规则
    typescript: true, // 默认值: 检测是否安装typescript依赖
    // 是否启用 vue 规则
    vue: true, // 默认值: 检测是否安装vue依赖
    // 是否启用 jsonc 规则
    jsonc: false, // 默认值: 检测是否安装typescript依赖
    // 是否启用 yaml 规则
    yaml: false, // 默认值: true
    // 是否启用 .gitignore 文件
    gitignore: false, // 默认值: true
    // 是否启用 test 规则
    test: false, // 默认值: true
    // 是否启用 markdown 规则
    markdown: false, // 默认值: true
    // 覆盖规则
    overrides: {},

    // 工厂函数第一个参数默认为各规则的开关, 但是也可以作为追加规则使用, 当包含以下键名将会自动整合到一个规则里
    files: [],
    ignores: [],
    languageOptions: {},
    linterOptions: {},
    processor: {},
    plugins: {},
    rules: [],
    settings: {}
})
```

`lincy` 工厂函数还接受任意数量的自定义配置覆盖：

```js
// eslint.config.js
import { readFile } from 'node:fs/promises'
import lincy from '@lincy/eslint-config'
import plugin from '@unocss/eslint-plugin'

const autoImport = JSON.parse(
    await readFile(new URL('./.eslintrc-auto-import.json', import.meta.url)),
)

export default lincy(
    {
        // 配置, 参考上一个代码块
    },
    // 启用 unocss
    {
        plugins: {
            '@unocss': plugin,
        },
        rules: {
            ...plugin.configs.recommended.rules,
            '@unocss/order': 'off',
        },
    },
    // 启用 auto-import 生成的 .eslintrc-auto-import.json
    {
        languageOptions: {
            globals: {
                ...autoImport.globals,
                // 其他 globals
            },
        },
    },
    // 你还可以继续配置多个 ESLint Flat Configs
    {
        files: ['**/*.ts'],
        rules: {},
    },
)
```

更高级的是，您还可以导入非常细粒度的配置并根据需要组合它们：

```js
// eslint.config.js
import {
    comments,
    ignores,
    imports,
    javascript,
    jsdoc,
    jsonc,
    markdown,
    node,
    sortPackageJson,
    sortTsconfig,
    stylistic,
    typescript,
    unicorn,
    vue,
    yaml,
} from '@lincy/eslint-config'

export default [
    ...ignores(),
    ...javascript(),
    ...comments(),
    ...node(),
    ...jsdoc(),
    ...imports(),
    ...unicorn(),

    ...typescript(),
    ...stylistic(),

    ...vue(),
    ...jsonc(),
    ...yaml(),
    ...markdown(),
]
```

查看 [configs](https://github.com/lincenying/eslint-config/blob/main/src/configs) 和 [factory](https://github.com/lincenying/eslint-config/blob/main/src/factory.ts）了解更多详细信息。

> Thanks to [sxzz/eslint-config](https://github.com/sxzz/eslint-config) for the inspiration and reference.

## Plugins Renaming

由于扁平化配置支持显式提供了插件名称，因此我们重命名了一些插件以使它们更加一致并隐藏实现细节。

| New Prefix | Original Prefix | Source Plugin |
| --- | --- | --- |
| `import/*` | `i/*` | [eslint-plugin-i](https://github.com/un-es/eslint-plugin-i) |
| `node/*` | `n/*` | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n) |
| `yaml/*` | `yml/*` | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml) |
| `ts/*` | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*` | `@stylistic/*` | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic) |

当您想要覆盖规则或内联禁用它们时，您需要更新到新的前缀：

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

### Rules Overrides

某些规则仅在特定文件中启用，例如，“ts/*”规则仅在“.ts”文件中启用，“vue/*”规则仅在“.vue”文件中启用。 如果要覆盖规则，则需要指定文件扩展名：

```js
// eslint.config.js
import lincy from '@lincy/eslint-config'

export default lincy(
    {
        isInEditor: true,
        vue: true,
        typescript: true,
        stylistic: true,
        gitignore: true,
        test: true,
        jsonc: true,
        yaml: true,
        markdown: true,
        overrides: {}
    },
    {
        // 记得在这里指定文件 glob，否则可能会导致 vue 插件处理非 vue 文件
        files: ['**/*.vue'],
        rules: {
            'vue/operator-linebreak': ['error', 'before'],
        },
    },
    {
        // 如果没有 `files`，它们是所有文件的通用规则
        rules: {
            'style/semi': ['error', 'never'],
        },
    }
)
```

还可以使用“overrides”选项以使其更容易：

```js
// eslint.config.js
import lincy from '@lincy/eslint-config'

export default lincy({
    overrides: {
        // 重写vue规则
        vue: {
            'vue/operator-linebreak': ['error', 'before'],
        },
        // 重写ts规则
        typescript: {
            'ts/consistent-type-definitions': ['error', 'interface'],
        },
        // 重写js规则
        javascript: {},
        stylistic: {
            'lincy/consistent-list-newline': 'off',
        },
        yaml: {},
        jsonc: {},
        markdown: {},
        test: {},

        // 追加自定义排除文件(夹)
        ignores: [
            '**/assets',
            '**/static',
        ]
        // ...
    }
})
```

### Type Aware Rules

您可以选择通过将选项对象传递给“typescript”配置来启用[类型感知规则](https://typescript-eslint.io/linting/typed-linting/)：

```js
// eslint.config.js
import lincy from '@lincy/eslint-config'

export default lincy({
    typescript: {
        tsconfigPath: 'tsconfig.json',
    },
})
```

### React
react拓展规则

安装react插件

```bash
npm i -D eslint-plugin-react eslint-plugin-react-hooks
```

```js
// eslint.config.js
import lincy from '@lincy/eslint-config'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'

export default lincy(
    {
        vue: false,
    },
    // react 相关规则
    {
        files: ['**/*.{jsx,tsx}'],
        settings: {
            react: {
                version: '17.0',
            },
        },
        plugins: {
            'react': pluginReact,
            'react-hooks': pluginReactHooks,
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        rules: {
            'react/display-name': 'error',
            'react/jsx-key': 'error',
            'react/jsx-no-comment-textnodes': 'error',
            'react/jsx-no-duplicate-props': 'error',
            'react/jsx-no-target-blank': 'error',
            'react/jsx-no-undef': 'error',
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
            'react/no-children-prop': 'error',
            'react/no-danger-with-children': 'error',
            'react/no-deprecated': 'error',
            'react/no-direct-mutation-state': 'error',
            'react/no-find-dom-node': 'error',
            'react/no-is-mounted': 'error',
            'react/no-render-return-value': 'error',
            'react/no-string-refs': 'error',
            'react/no-unescaped-entities': 'error',
            'react/no-unknown-property': 'error',
            'react/no-unsafe': 'off',
            'react/prop-types': 'error',
            'react/require-render-return': 'error',
            'jsx-quotes': ['error', 'prefer-double'],
            'react/react-in-jsx-scope': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },
)
```

### Lint Staged

如果你想在每次提交之前应用 lint 和自动修复，你可以将以下内容添加到你的 `package.json` 中：

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```

然后

```bash
npm i -D lint-staged simple-git-hooks
```

## License

[MIT]
