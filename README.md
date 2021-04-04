# voie 🛣

![npm version](https://img.shields.io/npm/v/vite-plugin-voie)

> File system based routing for Vue 3 applications using [Vite](https://github.com/vitejs/vite)

**Note:** This project is no longer actively maintained. If you are looking for a file-based routing system for Vite, other kind members of the community have built a solution over at [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)

Voie is a Vite plugin that brings file system based routing to your Vue 3 applications.

## Getting Started

Install Voie:

> Vite 2 is supported from `^0.7.x`, Vite 1 support is discontinued

```bash
$ npm install -D vite-plugin-voie
```

> Note: `vue-router@^4` is a peer dependency

Add to your `vite.config.js`:

```js
import vue from '@vitejs/plugin-vue';
import voie from 'vite-plugin-voie';

export default {
  plugins: [vue(), voie()],
};
```

## Overview

By default a page is a Vue component exported from a `.vue` or `.js` file in the `src/pages` directory.

You can access the generated routes by importing the `voie-pages` module in your application.

```js
import { createRouter } from 'vue-router';
import routes from 'voie-pages';

const router = createRouter({
  // ...
  routes,
});
```

> Note: TypeScript users can install type definitions for the generated routes via the `voie-pages` package:

```bash
$ npm install -D voie-pages
```

## Configuration

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

Array of valid file extensions for pages.

**Default:** `['vue', 'js']`

### importMode

Import mode can be set to either `async`, `sync`, or a function which returns one of those values.

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

A function that takes a route and optionally returns a modified route. This is useful for augmenting your routes with extra data (e.g. route metadata).

```js
// vite.config.js
export default {
  // ...
  plugins: [
    voie({
      extendRoute(route, parent) {
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

### Using configuration

To use custom configuration, pass your options to Voie when instantiating the plugin:

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

Voie is inspired by the routing from [NuxtJS](https://nuxtjs.org/guides/features/file-system-routing) 💚

Voie automatically generates an array of routes for you to plug-in to your instance of Vue Router. These routes are determined by the structure of the files in your pages directory. Simply create `.vue` files in your pages directory and routes will automatically be created for you, no additional configuration required!

For more advanced use cases, you can tailor Voie to fit the needs of your app through [configuration](https://github.com/brattonross/vite-plugin-voie#configuration).

- [Basic Routing](https://github.com/brattonross/vite-plugin-voie#basic-routing)
- [Index Routes](https://github.com/brattonross/vite-plugin-voie#index-routes)
- [Dynamic Routes](https://github.com/brattonross/vite-plugin-voie#dynamic-routes)
- [Nested Routes](https://github.com/brattonross/vite-plugin-voie#nested-routes)
- [Catch-all Routes](https://github.com/brattonross/vite-plugin-voie#catch-all-routes)

### Basic Routing

Voie will automatically map files from your pages directory to a route with the same name:

- `src/pages/users.vue` -> `/users`
- `src/pages/users/profile.vue` -> `/users/profile`
- `src/pages/settings.vue` -> `/settings`

### Index Routes

Files with the name `index` are treated as the index page of a route:

- `src/pages/index.vue` -> `/`
- `src/pages/users/index.vue` -> `/users`

### Dynamic Routes

Dynamic routes are denoted using square brackets. Both directories and pages can be dynamic:

- `src/pages/users/[id].vue` -> `/users/:id` (`/users/one`)
- `src/[user]/settings.vue` -> `/:user/settings` (`/one/settings`)

Any dynamic parameters will be passed to the page as props. For example, given the file `src/pages/users/[id].vue`, the route `/users/abc` will be passed the following props:

```json
{ "id": "abc" }
```

### Nested Routes

We can make use of Vue Routers child routes to create nested layouts. The parent component can be defined by giving it the same name as the directory that contains your child routes.

For example, this directory structure:

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

### Catch-all Routes

Catch-all routes are denoted with square brackets containing an ellipsis:

- `src/pages/[...all].vue` -> `/*` (`/non-existent-page`)

The text after the ellipsis will be used both to name the route, and as the name of the prop in which the route parameters are passed.

## Thanks

Many thanks go to [@antfu](https://github.com/antfu) for their support of this project.

## Trivia

[voie](https://en.wiktionary.org/wiki/voie) is the french word for "way" and is pronounced `/vwa/`.
