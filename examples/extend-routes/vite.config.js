import voie from 'vite-plugin-voie';

export default {
  plugins: [
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
