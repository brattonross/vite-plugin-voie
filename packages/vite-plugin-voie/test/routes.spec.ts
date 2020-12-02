import { buildRoutes, Route } from '../src/routes';

const defaultPagesDir = 'src/pages';
const defaultExtensions = ['vue', 'js'];

test('given basic routes it should return the correct structure', () => {
  const files = [
    'src/pages/index.vue',
    'src/pages/user/index.vue',
    'src/pages/user/one.vue',
  ];
  const expected: Route[] = [
    {
      name: 'index',
      path: '/',
      component: '/src/pages/index.vue',
    },
    {
      name: 'user',
      path: '/user',
      component: '/src/pages/user/index.vue',
    },
    {
      name: 'user-one',
      path: '/user/one',
      component: '/src/pages/user/one.vue',
    },
  ];

  const actual = buildRoutes(files, defaultPagesDir, defaultExtensions);
  expect(actual).toEqual(expected);
});

test('given dynamic routes it should return the correct structure', () => {
  const files = [
    'src/pages/index.vue',
    'src/pages/users/[id].vue',
    'src/pages/[slug]/index.vue',
    'src/pages/[slug]/comments.vue',
  ];
  const expected: Route[] = [
    {
      name: 'index',
      path: '/',
      component: '/src/pages/index.vue',
    },
    {
      name: 'users-id',
      path: '/users/:id?',
      component: '/src/pages/users/[id].vue',
    },
    {
      name: 'slug',
      path: '/:slug',
      component: '/src/pages/[slug]/index.vue',
    },
    {
      name: 'slug-comments',
      path: '/:slug/comments',
      component: '/src/pages/[slug]/comments.vue',
    },
  ];

  const actual = buildRoutes(files, defaultPagesDir, defaultExtensions);
  expect(actual).toEqual(expected);
});

test('given nested routes it should return the correct structure', () => {
  const files = [
    'src/pages/users.vue',
    'src/pages/users/[id].vue',
    'src/pages/users/index.vue',
  ];
  const expected = [
    {
      path: '/users',
      component: '/src/pages/users.vue',
      children: [
        {
          path: ':id',
          component: '/src/pages/users/[id].vue',
          name: 'users-id',
        },
        {
          path: '',
          component: '/src/pages/users/index.vue',
          name: 'users',
        },
      ],
    },
  ];

  const actual = buildRoutes(files, defaultPagesDir, defaultExtensions);
  expect(actual).toEqual(expected);
});

test('given a catch-all route it should return the correct structure', () => {
  const files = [
    'src/pages/[...all].vue',
    'src/pages/users.vue',
    'src/pages/users/[id].vue',
    'src/pages/users/index.vue',
  ];
  const expected = [
    {
      name: 'all',
      path: '/:all(.*)',
      component: '/src/pages/[...all].vue',
    },
    {
      path: '/users',
      component: '/src/pages/users.vue',
      children: [
        {
          path: ':id',
          component: '/src/pages/users/[id].vue',
          name: 'users-id',
        },
        {
          path: '',
          component: '/src/pages/users/index.vue',
          name: 'users',
        },
      ],
    },
  ];

  const actual = buildRoutes(files, defaultPagesDir, defaultExtensions);
  expect(actual).toEqual(expected);
});
