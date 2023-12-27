/**
 * 来自 Prettier 的供应商类型，因此不依赖依赖项
 */

export type VendoredPrettierOptions = Partial<VendoredPrettierOptionsRequired>

export interface VendoredPrettierOptionsRequired {
    /**
     * 指定换行的行长度.
     * @default 200
     */
    printWidth: number
    /**
     * 指定每个缩进的空格数.
     */
    tabWidth: number
    /**
     * 使用制表符而不是空格来缩进行
     */
    useTabs?: boolean
    /**
     * 在语句末尾添加分号.
     */
    semi: boolean
    /**
     * 使用单引号代替双引号.
     */
    singleQuote: boolean
    /**
     * 在 JSX 中使用单引号.
     */
    jsxSingleQuote: boolean
    /**
     * 尽可能添加尾随逗号.
     */
    trailingComma: 'none' | 'es5' | 'all'
    /**
     * 对象文字中括号之间的空格.
     */
    bracketSpacing: boolean
    /**
     * 将多行 HTML（HTML、JSX、Vue、Angular）元素的 `>` 放在最后一行的末尾，
     * 而不是单独放在下一行（不适用于自闭合元素）。
     */
    bracketSameLine: boolean
    /**
     * 将多行 JSX 元素的 `>` 放在最后一行的末尾，而不是单独放在下一行.
     * @deprecated 使用 bracketSameLine 代替
     */
    jsxBracketSameLine: boolean
    /**
     * 仅格式化文件的一部分.
     */
    rangeStart: number
    /**
     * 仅格式化文件的一部分.
     * @default Number.POSITIVE_INFINITY
     */
    rangeEnd: number
    /**
     * 默认情况下，Prettier 将按原样包装 Markdown 文本，因为某些服务使用换行敏感渲染器.
     * 在某些情况下，您可能希望依靠编辑器/查看器软包装，因此此选项允许您选择退出.
     * @default "preserve"
     */
    proseWrap: 'always' | 'never' | 'preserve'
    /**
     * 箭头函数参数周围包含括号.
     * @default "always"
     */
    arrowParens: 'avoid' | 'always'
    /**
     * 为 Prettier 提供支持新语言的能力.
     */
    plugins: Array<string | any>
    /**
     * 如何处理 HTML 中的空格.
     * @default "css"
     */
    htmlWhitespaceSensitivity: 'css' | 'strict' | 'ignore'
    /**
     * 应用哪个换行符.
     * @default "lf"
     */
    endOfLine: 'auto' | 'lf' | 'crlf' | 'cr'
    /**
     * 引用对象中的属性时发生更改.
     * @default "as-needed"
     */
    quoteProps: 'as-needed' | 'consistent' | 'preserve'
    /**
     * 是否缩进Vue文件中<script>和<style>标签内的代码.
     * @default false
     */
    vueIndentScriptAndStyle: boolean
    /**
     * 在 HTML、Vue 和 JSX 中强制每行使用单一属性.
     * @default false
     */
    singleAttributePerLine: boolean
}

export type BuiltInParserName =
    | 'acorn'
    | 'angular'
    | 'babel-flow'
    | 'babel-ts'
    | 'babel'
    | 'css'
    | 'espree'
    | 'flow'
    | 'glimmer'
    | 'graphql'
    | 'html'
    | 'json-stringify'
    | 'json'
    | 'json5'
    | 'less'
    | 'lwc'
    | 'markdown'
    | 'mdx'
    | 'meriyah'
    | 'scss'
    | 'typescript'
    | 'vue'
    | 'yaml'

// This utility is here to handle the case where you have an explicit union
// between string literals and the generic string type. It would normally
// resolve out to just the string type, but this generic LiteralUnion maintains
// the intellisense of the original union.
//
// It comes from this issue: microsoft/TypeScript#29729:
//   https://github.com/microsoft/TypeScript/issues/29729#issuecomment-700527227
export type LiteralUnion<T extends U, U = string> =
    | T
    | (Pick<U, never> & { _?: never | undefined })
