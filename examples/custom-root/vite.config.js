import { join } from 'path';
import voie from 'vite-plugin-voie';

const root = join(__dirname, 'app');

export default {
  root,
  plugins: [
    voie({
      root,
      pagesDir: 'pages',
    }),
  ],
};
