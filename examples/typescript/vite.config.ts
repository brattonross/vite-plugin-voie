import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import voie from 'vite-plugin-voie';

export default defineConfig({
  plugins: [vue(), voie()],
});
