import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: './public/index.html',
    },
  },
  server: {
    port: 3006,
    host: true
  }
});
