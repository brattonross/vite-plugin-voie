/**
 * Plugin options.
 */
export interface Options {
  /**
   * Vite config.
   * If you set a custom `root` in vite then you must pass it here as well.
   * @default process.cwd()
   */
  root: string;
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
   * List of path globs to exclude when resolving pages.
   */
  exclude: string[];
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

export type UserOptions = Partial<Omit<Options, 'root'>>;

export interface Route {
  name?: string;
  path: string;
  component: string;
  children?: Route[];
  meta?: Record<string, unknown>;
}
