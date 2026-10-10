import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { lstatSync, readFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';

const publishedFiles = [
  '404.html',
  '_redirects',
  'llms.txt',
  'media/sources.json',
  'robots.txt',
  'sitemap.xml',
];

let projectRoot = '';

export default defineConfig({
  build: { copyPublicDir: false },
  plugins: [react(), {
    name: 'explicit-public-files',
    apply: 'build',
    configResolved(config) {
      projectRoot = config.root;
    },
    generateBundle() {
      const publicDirectory = resolve(projectRoot, 'public');
      const publicRoot = resolve(realpathSync(projectRoot), 'public');
      if (!lstatSync(publicDirectory).isDirectory() || realpathSync(publicDirectory) !== publicRoot) {
        throw new Error('公開ファイルの起点はproject配下の通常のpublicディレクトリである必要があります。');
      }
      for (const fileName of publishedFiles) {
        const sourcePath = resolve(projectRoot, 'public', fileName);
        if (!lstatSync(sourcePath).isFile() || realpathSync(sourcePath) !== resolve(publicRoot, fileName)) {
          throw new Error(`公開ファイルは通常のファイルである必要があります: ${fileName}`);
        }
        this.emitFile({ type: 'asset', fileName, source: readFileSync(sourcePath) });
      }
    },
  }],
});
