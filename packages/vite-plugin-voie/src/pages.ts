import fg from 'fast-glob';
import path from 'path';
import { Options } from './options';
import { buildRoutes, stringifyRoutes } from './routes';

export const MODULE_NAME = 'voie-pages';

/**
 * Generates a string containing code that exports
 * a `routes` array that is compatible with Vue Router.
 */
export async function generateRoutesCode(options: Options) {
  const { root, pagesDir, extensions, extendRoute } = options;
  const dir = path.join(root, pagesDir);
  const files = await resolveFiles(dir, extensions);
  const routes = buildRoutes({ files, dir, extensions, root, extendRoute });
  return stringifyRoutes(routes, options);
}

/**
 * Searches the given directory (and subdirectories) for any files that qualify as a page.
 * @param dir The directory to search.
 * @param extensions Valid page file extensions.
 */
async function resolveFiles(
  dir: string,
  extensions: string[]
): Promise<string[]> {
  return await fg(`${dir}/**/*.{${extensions.join(',')}}`, {
    ignore: ['node_modules', '.git'],
    onlyFiles: true,
  });
}
