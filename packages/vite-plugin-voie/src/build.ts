import type { Plugin } from 'vite';
import { MODULE_NAME } from './constants';
import { generateRoutesCode } from './generator';
import { Options } from './options';

/** The type of the elements of an array. */
type ElementType<T extends Array<any>> = T extends Array<infer R> ? R : never;
type RollupPlugin = ElementType<
  NonNullable<NonNullable<Plugin['rollupInputOptions']>['pluginsPreBuild']>
>;

export function createRollupPlugin(options: Options): RollupPlugin {
  return {
    name: 'voie',
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
  };
}
