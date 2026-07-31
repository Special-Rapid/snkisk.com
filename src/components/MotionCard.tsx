import styles from './MotionCard.module.css';

export type ProductPanelSpec = {
  badge: string;
  title: string;
  metric: string;
  rows: string[];
};

type MotionCardProps = {
  panel: ProductPanelSpec;
};

export default function MotionCard({ panel }: MotionCardProps) {
  return (
    <div className={styles.panelBody}>
      {/* The persistent object owns the panel shell; this layer stays abstract so Scene 04 still reads like a morph, not a dashboard page. */}
      <div className={styles.topRow}>
        <span className={styles.badge}>{panel.badge}</span>
        <span className={styles.metric}>{panel.metric}</span>
      </div>

      <div className={styles.graphBlock}>
        <div className={styles.headerBlock}>
          <strong className={styles.title}>{panel.title}</strong>
          <span className={styles.headerTrace}>PERSISTENT SIGNAL</span>
        </div>
        <div className={styles.graphCanvas}>
          <div className={styles.graphWash} />
          <div className={styles.graphLine} />
          <div className={styles.graphLineSecondary} />
          <div className={styles.graphSweep} />
          <div className={styles.graphAnchor} />
          <span className={styles.graphBadge}>UPLINK</span>
        </div>
      </div>

      <div className={styles.cueRail}>
        {panel.rows.map((row, index) => (
          <div className={styles.cue} key={`${row}-${index}`}>
            <span className={styles.cueDot} />
            <span className={styles.cueText}>{row}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
