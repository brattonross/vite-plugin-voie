import type { Plugin } from 'vite';
import { createRollupPlugin } from './build';
import { createServerPlugin } from './server';

/**
 * Plugin options.
 */
export interface Options {
  /**
   * Relative path to the directory to search for page components.
   * @default 'src/pages'
   */
  pagesDir?: string;
  /**
   * Valid file extensions for page components.
   * @default ['vue', 'js']
   */
  extensions?: string[];
}

function createPlugin({
  pagesDir = 'src/pages',
  extensions = ['vue', 'js'],
}: Options = {}): Plugin {
  return {
    configureServer: createServerPlugin({
      pagesDir,
      supportedExtensions: extensions,
    }),
    rollupInputOptions: {
      plugins: [
        createRollupPlugin({ pagesDir, supportedExtensions: extensions }),
      ],
    },
  };
}

export default createPlugin;
