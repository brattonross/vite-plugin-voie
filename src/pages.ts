import Glob from 'glob';
import pify from 'pify';

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

  // TODO: Create routes based on file path and sort.
  // Nested routes: When there is a .vue file with the same name as a directory,
  // any components in the directory should be mapped to children of the parent route.
  // Sort Order: /static, /index, /:dynamic
  // Match exact route before index: /login before /index/_slug
  const routes = files.map((filePath) =>
    createRoute(filePath, pagesDir, supportedExtensions)
  );

  return `import { defineAsyncComponent } from 'vue';
export default [${routes}];`.trim();
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

/**
 * Creates a stringified Vue Router route definition.
 * @param filePath The path of the component.
 * @param pagesDir The pages directory.
 * @param extensions List of valid page file extensions.
 */
function createRoute(filePath: string, pagesDir: string, extensions: string[]) {
  console.log('create route for', filePath);
  const filename = filePath.split('/').slice(-1).join('');
  const name = filename
    .replace(new RegExp(`\\.(${extensions.join('|')})$`), '')
    .toLowerCase();
  const path = name.toUpperCase() === 'INDEX' ? '/' : `/${name}`;
  const importPath = pagesDir.replace(new RegExp(/^\.?\/+?|\/+$/g), '');

  return `{
  name: '${name}',
  path: '${path}',
  component: defineAsyncComponent(() => import('/${importPath}/${filename}')),
}`.trim();
}
