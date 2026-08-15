# Cinematic Transition Study

18秒・1920×1080・30fpsのRemotion映像です。既存のポートフォリオ5案件を、UIの細かな浮遊ではなく、フレーム全体のカメラ移動と奥行きのあるオブジェクトで接続します。

## Run

```bash
cd video
npm install
npm run dev
```

## Verify and render

```bash
npm run lint
npx remotion still CinematicTransitionStudy out/still-links.png --frame=48
npx remotion still CinematicTransitionStudy out/still-proxy.png --frame=264
npx remotion still CinematicTransitionStudy out/still-hensyoku.png --frame=480
npx remotion render CinematicTransitionStudy out/cinematic-transition-study.mp4
```

All video-specific source and render outputs are kept in this `video/` directory.
