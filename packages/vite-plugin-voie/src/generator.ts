import path from 'path';
import { Options } from './options';
import { resolve } from './resolver';
import { buildRoutes, stringifyRoutes } from './routes';

/**
 * Generates a string containing code that exports
 * a `routes` array that is compatible with Vue Router.
 */
export async function generateRoutesCode(options: Options) {
  const { root, pagesDir, exclude, extensions, extendRoute } = options;
  const dir = normalizePath(path.join(root, pagesDir));
  const files = await resolve({ dir, extensions, exclude });

  const normalizedRoot = normalizePath(root);
  const routes = buildRoutes({
    files,
    dir,
    extensions,
    root: normalizedRoot,
    extendRoute,
  });

  return stringifyRoutes(routes, options);
}

/**
 * Normalizes a path to use forward slashes.
 */
function normalizePath(str: string): string {
  return str.replace(/\\/g, '/');
}
