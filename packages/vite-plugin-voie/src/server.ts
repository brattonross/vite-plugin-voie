import type { ServerPlugin } from 'vite';
import { generateRoutesCode, MODULE_NAME } from './pages';
import { Options } from './options';

export function createServerPlugin(options: Options): ServerPlugin {
  return ({ app }) => {
    app.use(async (ctx, next) => {
      if (
        ctx.path === `/@modules/${MODULE_NAME}` ||
        ctx.path === `/@modules/${MODULE_NAME}/index.js`
      ) {
        ctx.body = await generateRoutesCode(options);
        ctx.type = 'js';
        ctx.status = 200;
        return;
      }

      await next();
    });
  };
}
