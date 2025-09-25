import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

const entry = resolve(__dirname, 'src/index.ts');

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry,
      name: 'AetherbotWidget',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'aetherbot-sdk.mjs';
        if (format === 'cjs') return 'aetherbot-sdk.cjs';
        return 'aetherbot-sdk.umd.js';
      },
    },
    rollupOptions: {
      output: {
        extend: true,
      },
    },
    minify: 'esbuild',
  },
});
