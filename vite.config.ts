import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'MuiThemeLib',
      formats: ['es', 'umd'],
  fileName: (format) => `ux-design-system.${format}.js`,
    },
  },
    resolve: {
    alias: {
      '@outputs': path.resolve(__dirname, 'src/tokens/outputs'),
    },
  },
});
