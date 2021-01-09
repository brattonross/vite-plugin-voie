import path from 'path';
import vue from '@vitejs/plugin-vue';
import voie from 'vite-plugin-voie';

const root = path.join(__dirname, 'app');

export default {
  root,
  plugins: [
    vue(),
    voie({
      pagesDir: 'pages',
    }),
  ],
};
