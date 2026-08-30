import type { ReactNode } from 'react';
import styles from './PortfolioHome.module.css';

const PROJECTS = {
  go: { id: '01', name: 'Link Shortener', url: 'go.snkisk.com', href: 'https://go.snkisk.com/', copy: 'ひとつのリンクを、迷わない入口に変える。必要な案内へ最短でつなぐ小さな基盤。' },
  lmp: { id: '02', name: 'MirrorProxy / Legitils', url: 'lmp.snkisk.com', href: 'https://lmp.snkisk.com/', copy: 'Minecraft の世界を観察し、プレイヤーが安心して遊べる状況を見える形にする。' },
  minecraft: { id: '03', name: 'Minecraft Production', url: 'mc.snkisk.com', href: 'https://mc.snkisk.com/', copy: 'ゲームの中で起きることを、体験・映像・仕組みのすべてから組み立てる制作ライン。' },
  hensyoku: { id: '04', name: '偏食メイト', url: 'hensyoku-mate.snkisk.com', href: 'https://hensyoku-mate.snkisk.com/', copy: '食べられるものを起点に、今日のごはんを選びやすくするiPhoneアプリ。' },
};

const HENSYOKU_DESKTOP_SCREENS = [
  { src: 'https://images.snkisk.com/hensyoku-mate.snkisk.com/images/a451e9e76fb5d3c6448eb143c27acf1a1427786d3aa6253206e509d67c7672cb.png', alt: '偏食メイトのパレット画面', label: 'PALETTE' },
  { src: 'https://images.snkisk.com/hensyoku-mate.snkisk.com/images/11cc5b4f60cce7e43544df74ca6ff1b90bc1ddb19525aa77e56dc1d478a6e67f.png', alt: '偏食メイトの検索条件画面', label: 'SEARCH CONDITIONS' },
  { src: 'https://images.snkisk.com/hensyoku-mate.snkisk.com/images/0434b107639ae9af135f19f408050d97e3775c5510081cc21e8e2cdc8e7f4327.png', alt: '偏食メイトの候補一覧画面', label: 'CANDIDATES' },
  { src: 'https://images.snkisk.com/hensyoku-mate.snkisk.com/images/6ca361f2e60fc21b74094d7f5042c69b460f44a5e6c8f16ecead70e8377da735.png', alt: '偏食メイトのログイン・登録画面', label: 'LOGIN / SIGNUP' },
] as const;

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return <a className={styles.projectLink} href={href} target="_blank" rel="noreferrer">{children}<span aria-hidden="true">↗</span></a>;
}

export default function PortfolioHome() {
  return (
    <main className={styles.site} aria-label="snkisk project introduction">
      <header className={styles.siteHeader}>
        <a className={styles.wordmark} href="#top" aria-label="ページ先頭へ">snkisk</a>
        <a className={styles.headerJump} href="#projects">PROJECT INDEX <span aria-hidden="true">↓</span></a>
      </header>

      <section className={styles.hero} id="top" aria-labelledby="portfolio-title">
        <p className={styles.eyebrow}>SELECTED WORK / 2026</p>
        <h1 id="portfolio-title">BEYOND<br />THE FRAME.</h1>
        <div className={styles.heroFoot}>
          <p>フレームの外まで使い心地をつくる、プロダクトとゲームの記録。</p>
          <a className={styles.heroScroll} href="#projects">VIEW PROJECTS <span aria-hidden="true">↓</span></a>
        </div>
        <div className={styles.heroGlow} aria-hidden="true" />
      </section>

      <div className={styles.projectIndex} id="projects" aria-label="プロジェクト一覧"><span>PROJECT INDEX</span><span>04 SELECTED WORKS</span></div>

      <section className={`${styles.projectSection} ${styles.goSection}`} aria-labelledby="go-title">
        <div className={styles.sectionNumber}>{PROJECTS.go.id}</div>
        <div className={styles.goVisual} aria-hidden="true"><i /><i /><i /><b>ONE LINK</b></div>
        <div className={styles.sectionContent}>
          <p className={styles.sectionKicker}>ROUTE / IDENTITY / HANDOFF</p><h2 id="go-title">{PROJECTS.go.name}</h2><p className={styles.projectCopy}>{PROJECTS.go.copy}</p><ExternalLink href={PROJECTS.go.href}>{PROJECTS.go.url}</ExternalLink>
        </div>
      </section>

      <section className={`${styles.projectSection} ${styles.lmpSection}`} aria-labelledby="lmp-title">
        <div className={styles.lmpGrid} aria-hidden="true" /><div className={styles.lmpSignal} aria-hidden="true"><i /><i /><i /><b>OBSERVE</b></div><div className={styles.sectionNumber}>{PROJECTS.lmp.id}</div>
        <div className={styles.sectionContent}>
          <p className={styles.sectionKicker}>SIGNAL / OBSERVATION / PLAY</p><h2 id="lmp-title">MirrorProxy<br /><em>/ Legitils</em></h2><p className={styles.projectCopy}>{PROJECTS.lmp.copy}</p><ExternalLink href={PROJECTS.lmp.href}>{PROJECTS.lmp.url}</ExternalLink>
        </div>
      </section>

      <section className={`${styles.projectSection} ${styles.minecraftSection}`} aria-labelledby="minecraft-title">
        <div className={styles.sectionNumber}>{PROJECTS.minecraft.id}</div><div className={styles.minecraftBlocks} aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} />)}</div>
        <div className={styles.sectionContent}>
          <p className={styles.sectionKicker}>WORLD / SYSTEM / PRODUCTION</p><h2 id="minecraft-title">MINECRAFT<br />PRODUCTION</h2><p className={styles.projectCopy}>{PROJECTS.minecraft.copy}</p><ExternalLink href={PROJECTS.minecraft.href}>{PROJECTS.minecraft.url}</ExternalLink>
        </div><p className={styles.minecraftCaption}>BUILD THE MOMENT<br />NOT JUST THE MAP.</p>
      </section>

      <section className={`${styles.projectSection} ${styles.hensyokuSection}`} aria-labelledby="hensyoku-title">
        <div className={styles.sectionNumber}>{PROJECTS.hensyoku.id}</div>
        <div className={styles.hensyokuIntro}><p className={styles.sectionKicker}>FOOD / CONDITIONS / TOGETHER</p><h2 id="hensyoku-title">偏食、<br /><em>治さなくていい。</em></h2><p className={styles.projectCopy}>{PROJECTS.hensyoku.copy}</p><ExternalLink href={PROJECTS.hensyoku.href}>{PROJECTS.hensyoku.url}</ExternalLink></div>
        <div className={styles.screenGallery} aria-label="偏食メイトのリリース済み画面">
          {HENSYOKU_DESKTOP_SCREENS.map((screen) => <figure className={styles.screenCard} key={screen.label}><img src={screen.src} alt={screen.alt} /><figcaption>{screen.label}</figcaption></figure>)}
        </div>
        <p className={styles.hensyokuNotice}>候補は参考情報です。アレルギーなど安全に関わる内容は提供元・店舗で確認します。</p>
      </section>

      <footer className={styles.footer}><p>snkisk / selected work</p><a href="#top">BACK TO TOP <span aria-hidden="true">↑</span></a></footer>
    </main>
  );
}
