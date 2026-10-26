import type { ReactNode } from 'react';
import { copy, type Locale } from './motion-led/copy';
import styles from './PortfolioHome.module.css';

const PROJECTS = {
  go: { id: '01', name: 'Link Shortener', url: 'go.snkisk.com', href: 'https://go.snkisk.com/', copy: 'ひとつのリンクを、迷わない入口に変える。必要な案内へ最短でつなぐ小さな基盤。' },
  legitils: { id: '02', name: 'Legitils', url: 'lmp.snkisk.com', href: 'https://lmp.snkisk.com/', copy: 'Minecraft の世界を観察し、プレイヤーが安心して遊べる状況を見える形にする。' },
  minecraft: { id: '03', name: 'Minecraft Production', url: 'mc.snkisk.com', href: 'https://mc.snkisk.com/', copy: 'ゲームの中で起きることを、体験・映像・仕組みのすべてから組み立てる制作ライン。' },
  hensyoku: { id: '04', name: '偏食メイト', url: 'hensyoku-mate.snkisk.com', href: 'https://hensyoku-mate.snkisk.com/', copy: '食べられるものを起点に、今日のごはんを選びやすくするiPhoneアプリ。' },
};

const HENSYOKU_DESKTOP_SCREENS = [
  { src: 'https://images.snkisk.com/hensyoku-mate.snkisk.com/images/a451e9e76fb5d3c6448eb143c27acf1a1427786d3aa6253206e509d67c7672cb.png', alt: '偏食メイトのパレット画面', label: 'PALETTE' },
  { src: 'https://images.snkisk.com/hensyoku-mate.snkisk.com/images/11cc5b4f60cce7e43544df74ca6ff1b90bc1ddb19525aa77e56dc1d478a6e67f.png', alt: '偏食メイトの検索条件画面', label: 'SEARCH CONDITIONS' },
  { src: 'https://images.snkisk.com/hensyoku-mate.snkisk.com/images/0434b107639ae9af135f19f408050d97e3775c5510081cc21e8e2cdc8e7f4327.png', alt: '偏食メイトの候補一覧画面', label: 'CANDIDATES' },
  { src: 'https://images.snkisk.com/hensyoku-mate.snkisk.com/images/6ca361f2e60fc21b74094d7f5042c69b460f44a5e6c8f16ecead70e8377da735.png', alt: '偏食メイトのログイン・登録画面', label: 'LOGIN / SIGNUP' },
] as const;

const PROJECT_MEDIA = {
  go: {
    src: 'https://images.snkisk.com/snkisk.com/images/617c589a678d1b7a2c3c29b66200c063922dfd97d17779b683d58b44e2484843.jpg',
    alt: 'go.snkisk.comの短縮URL作成画面',
    label: 'LIVE URL CREATOR',
  },
  legitils: {
    src: 'https://images.snkisk.com/lmp.snkisk.com/images/fb02ffbc-41f8-4a01-bc65-27d7765983f8.png',
    alt: 'Legitilsの公式ロゴと開発プレビュー',
    label: 'OFFICIAL DEVELOPMENT PREVIEW',
  },
  minecraft: {
    src: 'https://images.snkisk.com/WebD_Minecraft_Site/images/76f18dce-d165-40f5-89ec-1b2ba4bd061f.webp',
    alt: 'Minecraft Productionの公式サイトに掲載されているゲーム内風景',
    label: 'IN-GAME WORLD',
  },
} as const;

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return <a className={styles.projectLink} href={href} target="_blank" rel="noreferrer">{children}<span aria-hidden="true">↗</span></a>;
}

