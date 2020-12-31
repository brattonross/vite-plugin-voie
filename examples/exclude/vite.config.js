import voie from 'vite-plugin-voie';

export default {
  plugins: [
    voie({
      exclude: ['src/pages/internal'],
    }),
  ],
};
