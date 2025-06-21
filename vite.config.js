// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Netflex-reactclone/', // 👈 Add this line (must match your GitHub repo name)
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
});
