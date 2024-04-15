import fs from 'node:fs/promises'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { builtinRules } from 'eslint/use-at-your-own-risk'
import { combine, comments, formatters, imports, javascript, jsdoc, jsonc, markdown, node, perfectionist, react, sortPackageJson, stylistic, test, toml, typescript, unicorn, unocss, vue, yaml } from '../src'

const configs = await combine(
    {
        plugins: {
            '': {
                rules: Object.fromEntries(builtinRules.entries()),
            },
        },
    },
    comments(),
    formatters(),
    imports(),
    javascript(),
    jsdoc(),
    jsonc(),
    markdown(),
    node(),
    perfectionist(),
    react(),
    sortPackageJson(),
    stylistic(),
    test(),
    toml(),
    typescript(),
    unicorn(),
    unocss(),
    vue(),
    yaml(),
)

const configNames = configs.map(i => i.name).filter(Boolean) as string[]

let dts = await flatConfigsToRulesDTS(configs, {
    includeAugmentation: false,
})

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(' | ')}
`

await fs.writeFile('src/typegen.d.ts', dts)
