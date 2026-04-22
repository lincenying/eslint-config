import { defineConfig } from 'tsdown'

export default defineConfig({
    entry: [
        'src/index.ts',
    ],
    dts: true,
    shims: true,
    outputOptions: {
        exports: 'named',
    },
    exports: true,
})
