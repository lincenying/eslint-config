# @lincy/eslint-config Eslint扁平化规则

[![npm](https://img.shields.io/npm/v/@lincy/eslint-config?color=444&label=)](https://npmjs.com/package/@lincy/eslint-config)

> Thanks to [sxzz/eslint-config](https://github.com/sxzz/eslint-config) and [antfu/eslint-config](https://github.com/antfu/eslint-config) for the inspiration and reference.

-   单引号，无结尾分号
-   自动格式化
-   专为与 TypeScript、Vue(2/3)、React 一起使用而设计，开箱即用
-   也适用于 json、yaml、markdown
-   import导入排序, 对象字⾯量项尾逗号
-   合理的默认值，最佳实践，只需一行配置
-   [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
-   使用 [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
-   **风格原则**: 读取最小，差异稳定

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

### 在 package.json 中添加脚本

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## VS Code support (保存时自动修复)

安装 [VS Code ESLint扩展](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

将以下设置添加到您的“settings.json”：

```jsonc
{
  // 禁用默认的格式化
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // 开启自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // 在 IDE 中静默样式规则，但仍会自动修复它们
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off" },
    { "rule": "format/*", "severity": "off" },
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
    "yaml",
    "toml",
    "xml",
    "gql",
    "graphql",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
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
    /**
     * 是否启用 stylistic 格式化规则
     * @default 默认值: true
     * @example 可选: false | { indent?: number | 'tab'; quotes?: 'single' | 'double'; jsx?: boolean; semi?: boolean; lessOpinionated?: boolean; }
     */
    stylistic: true,
    /**
     * 是否启用 typescript 规则
     * @default 默认值: 检测是否安装typescript依赖,
     * @example 可选: false | true | { parserOptions: {}; files?: string[] }
     */
    typescript: true,
    /**
     * 是否启用 vue 规则
     * @default 默认值: 检测是否安装vue依赖,
     * @example 可选: false | true | { files?: string[]; sfcBlocks: boolean }
     */
    vue: true,
    /**
     * 是否启用 jsx 规则
     * @default 默认值: true,
     * @example 可选: false
     */
    jsx: true,
    /**
     * 是否启用 react 规则
     * @default 默认值: 检测是否安装react依赖,
     * @example 可选: false | true | { jsx?: boolean; version?: string; files?: string[] }
     */
    react: true,
    /**
     * 是否启用 unocss 规则
     * @default 默认值: false,
     * @example 可选: true | { attributify?: boolean; strict?: boolean }
     */
    unocss: true,
    /**
     * 是否启用 jsonc 规则
     * @default 默认值: true,
     * @example 可选: false | { files?: string[] }
     */
    jsonc: false,
    /**
     * 是否启用 yaml 规则
     * @default 默认值: true,
     * @example 可选: false | { files?: string[] }
     */
    yaml: false,
    /**
     * 是否启用 toml 规则
     * @default 默认值: false,
     * @example 可选: true
     */
    toml: false,
    /**
     * 是否启用 .gitignore 文件
     * @default 默认值: true,
     * @example 可选: false | { ignores?: string[] }
     */
    gitignore: false,
    /**
     * 是否启用 test 规则
     * @default 默认值: true,
     * @example 可选: false | { files?: string[] }
     */
    test: false,
    /**
     * 是否启用 markdown 规则
     * @default 默认值: true,
     * @example 可选: false | { files?: string[] }
     */
    markdown: false,
    /**
     * 是否启用 regexp 规则
     * @default 默认值: true,
     * @example 可选: false | { level?: 'error' | 'warn' }
     */
    regexp: true,
    /**
     * 是否启用 formatters 规则
     * @default 默认值: false,
     * @example 可选: true | { css?: 'prettier' | boolean; html?: 'prettier' | boolean; markdown?: 'prettier' | 'dprint' | boolean }
     */
    formatters: false,
    /**
     * 覆盖规则
     */
    overrides: {
        ignores: [
            // 忽略的路径/文件
        ],
        javascript: {
            // javascript 规则
        },
        typescript: {
            // typescript 规则
        },
        stylistic: {
            // stylistic 规则
        },
        test: {
            // test 规则
        },
        vue: {
            // vue 规则
        },
        react: {
            // react 规则
        },
        jsonc: {
            // jsonc 规则
        },
        yaml: {
            // yaml 规则
        },
        toml: {
            // toml 规则
        },
        markdown: {
            // markdown 规则
        },
        unocss: {
            // unocss 规则
        },
        regexp: {
            // regexp 规则
        }
    },

    // 工厂函数第一个参数默认为各规则的开关, 但是也可以作为追加规则使用, 当包含以下键名将会自动整合到一个规则里
    languageOptions: {},
    linterOptions: {},
    processor: {},
    plugins: {},
    rules: [],
    settings: {}
})
```

`lincy` 工厂函数还接受任意数量的自定义配置覆盖
下面示例为添加`auto-import`生成的全局方法

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
        // 启用 unocss
        unocss: true
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
        rules: {
            'perfectionist/sort-objects': 'error',
        },
    },
)
```

您还可以导入非常细粒度的配置并根据需要组合它们：

<details>
<summary>点击展开例子</summary>

```js
// eslint.config.js
import {
    combine,
    comments,
    ignores,
    imports,
    javascript,
    jsdoc,
    jsonc,
    markdown,
    node,
    perfectionist,
    react,
    regexp,
    sortPackageJson,
    sortTsconfig,
    stylistic,
    toml,
    typescript,
    unicorn,
    unocss,
    vue,
    yaml,
} from '@lincy/eslint-config'

export default combine(
    ignores(),
    javascript(/* Options */),
    comments(),
    node(),
    jsdoc(),
    imports(),
    unicorn(),
    perfectionist(),
    typescript(/* Options */),
    stylistic(/* Options */),
    vue(),
    react(/* Options */),
    unocss(/* Options */),
    jsonc(),
    yaml(),
    toml(),
    markdown(),
    regexp(),
)
```

</details>

查看 [configs](https://github.com/lincenying/eslint-config/blob/main/src/configs) 和 [factory](https://github.com/lincenying/eslint-config/blob/main/src/factory.ts）了解更多详细信息。

### 插件重命名

由于扁平化配置支持显式提供了插件名称，因此我们重命名了一些插件以使它们更加一致并隐藏实现细节。

| New Prefix | Original Prefix        | Source Plugin                                                                              |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `import/*` | `import-x/*`           | [eslint-plugin-import-x](https://github.com/un-es/eslint-plugin-import-x)                  |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                     |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                        |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*`  | `@stylistic/*`         | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic)           |

当您想要覆盖规则或内联禁用它们时，您需要更新到新的前缀：

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

### 规则覆盖

某些规则仅在特定文件中启用，例如，“ts/_”规则仅在“.ts”文件中启用，“vue/_”规则仅在“.vue”文件中启用。 如果要覆盖规则，则需要指定文件扩展名：

```js
// eslint.config.js
import lincy from '@lincy/eslint-config'

export default lincy(
    {
        vue: true,
        jsx: true,
        react: true,
        typescript: true,
        stylistic: true,
        gitignore: true,
        test: true,
        jsonc: true,
        yaml: true,
        markdown: true,
        regexp: true,
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
    stylistic: {
        indent: 4
    },
    overrides: {
        // 覆盖 vue 规则
        vue: {
            'vue/operator-linebreak': ['error', 'before'],
        },
        // 覆盖 react 规则
        react: {
            'react/forbid-component-props': 'error',
        },
        // 覆盖 ts 规则
        typescript: {
            'ts/consistent-type-definitions': ['error', 'interface'],
        },
        // 覆盖 js 规则
        javascript: {
            'no-undef': 'off',
        },
        // 覆盖 stylistic 规则
        stylistic: {
            'antfu/consistent-list-newline': 'error',
        },
        yaml: {},
        jsonc: {},
        markdown: {},
        test: {},
        regexp: {},

        // 追加自定义排除文件(夹)
        ignores: [
            '**/assets',
            '**/static',
        ]
        // ...
    }
})
```

### 可选配置

提供了一些可选配置，默认情况下不包含它们的依赖项

#### Formatters

使用外部格式化程序来格式化 ESLint 无法处理的文件（.css、.html 等）。 由 [eslint-plugin-format](https://github.com/antfu/eslint-plugin-format) 提供支持

```js
// eslint.config.js
import lincy from '@lincy/eslint-config'

