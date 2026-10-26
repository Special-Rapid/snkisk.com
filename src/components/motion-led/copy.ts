export type Locale = 'ja' | 'en';
export const resolveLocale = (value: string): Locale => value.toLowerCase().split('-')[0] === 'en' ? 'en' : 'ja';
export const copy = {
  ja: {
    film: 'snkiskのプロジェクト・モーショングラフィック',
    theme: 'テーマ', language: '言語', system: 'システム', light: 'ライト', dark: 'ダーク',
    pause: '一時停止', resume: '再生する', replay: 'もう一度見る', skip: '制作物を見る', skipShort: 'スキップ', skipAction: 'スキップして制作物を見る',
    running: '再生中', paused: '一時停止中', ended: '再生完了', reduced: '動きを減らして表示中',
    index: '制作物一覧', menu: 'メニュー', top: 'ページ先頭へ', back: '先頭へ戻る', selected: 'SELECTED WORK / 2026',
    tagline: 'フレームの外まで使い心地をつくる、プロダクトとゲームの記録。',
    goRole: '必要な案内へ、ひとつのリンクで。', legitilsRole: 'Minecraft のプレイを見守る。',
    minecraftRole: 'ゲームの世界を、体験にする。', hensyokuRole: '食べられるものから、ごはんを選ぶ。',
    goCopy: 'ひとつのリンクを、迷わない入口に変える。必要な案内へ最短でつなぐ小さな基盤。',
    legitilsCopy: 'Minecraft の世界を観察し、プレイヤーが安心して遊べる状況を見える形にする。',
    minecraftCopy: 'ゲームの中で起きることを、体験・映像・仕組みのすべてから組み立てる制作ライン。',
    hensyokuCopy: '食べられるものを起点に、今日のごはんを選びやすくするiPhoneアプリ。',
    hensyokuName: '偏食メイト', hensyokuTitle: '偏食、', hensyokuEm: '治さなくていい。',
    notice: '候補は参考情報です。アレルギーなど安全に関わる内容は提供元・店舗で確認します。',
    goAlt: 'go.snkisk.comの短縮URL作成画面', legitilsAlt: 'Legitilsの公式ロゴと開発プレビュー', minecraftAlt: 'Minecraft Productionのゲーム内風景',
    screenAlts: ['偏食メイトのパレット画面', '偏食メイトの検索条件画面', '偏食メイトの候補一覧画面', '偏食メイトのログイン・登録画面'],
    gallery: '偏食メイトのリリース済み画面', overview: 'プロダクトとゲームの制作物紹介',
  },
  en: {
    film: 'snkisk project motion graphics',
    theme: 'Theme', language: 'Language', system: 'System', light: 'Light', dark: 'Dark',
    pause: 'Pause', resume: 'Resume', replay: 'Replay', skip: 'View projects', skipShort: 'Skip', skipAction: 'Skip to projects',
    running: 'Playing', paused: 'Paused', ended: 'Finished', reduced: 'Reduced motion',
    index: 'Project index', menu: 'Menu', top: 'Back to top', back: 'Back to top', selected: 'SELECTED WORK / 2026',
    tagline: 'Products and games, with care for the experience beyond the frame.',
    goRole: 'One link to the right destination.', legitilsRole: 'Observe Minecraft play.',
    minecraftRole: 'Turn game worlds into experiences.', hensyokuRole: 'Choose meals from what you can eat.',
    goCopy: 'A small foundation that turns a link into a clear entry point, connecting people to the guidance they need.',
    legitilsCopy: 'Observe the Minecraft world and make conditions visible so players can enjoy a safer experience.',
    minecraftCopy: 'Build what happens in a game through experiences, video, and the systems behind them.',
    hensyokuCopy: 'An iPhone app that helps you choose today’s meal, starting with foods you can eat.',
    hensyokuName: 'Hensyoku Mate', hensyokuTitle: 'Picky eating.', hensyokuEm: 'No need to fix it.',
    notice: 'Suggestions are for reference. Check allergies and other safety information with the provider or restaurant.',
    goAlt: 'The go.snkisk.com short URL creation screen', legitilsAlt: 'Official Legitils logo and development preview', minecraftAlt: 'An in-game scene from Minecraft Production',
    screenAlts: ['Hensyoku Mate palette screen', 'Hensyoku Mate search conditions', 'Hensyoku Mate meal candidates', 'Hensyoku Mate login and sign-up'],
    gallery: 'Released Hensyoku Mate screens', overview: 'Products and games portfolio',
  },
} as const;
export type SiteCopy = (typeof copy)[Locale];

// Typography authored in the accepted English film mocks remains English in either locale.
// Utility controls, project explanations and the Hensyoku message are localized above.
export const FILM_COPY = {
  routeFirst: 'ONE LINK', routeSecond: '/ MANY WAYS', flagFirst: 'FLAG', flagSecond: 'NOW',
  buildFirst: 'BUILD', buildSecond: '/ THE NEXT', buildThird: 'BLOCK',
  legitils: 'Legitils', minecraft: 'Minecraft Production', routeAddress: 'go.snkisk.com',
} as const;
