import type { Plugin } from 'vite';
import { createRollupPlugin } from './build';
import { Options, UserOptions } from './options';
import { createServerPlugin } from './server';

function createPlugin(userOptions: UserOptions = {}): Plugin {
  const options: Options = {
    root: process.cwd(),
    pagesDir: 'src/pages',
    exclude: [],
    extensions: ['vue', 'js'],
    importMode: 'async',
    extendRoute: (route) => route,
    ...userOptions,
  };

  return {
    configureServer: createServerPlugin(options),
    rollupInputOptions: {
      plugins: [createRollupPlugin(options)],
    },
  };
}

export { Options, UserOptions };
export default createPlugin;
