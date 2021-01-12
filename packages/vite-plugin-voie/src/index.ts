import type { Plugin } from 'vite';
import { MODULE_NAME } from './constants';
import { generateRoutesCode } from './generator';
import { Options, UserOptions } from './options';

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
  
  const pagesRootDir = resolve(options.root, options.pagesDir);

  return {
    name: 'voie',
    enforce: 'pre',
    configResolved(config) {
      options.root = config.root;
    },
    resolveId(source) {
      if (source === MODULE_NAME) {
        return source;
      }
      return null;
    },
    async load(id) {
      if (id === MODULE_NAME) {
        return await generateRoutesCode(options);
      }
      return null;
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(pagesRootDir)) {
        const { moduleGraph } = server;
        const module = moduleGraph.getModuleById(MODULE_NAME);
      
        return [module];
      }
      return [];
    },
  };
}

export { Options, UserOptions };
export default createPlugin;
