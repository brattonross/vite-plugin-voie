import fg from 'fast-glob';

/**
 * Searches the given directory (and subdirectories) for any files that qualify as a page.
 * @param dir The directory to search.
 * @param extensions Valid page file extensions.
 */
export async function resolve(
  dir: string,
  extensions: string[]
): Promise<string[]> {
  return await fg(`${dir}/**/*.{${extensions.join(',')}}`, {
    ignore: ['node_modules', '.git'],
    onlyFiles: true,
  });
}
