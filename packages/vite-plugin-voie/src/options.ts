/**
 * Plugin options.
 */
export interface Options {
  /**
   * Relative path to the directory to search for page components.
   * @default 'src/pages'
   */
  pagesDir: string;
  /**
   * Valid file extensions for page components.
   * @default ['vue', 'js']
   */
  extensions: string[];
}

export type UserOptions = Partial<Options>;
