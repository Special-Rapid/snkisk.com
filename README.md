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

## ライセンス

MIT License。詳細は [LICENSE](./LICENSE) を参照してください。
