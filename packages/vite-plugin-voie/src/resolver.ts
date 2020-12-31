import fg from 'fast-glob';

export interface ResolverContext {
  /**
   * The path glob to search when resolving pages.
   */
  dir: string;
  /**
   * List of valid pages file extensions.
   */
  extensions: string[];
  /**
   * List of directories to exclude when resolving pages.
   */
  exclude: string[];
}

/**
 * Resolves the files that are valid pages for the given context.
 */
export async function resolve({
  dir,
  extensions,
  exclude,
}: ResolverContext): Promise<string[]> {
  return await fg(`${dir}/**/*.{${extensions.join(',')}}`, {
    ignore: ['node_modules', '.git', ...exclude],
    onlyFiles: true,
  });
}
