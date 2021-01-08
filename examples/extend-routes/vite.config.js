import vue from '@vitejs/plugin-vue';
import voie from 'vite-plugin-voie';

export default {
  plugins: [
    vue(),
    voie({
      extendRoute(route) {
        return {
          ...route,
          path: route.path === '/' ? route.path : '/prefix' + route.path,
        };
      },
    }),
  ],
};
