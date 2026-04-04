import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(workingDirectory, 'src')
    },
  },
  plugins: [],
  server: {
    port: 5000,
  },
});