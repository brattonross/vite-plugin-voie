# voie 🛣

Voie is a [vite](https://github.com/vitejs/vite) plugin which enables file system based routing for Vue 3 applications.

- File system based routing
- Code splitting and async components by default

## Getting Started

Install Voie:

```bash
$ npm install vite-plugin-voie
```

Add to your `vite.config.js`:

```js
import voie from 'vite-plugin-voie';

export default {
  plugins: [voie()],
};
```

When using Voie, a page is a Vue component exported from a `.vue` or `.js` file in the `src/pages` directory.

The routes configuration will be exported from the `/@voie/pages` module. Import this module and add it to your Vue Router configuration:

```js
import { createRouter } from 'vue-router';
import routes from '/@voie/pages';

const router = createRouter({
  // ...
  routes,
});
```

## Trivia

[voie](https://en.wiktionary.org/wiki/voie) is the french word for "way" and is pronounced `/vwa/`.
