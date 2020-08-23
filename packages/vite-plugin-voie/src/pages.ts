import Glob from 'glob';
import pify from 'pify';
import { Options } from './options';
import { buildRoutes, stringifyRoutes } from './routes';

export const MODULE_NAME = 'voie-pages';

/**
 * Generates a string containing code that exports
 * a `routes` array that is compatible with Vue Router.
 */
export async function generateRoutesCode(options: Options) {
  const { pagesDir, extensions } = options;
  const files = await resolveFiles(pagesDir, extensions);
  const routes = buildRoutes(files, pagesDir, extensions);
  return stringifyRoutes(routes, options);
}

const glob = pify(Glob);

/**
 * Searches the given directory (and subdirectories) for any files that qualify as a page.
 * @param dir The directory to search.
 * @param extensions Valid page file extensions.
 */
async function resolveFiles(
  dir: string,
  extensions: string[]
): Promise<string[]> {
  return await glob(`${dir}/**/*.{${extensions.join(',')}}`);
}
