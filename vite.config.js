import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@feature': path.resolve(__dirname, 'src/feature'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@ui': path.resolve(__dirname, 'src/ui'),
    },
  },
  server: {
    port: 5000,
  },
});