export default function PortfolioHome({ locale }: { locale: Locale }) {
  const text = copy[locale];
  return (
    <div className={styles.site}>
      <header className={styles.siteHeader}>
        <a className={styles.wordmark} href="#top" aria-label={text.top}>snkisk</a>
        <a className={styles.headerJump} href="#projects">PROJECT INDEX <span aria-hidden="true">↓</span></a>
      </header>

      <section className={styles.hero} id="top" aria-labelledby="portfolio-title">
        <p className={styles.eyebrow}>SELECTED WORK / 2026</p>
        <h1 id="portfolio-title">BEYOND<br />THE FRAME.</h1>
        <div className={styles.heroFoot}>
          <p>{text.tagline}</p>
          <a className={styles.heroScroll} href="#projects">VIEW PROJECTS <span aria-hidden="true">↓</span></a>
        </div>
        <div className={styles.heroGlow} aria-hidden="true" />
      </section>

      <div className={styles.projectIndex} id="projects" tabIndex={-1} aria-label={text.index}><span>{text.index}</span><span>04 SELECTED WORKS</span></div>

      <section className={`${styles.projectSection} ${styles.goSection}`} aria-labelledby="go-title">
        <div className={styles.sectionNumber}>{PROJECTS.go.id}</div>
        <figure className={styles.projectMedia}>
          <img src={PROJECT_MEDIA.go.src} alt={text.goAlt} />
          <figcaption>{PROJECT_MEDIA.go.label}</figcaption>
        </figure>
        <div className={styles.sectionContent}>
          <p className={styles.sectionKicker}>ROUTE / IDENTITY / HANDOFF</p><h2 id="go-title" tabIndex={-1}>{PROJECTS.go.name}</h2><p className={styles.projectCopy}>{text.goCopy}</p><ExternalLink href={PROJECTS.go.href}>{PROJECTS.go.url}</ExternalLink>
        </div>
      </section>

      <section className={`${styles.projectSection} ${styles.legitilsSection}`} aria-labelledby="legitils-title">
        <div className={styles.sectionNumber}>{PROJECTS.legitils.id}</div>
        <figure className={styles.projectMedia}>
          <img src={PROJECT_MEDIA.legitils.src} alt={text.legitilsAlt} />
          <figcaption>{PROJECT_MEDIA.legitils.label}</figcaption>
        </figure>
        <div className={styles.sectionContent}>
          <p className={styles.sectionKicker}>SIGNAL / OBSERVATION / PLAY</p><h2 id="legitils-title" tabIndex={-1}>{PROJECTS.legitils.name}</h2><p className={styles.projectCopy}>{text.legitilsCopy}</p><ExternalLink href={PROJECTS.legitils.href}>{PROJECTS.legitils.url}</ExternalLink>
        </div>
      </section>

      <section className={`${styles.projectSection} ${styles.minecraftSection}`} aria-labelledby="minecraft-title">
        <div className={styles.sectionNumber}>{PROJECTS.minecraft.id}</div>
        <figure className={styles.projectMedia}>
          <img src={PROJECT_MEDIA.minecraft.src} alt={text.minecraftAlt} />
          <figcaption>{PROJECT_MEDIA.minecraft.label}</figcaption>
        </figure>
        <div className={styles.sectionContent}>
          <p className={styles.sectionKicker}>WORLD / SYSTEM / PRODUCTION</p><h2 id="minecraft-title" tabIndex={-1}>MINECRAFT<br />PRODUCTION</h2><p className={styles.projectCopy}>{text.minecraftCopy}</p><ExternalLink href={PROJECTS.minecraft.href}>{PROJECTS.minecraft.url}</ExternalLink>
        </div>
      </section>

      <section className={`${styles.projectSection} ${styles.hensyokuSection}`} aria-labelledby="hensyoku-title">
        <div className={styles.sectionNumber}>{PROJECTS.hensyoku.id}</div>
        <div className={styles.hensyokuIntro}><p className={styles.sectionKicker}>FOOD / CONDITIONS / TOGETHER</p><h2 id="hensyoku-title" tabIndex={-1}>{text.hensyokuTitle}<br /><em>{text.hensyokuEm}</em></h2><p className={styles.projectCopy}>{text.hensyokuCopy}</p><ExternalLink href={PROJECTS.hensyoku.href}>{PROJECTS.hensyoku.url}</ExternalLink></div>
        <div className={styles.screenGallery} aria-label={text.gallery}>
          {HENSYOKU_DESKTOP_SCREENS.map((screen, index) => <figure className={styles.screenCard} key={screen.label}><img src={screen.src} alt={text.screenAlts[index]} /><figcaption>{screen.label}</figcaption></figure>)}
        </div>
        <p className={styles.hensyokuNotice}>{text.notice}</p>
      </section>

      <footer className={styles.footer}><p>snkisk / selected work</p><a href="#top">{text.back} <span aria-hidden="true">↑</span></a></footer>
    </div>
  );
}
