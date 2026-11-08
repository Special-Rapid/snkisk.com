[日本語](README-ja.md)

# snkisk.com

A motion-led portfolio site for [snkisk.com](https://snkisk.com/), showcasing products and game projects: small web infrastructure, Minecraft-related work, and 偏食メイト.

## Stack

- React 18
- TypeScript
- Vite
- Motion
- Cloudflare Pages

## Run locally

Use the Node.js version specified in [.node-version](.node-version), then install dependencies and start the development server.

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

This runs TypeScript type checking and the Vite build, writing the output to `dist/`. There is no dedicated `test` script.

## Deploy

To deploy to Cloudflare Pages, run the following in an environment already authenticated with Cloudflare.

```bash
npm run deploy:pages
```

## Served images

The Minecraft introduction shares the same lightweight WebP as mc.snkisk.com through `images.snkisk.com`. No serving copy is stored in this repository; `cdnUrl` in `public/media/sources.json` identifies the serving URL. The `file` field preserves the historical WebP filename from before the migration. The original PNG URL, SHA-256, dimensions, size, and WebP conversion settings are also retained. Do not revert to the large PNG.

Public builds emit only the files listed in `publishedFiles` in `vite.config.ts` from `public/`. Before adding a public file, confirm its purpose, add it to this list, and unignore the file and any required parent directories in `.gitignore`. Use `git check-ignore` and inspect the staged changes to confirm that it is tracked. Include the public-file list, ignore rules, and file itself in the same commit. Untracked local files and private working notes in `docs/` are not copied indiscriminately. CDN delivery of product images and the intended public specifications are preserved.

## Structure

- [src/](src/): React views, components, and styles.
- [public/](public/): Public static files and image source metadata.
- [vite.config.ts](vite.config.ts): Build configuration and public-file output rules.

## License

MIT License. See [LICENSE](./LICENSE) for details.
