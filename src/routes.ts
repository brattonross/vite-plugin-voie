export interface Route {
  name?: string;
  path: string;
  component: string;
  children?: Route[];
}

export function buildRoutes(
  files: string[],
  pagesDir: string,
  extensions: string[]
) {
  // TODO: Create routes based on file path and sort.
  // Nested routes: When there is a .vue file with the same name as a directory,
  // any components in the directory should be mapped to children of the parent route.
  // Sort Order: /static, /index, /:dynamic
  // Match exact route before index: /login before /index/_slug
  const routes: Route[] = [];

  for (const file of files) {
    const pathParts = file
      .replace(new RegExp(`^${pagesDir}`), '')
      .replace(new RegExp(`\\.(${extensions.join('|')})$`), '')
      .split('/')
      .slice(1); // removing the pagesDir means that the path begins with a '/'

    const route: Route = {
      name: '',
      path: '',
      component: `/${file}`,
    };

    let parent = routes;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      // Remove square brackets at the start and end.
      const isDynamicPart = isDynamicRoute(part);
      const normalizedPart = (isDynamicPart
        ? part.replace(/^\[/, '').replace(/\]$/, '')
        : part
      ).toLowerCase();

      route.name += route.name ? `-${normalizedPart}` : normalizedPart;

      const child = parent.find(
        (parentRoute) => parentRoute.name === route.name
      );
      if (child) {
        child.children = child.children || [];
        parent = child.children;
        route.path = '';
      } else if (normalizedPart === 'index' && !route.path) {
        route.path += '/';
      } else if (normalizedPart !== 'index') {
        if (isDynamicPart) {
          route.path += `/:${normalizedPart}`;
          if (i === pathParts.length - 1) {
            route.path += '?';
          }
        } else {
          route.path += `/${normalizedPart}`;
        }
      }
    }

    parent.push(route);
  }

  sortRoutes(routes);
  return prepareRoutes(routes);
}

const isDynamicRoute = (s: string) => /^\[.+\]$/.test(s);

/**
 * Sorts the routes into the correct order for Vue Router to use.
 */
function sortRoutes(routes: Route[]) {
  routes.sort((a, b) => {
    if (!a.path.length) {
      return -1;
    }
    if (!b.path.length) {
      return 1;
    }

    if (a.path === '/') {
      return /\/:/.test(b.path) ? -1 : 1;
    }
    if (b.path === '/') {
      return /\/:/.test(a.path) ? 1 : -1;
    }

    const aParts = a.path.split('/');
    const bParts = b.path.split('/');

    let compareVal = 0;
    for (let i = 0; i < aParts.length; i++) {
      if (compareVal !== 0) {
        break;
      }

      const aRank = aParts[i].includes(':') ? 1 : 0;
      const bRank = bParts[i].includes(':') ? 1 : 0;
      compareVal = aRank - bRank;

      // If a.length >= b.length
      if (i === bParts.length - 1 && aRank - bRank === 0) {
        compareVal =
          aParts.length === bParts.length
            ? a.path.localeCompare(b.path)
            : aParts.length - bParts.length;
      }
    }

    if (compareVal === 0) {
      // Sort by length, then alphabetically
      compareVal =
        aParts.length === bParts.length
          ? a.path.localeCompare(b.path)
          : aParts.length - bParts.length;
    }

    return compareVal;
  });

  for (const route of routes) {
    if (route.children) {
      sortRoutes(route.children);
    }
  }

  return routes;
}

/**
 * Performs a final cleanup on the routes array.
 * This is done to ease the process of finding parents of nested routes.
 */
function prepareRoutes(routes: Route[], hasParent = false) {
  for (const route of routes) {
    if (route.name) {
      route.name = route.name.replace(/-index$/, '');
    }

    if (hasParent) {
      route.path = route.path.replace(/^\//, '').replace(/\?$/, '');
    }

    if (route.children) {
      delete route.name;
      route.children = prepareRoutes(route.children, true);
    }
  }
  return routes;
}

export function stringifyRoutes(routes: Route[]) {
  return `[${routes.map(stringifyRoute).join(',\n')}]`;
}

/**
 * Creates a stringified Vue Router route definition.
 */
function stringifyRoute({ name, path, component, children }: Route): string {
  const props = [];

  if (name) {
    props.push(`name: '${name}'`);
  }

  props.push(
    `path: '${path}'`,
    `component: defineAsyncComponent(() => import('${component}'))`,
    'props: true'
  );

  if (children) {
    props.push(`children: [
      ${children.map(stringifyRoute)},\n
    ]`);
  }

  return `{${props.join(',\n')}}`.trim();
}
