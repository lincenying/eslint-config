import { defineConfig } from 'tsup'

export default defineConfig({
    entry: [
        'src/index.ts',
    ],
    shims: true,
    esbuildOptions(options) {
        options.charset = 'utf8'
    },
})
