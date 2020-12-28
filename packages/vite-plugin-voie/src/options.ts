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
   * Extend route records
   */
  extendRoute?: (route: Route, parent: Route | undefined) => Route | void;
}

export type ImportMode = 'sync' | 'async';
export type ImportModeResolveFn = (filepath: string) => ImportMode;

export type UserOptions = Partial<Options>;

export interface Route {
  name?: string;
  path: string;
  component: string;
  children?: Route[];
  meta?: Record<string, unknown>;
}