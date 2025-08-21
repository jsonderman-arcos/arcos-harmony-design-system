import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
});
