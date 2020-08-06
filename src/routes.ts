export interface Route {
  name: string;
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

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      // Remove square brackets at the start and end.
      const normalizedPart = part.replace(/^\[/, '').replace(/\]$/, '');

      if (normalizedPart !== 'index' || !route.name) {
        route.name += route.name ? `-${normalizedPart}` : normalizedPart;
      }

      if (normalizedPart === 'index' && !route.path) {
        route.path += '/';
      } else if (normalizedPart !== 'index') {
        if (/^\[.+\]$/.test(part)) {
          route.path += `/:${normalizedPart}`;
          if (i === pathParts.length - 1) {
            route.path += '?';
          }
        } else {
          route.path += `/${normalizedPart}`;
        }
      }
    }

    routes.push(route);
  }

  return routes;
}

/**
 * Creates a stringified Vue Router route definition.
 */
function stringifyRoute({ name, path, component }: Route) {
  return `{
  name: '${name}',
  path: '${path}',
  component: defineAsyncComponent(() => import('${component}')),
  
}`.trim();
}
