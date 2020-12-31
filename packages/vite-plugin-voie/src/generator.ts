import path from 'path';
import { Options } from './options';
import { resolve } from './resolver';
import { buildRoutes, stringifyRoutes } from './routes';

/**
 * Generates a string containing code that exports
 * a `routes` array that is compatible with Vue Router.
 */
export async function generateRoutesCode(options: Options) {
  const { root, pagesDir, extensions, extendRoute } = options;
  const dir = path.join(root, pagesDir);
  const files = await resolve(dir, extensions);
  const routes = buildRoutes({ files, dir, extensions, root, extendRoute });
  return stringifyRoutes(routes, options);
}
