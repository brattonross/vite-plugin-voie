import globToRegexp from 'glob-to-regexp';
import { ImportMode, ImportModeResolveFn, Options, Route } from './options';

export interface BuildRoutesContext {
  files: string[];
  dir: string;
  extensions: string[];
  root: string;
  extendRoute?: Options['extendRoute'];
}

export function buildRoutes({
  files,
  dir,
  extensions,
  root,
  extendRoute,
}: BuildRoutesContext) {
  const routes: Route[] = [];

  for (const file of files) {
    const re = String(globToRegexp(dir, { extended: true })).slice(1, -2);
    const pathParts = file
      .replace(new RegExp(re), '')
      .replace(new RegExp(`\\.(${extensions.join('|')})$`), '')
      .split('/')
      .slice(1); // removing the pagesDir means that the path begins with a '/'

    const component = file.replace(root, '');
    const route: Route = {
      name: '',
      path: '',
      component: component.startsWith('/') ? component : `/${component}`,
    };

    let parent = routes;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      // Remove square brackets at the start and end.
      const isDynamicPart = isDynamicRoute(part);
      const normalizedPart = (isDynamicPart
        ? part.replace(/^\[(\.{3})?/, '').replace(/\]$/, '')
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

          // Catch-all route
          if (/^\[\.{3}/.test(part)) {
            route.path += '(.*)';
          } else if (i === pathParts.length - 1) {
            route.path += '?';
          }
        } else {
          route.path += `/${normalizedPart}`;
        }
      }
    }

    parent.push(route);
  }

  return prepareRoutes(routes, extendRoute);
}

const isDynamicRoute = (s: string) => /^\[.+\]$/.test(s);

/**
 * Performs a final cleanup on the routes array.
 * This is done to ease the process of finding parents of nested routes.
 */
function prepareRoutes(
  routes: Route[],
  extendRoute: Options['extendRoute'],
  parent?: Route
) {
  for (const route of routes) {
    if (route.name) {
      route.name = route.name.replace(/-index$/, '');
    }

    if (parent) {
      route.path = route.path.replace(/^\//, '').replace(/\?$/, '');
    }

    if (route.children) {
      delete route.name;
      route.children = prepareRoutes(route.children, extendRoute, route);
    }

    if (typeof extendRoute === 'function') {
      Object.assign(route, extendRoute(route, parent) || {});
    }
  }
  return routes;
}

function resolveImportMode(
  filepath: string,
  mode: ImportMode | ImportModeResolveFn
) {
  if (typeof mode === 'function') {
    return mode(filepath);
  }
  return mode;
}

function pathToName(filepath: string) {
  return filepath.replace(/[\_\.\-\\\/]/g, '_').replace(/[\[:\]()]/g, '$');
}

export function stringifyRoutes(routes: Route[], options: Options) {
  const imports: string[] = [];

  const routesCode = routes
    .map((route) => stringifyRoute(imports, route, options))
    .join(',\n');

  return `${imports.join(';\n')}

export default [${routesCode}];`.trim();
}

/**
 * Creates a stringified Vue Router route definition.
 */
function stringifyRoute(
  imports: string[],
  { name, path, component, children, meta }: Route,
  options: Options
): string {
  const props = [];

  if (name) {
    props.push(`name: '${name}'`);
  }

  props.push(`path: '${path}'`);
  props.push('props: true');

  const mode = resolveImportMode(component, options.importMode);
  if (mode === 'sync') {
    const importName = pathToName(component);
    imports.push(`import ${importName} from '${component}'`);
    props.push(`component: ${importName}`);
  } else {
    props.push(`component: () => import('${component}')`);
  }

  if (children) {
    props.push(`children: [
      ${children.map((route) => stringifyRoute(imports, route, options))},\n
    ]`);
  }

  if (meta) {
    props.push(`meta: ${JSON.stringify(meta)}`);
  }

  return `{${props.join(',\n')}}`.trim();
}
