import { defineConfig } from 'tsup';

const external = [
  '@mui/material',
  '@mui/material/styles',
  '@emotion/react',
  '@emotion/styled'
];

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    outDir: 'dist/esm',
    target: 'es2019',
    dts: {
      entry: 'src/index.ts',
      outDir: 'dist/types'
    },
    sourcemap: true,
    clean: true,
    minify: false,
    splitting: false,
    external
  },
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    outDir: 'dist/cjs',
    target: 'es2019',
    dts: false,
    sourcemap: true,
    clean: false,
    minify: false,
    splitting: false,
    external,
    esbuildOptions(options) {
      options.outExtension = { '.js': '.cjs' };
    }
  }
]);
