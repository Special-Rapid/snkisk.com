export const copy = {
  ja: {
    title: 'Go → Legitils', preview: 'モーション試作', pause: '一時停止', resume: '再生する',
    replay: 'もう一度見る', skip: '一覧へ進む', directory: 'プロジェクト一覧',
    theme: 'テーマ', system: 'システム', light: 'ライト', dark: 'ダーク', language: '言語',
    site: 'サイト全体を見る', running: '再生中', paused: '一時停止中', ended: '再生完了',
    reduced: '動きを減らして表示中', staticView: '静止表示', go: 'Go / Link Shortener', legitils: 'Legitils',
    minecraft: 'Minecraft Production', hensyoku: '偏食メイト',
  },
  en: {
    title: 'Go → Legitils', preview: 'Motion study', pause: 'Pause', resume: 'Resume',
    replay: 'Replay', skip: 'Skip to projects', directory: 'Project index',
    theme: 'Theme', system: 'System', light: 'Light', dark: 'Dark', language: 'Language',
    site: 'Explore the full site', running: 'Playing', paused: 'Paused', ended: 'Finished',
    reduced: 'Reduced motion', staticView: 'Static view', go: 'Go / Link Shortener', legitils: 'Legitils',
    minecraft: 'Minecraft Production', hensyoku: 'Hensyoku Mate',
  },
} as const;
export type Locale = keyof typeof copy;
export function resolveLocale(language: string): Locale {
  if (language === 'ja' || language === 'en') return language;
  const base = language.toLowerCase().split('-')[0];
  return base === 'en' ? 'en' : 'ja';
}
