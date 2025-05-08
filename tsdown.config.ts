import { defineConfig } from 'tsdown'

export default defineConfig({
    entry: [
        'src/index.ts',
    ],
    shims: true,
    outputOptions: {
        exports: 'named',
    },
})
