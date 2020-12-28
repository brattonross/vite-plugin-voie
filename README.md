# voie 🛣

![npm version](https://img.shields.io/npm/v/vite-plugin-voie)

Voie is a [vite](https://github.com/vitejs/vite) plugin which enables file system based routing for Vue 3 applications.

- File system based routing
- Code splitting and async components by default

## Getting Started

Install Voie:

```bash
$ npm install vite-plugin-voie
```

> Note: vue-router@4.0.0 is a peer dependency

Add to your `vite.config.js`:

```js
import voie from 'vite-plugin-voie';

export default {
  plugins: [voie()],
};
```

When using Voie, a page is a Vue component exported from a `.vue` or `.js` file in the `src/pages` directory.

The routes configuration will be exported from the `voie-pages` module. Import this module and add it to your Vue Router configuration:

```js
import { createRouter } from 'vue-router';
import routes from 'voie-pages';

const router = createRouter({
  // ...
  routes,
});
```

> Note: TypeScript users can install type definitions for the generated routes via the voie-pages package:

```bash
$ npm install --save-dev voie-pages
```

## Configuration

Voie supports some configuration options in case your environment doesn't match the defaults.

```ts
interface UserOptions {
  pagesDir?: string;
  extensions?: string[];
  importMode?: ImportMode | ImportModeResolveFn;
  extendRoute?: (route: Route, parent: Route | undefined) => Route | void;
}
```

### pagesDir

Relative path to the pages directory. Supports globs.

**Default:** `'src/pages'`

### extensions

Array of valid extensions for pages.

**Default:** `['vue', 'js']`

### importMode

A string or function that returns a string which represents whether routes should be loaded synchronously or asynchronously.

**Default:** `'async'`

To get more fine-grained control over which routes are loaded sync/async, you can use a function to resolve the value based on the route path. For example:

```js
// vite.config.js
export default {
  // ...
  plugins: [
    voie({
      importMode(path) {
        // Load index synchronously, all other pages are async.
        return path.includes('index') ? 'sync' : 'async';
      },
    }),
  ],
};
```

### extendRoute

A function that takes a `Route` object (and that route's parent route), and optionally returns a modified route. This is useful for augmenting your routes with extra data (e.g. route metadata).

```js
// vite.config.js
export default {
  // ...
  plugins: [
    voie({
      extendRoute(route) {
        if (route.path === '/') {
          // Index is unauthenticated.
          return route;
        }

        // Augment the route with meta that indicates that the route requires authentication.
        return {
          ...route,
          meta: { auth: true },
        };
      },
    }),
  ],
};
```

To use custom configuration, pass your options to Voie when creating the plugin:

```js
// vite.config.js
import voie from 'vite-plugin-voie';

export default {
  plugins: [
    voie({
      pagesDir: 'src/views',
      extensions: ['vue', 'ts'],
    }),
  ],
};
```

## File System Routing

Voie's routing is inspired by [NuxtJS](https://nuxtjs.org/guides/features/file-system-routing), and so you can expect similar features with some small differences.

### Index Routes

Voie will automatically map files named `index` to the root of the directory:

- `src/pages/index.vue` -> `/`
- `src/pages/users/index.vue` -> `/users`

### Nested Routes

A nested folder structure will result in nested routes, making use of Vue Router's child routes:

- `src/pages/users/one.vue` -> `/users/one`
- `src/pages/dashboard/settings/profile.vue` -> `/dashboard/settings/profile`

You can effectively create layout pages by naming a page with the same name as the directory that contains its children pages:

This directory structure:

```
src/pages/
  ├── users/
  │  ├── [id].vue
  │  └── index.vue
  └── users.vue
```

will result in this routes configuration:

```js
[
  {
    path: '/users',
    component: '/src/pages/users.vue',
    children: [
      {
        path: '',
        component: '/src/pages/users/index.vue',
        name: 'users',
      },
      {
        path: ':id',
        component: '/src/pages/users/[id].vue',
        name: 'users-id',
      },
    ],
  },
];
```

### Dynamic Routes

Dynamic routes are denoted using square brackets. Directories and pages can be dynamic:

- `src/pages/users/[id].vue` -> `/users/:id` (`/users/one`)
- `src/[user]/settings.vue` -> `/:user/settings` (`/one/settings`)

### Catch-all Routes

Catch-all routes are denoted with square brackets containing an ellipsis:

- `src/pages/[...all].vue` -> `/*` (`/non-existent-page`)

The text after the ellipsis will be used both to name the route, and as the name of the prop in which the route parameters are passed.

## Thanks

Many thanks go to [@antfu](https://github.com/antfu) for their support of this project.

## Trivia

[voie](https://en.wiktionary.org/wiki/voie) is the french word for "way" and is pronounced `/vwa/`.
