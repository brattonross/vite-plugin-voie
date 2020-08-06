import type { ServerPlugin } from 'vite';
import { generateRoutesCode } from './pages';

interface Options {
  pagesDir: string;
  supportedExtensions: string[];
}

export function createServerPlugin({
  pagesDir,
  supportedExtensions,
}: Options): ServerPlugin {
  return ({ app }) => {
    app.use(async (ctx, next) => {
      if (ctx.path === '/@voie/pages') {
        ctx.body = await generateRoutesCode({ pagesDir, supportedExtensions });
        ctx.type = 'js';
        ctx.status = 200;
      }

      await next();
    });
  };
}
