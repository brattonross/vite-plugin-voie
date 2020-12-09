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
  /**
   * Import routes directly or as async components
   * @default 'async'
   */
  importMode: ImportMode | ImportModeResolveFn;
  /**
   * Array of file paths for page components.
   */
  files?: string[];
}

export type ImportMode = 'sync' | 'async';
export type ImportModeResolveFn = (filepath: string) => ImportMode;

export type UserOptions = Partial<Options>;
