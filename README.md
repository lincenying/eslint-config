# @lincy/eslint-config

[![npm](https://img.shields.io/npm/v/@lincy/eslint-config?color=444&label=)](https://npmjs.com/package/@lincy/eslint-config)

- 单引号，无结尾分号
- 自动格式化
- 专为与 TypeScript、Vue(2/3) 一起使用而设计，开箱即用
- Lint 也适用于 json、yaml、markdown
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
  // Enable the flat config support
  "eslint.experimental.useFlatConfig": true,

  // Disable the default formatter
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": false
  },

  // Silent the stylistic rules in you IDE, but still auto fix them
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

  // The following is optional.
  // It's better to put under project setting `.vscode/settings.json`
  // to avoid conflicts with working with different eslint configs
  // that does not support all formats.
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
```js
// eslint.config.js
import lincy from '@lincy/eslint-config'

// or
// import { lincy } from '@lincy/eslint-config'

export default lincy()
```

#### cjs
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
    // 是否启用 yml 规则
    yml: false, // 默认值: true
    // 是否启用 .gitignore 文件
    gitignore: false, // 默认值: true
    // 是否启用 test 规则
    test: false, // 默认值: true
    // 是否启用 markdown 规则
    markdown: false, // 默认值: true
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
    // Configures for config
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
    // 自定义排除文件(夹)
    {
        ignores: [
            '**/assets',
            '**/static',
        ],
    },
    // 你还可以继续配置多个 ESLint Flat Configs
    {
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
    javascriptStylistic,
    jsdoc,
    jsonc,
    markdown,
    node,
    sortPackageJson,
    sortTsconfig,
    typescript,
    typescriptStylistic,
    unicorn,
    vue,
    yml,
} from '@lincy/eslint-config'

export default [
    ...ignores,
    ...javascript(),
    ...comments,
    ...node,
    ...jsdoc,
    ...imports,
    ...unicorn,
    ...javascriptStylistic,

    ...typescript(),
    ...typescriptStylistic,

    ...vue(),
    ...jsonc,
    ...yml,
    ...markdown(),
]
```

查看 [configs](https://github.com/lincenying/eslint-config/blob/main/src/configs) 和 [factory](https://github.com/lincenying/eslint-config/blob/ main/src/factory.ts）了解更多详细信息。

> Thanks to [sxzz/eslint-config](https://github.com/sxzz/eslint-config) for the inspiration and reference.

## Plugins Renaming

由于平面配置支持显式提供了插件名称，因此我们重命名了一些插件以使它们更加一致并隐藏实现细节。

| Original Prefix | New Prefix | Source Plugin |
| --------------- | ---------- | ------------- |
| `i/*` | `import/*` | [eslint-plugin-i](https://github.com/un-es/eslint-plugin-i) |
| `n/*` | `node` | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)
| `@typescript-eslint/*` | `ts/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `@stylistic/js` | `style/*` | [@stylistic/eslint-plugin-js](https://github.com/eslint-stylistic/eslint-stylistic) |

当您想要覆盖规则或内联禁用它们时，您需要更新到新的前缀：

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
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
