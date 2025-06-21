import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Replace 'your-repo-name' with your actual GitHub repo name
export default defineConfig({
  base: '/hacathon2/',  // 👈 IMPORTANT: must match GitHub repo name
  plugins: [react()],
  build: {
    rollupOptions: {
      input: 'index.html', // optional, can be omitted if index.html is in root
    }
  }
});
