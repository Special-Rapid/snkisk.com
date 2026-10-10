# snkisk.com

[snkisk.com](https://snkisk.com/) のモーション主導ポートフォリオサイトです。Web の小さな基盤、Minecraft 関連の制作、偏食メイトなど、プロダクトとゲーム制作を紹介します。

## 技術

- React 18
- TypeScript
- Vite
- Motion
- Cloudflare Pages

## ローカルで起動する

Node.js を用意してから、依存関係をインストールし開発サーバーを起動します。

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

生成物は `dist/` に出力されます。

## デプロイ

Cloudflare Pages へデプロイするには、Cloudflare に認証済みの環境で次を実行します。

```bash
npm run deploy:pages
```

## 配信用画像

Minecraft紹介画像はmc.snkisk.comと同じ軽量WebPを`images.snkisk.com`から共用します。repoに配信コピーは置かず、`public/media/sources.json`の`cdnUrl`が配信先です。`file`は移行前のWebP名の履歴で、元PNGのURL・SHA-256・寸法・容量とWebP変換条件も保持します。巨大PNGへの差し戻しは行いません。

公開buildでは、`vite.config.ts` の `publishedFiles` に列挙した公開ファイルだけを `public/` から出力します。新しい公開ファイルは用途を確認してこの一覧に追加し、`.gitignore` でもそのファイルと必要な親ディレクトリを公開対象として除外解除します。`git check-ignore` とstage内容で追跡されることを確認し、公開一覧・ignore規則・ファイル本体を同じcommitに含めます。ローカルの未追跡ファイルや `docs/` の私有作業資料を無条件でコピーしません。製品画像のCDN配信と意図した公開仕様は維持します。

## ライセンス

MIT License。詳細は [LICENSE](./LICENSE) を参照してください。