export default lincy({
    formatters: {
        /**
         * 格式化 CSS、LESS、SCSS 文件，以及 Vue 中的 `<style>` 模块
         * 默认使用 Prettier
         */
        css: true,
        /**
         * 格式化 HTML 文件
         * 默认使用 Prettier
         */
        html: true,
        /**
         * 格式化 Markdown 文件
         * 支持 Prettier 和 dprint
         * 默认使用 Prettier
         */
        markdown: 'prettier'
    }
})
```

运行“npx eslint”会提示您安装所需的依赖项，当然，也可以手动安装它们：

```bash
pnpm add eslint-plugin-format -D
```

#### React

当检测到依赖安装了`react`, 则默认开启

运行“npx eslint”会提示您安装所需的依赖项，当然，也可以手动安装它们：

```bash
pnpm i -D @eslint-react/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh
```

#### UnoCSS

要启用 UnoCSS 支持，需要显式打开它

```js
// eslint.config.js
import lincy from '@lincy/eslint-config'

export default lincy({
    unocss: true,
})
```

运行“npx eslint”会提示您安装所需的依赖项，当然，也可以手动安装它们：

```bash
pnpm i -D @unocss/eslint-plugin
```

### 可选规则

#### `perfectionist` (sorting)

这个插件 [`eslint-plugin-perfectionist`](https://github.com/azat-io/eslint-plugin-perfectionist) 允许你排序对象键名，导入，自动修复等。

安装了插件，但默认情况下没有启用任何规则。

建议使用[configuration comments]单独选择每个文件。(https://eslint.org/docs/latest/use/configure/rules#using-configuration-comments-1).

```ts
/* eslint perfectionist/sort-objects: "error" */
const objectWantedToSort = {
    a: 2,
    b: 1,
    c: 3,
}
/* e slint perfectionist/sort-objects: "off" */
```

### 类型感知规则

您可以选择通过将选项对象传递给“typescript”配置来启用[类型感知规则](https://typescript-eslint.io/linting/typed-linting/)：

```js
// eslint.config.js
import lincy from '@lincy/eslint-config'

export default lincy({
    typescript: {
        tsconfigPath: 'tsconfig.json',
        // tsconfigPath: ['tsconfig.json'], // 也可以是数组
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
