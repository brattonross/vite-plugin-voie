import type { Plugin } from 'vite';
import { generateRoutesCode } from './pages';

/** The type of the elements of an array. */
type ElementType<T extends Array<any>> = T extends Array<infer R> ? R : never;
type RollupPlugin = ElementType<
  NonNullable<NonNullable<Plugin['rollupInputOptions']>['plugins']>
>;

interface Options {
  pagesDir: string;
  supportedExtensions: string[];
}

export function createRollupPlugin({
  pagesDir,
  supportedExtensions,
}: Options): RollupPlugin {
  return {
    name: 'voie',
    resolveId(source) {
      if (source === '/@voie/pages') {
        return source;
      }
      return null;
    },
    async load(id) {
      if (id === '/@voie/pages') {
        return await generateRoutesCode({ pagesDir, supportedExtensions });
      }
      return null;
    },
  };
}
