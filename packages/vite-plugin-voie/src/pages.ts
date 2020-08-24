import fg from 'fast-glob';
import { buildRoutes, stringifyRoutes } from './routes';

export const MODULE_NAME = 'voie-pages';

/**
 * Generates a string containing code that exports
 * a `routes` array that is compatible with Vue Router.
 */
export async function generateRoutesCode({
  pagesDir,
  supportedExtensions,
}: {
  pagesDir: string;
  supportedExtensions: string[];
}) {
  const files = await resolveFiles(pagesDir, supportedExtensions);
  const routes = buildRoutes(files, pagesDir, supportedExtensions);
  const stringifiedRoutes = stringifyRoutes(routes);

  return `import { defineAsyncComponent } from 'vue';
export default ${stringifiedRoutes};`.trim();
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
