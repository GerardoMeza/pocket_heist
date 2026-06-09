import { Clock8 } from "lucide-react"
import Link from "next/link"
import styles from "./splash.module.css"

export default function Home() {
  return (
    <div className={styles.wrapper}>
      {/* Ambient background glows */}
      <div className={styles.glowPurple} />
      <div className={styles.glowPink} />

      {/* Noise grain overlay */}
      <div className={styles.grain} />

      {/* Dashed grid */}
      <div className={styles.grid} />

      <div className={styles.inner}>
        {/* Eyebrow tag */}
        <div className={styles.eyebrow}>
          <span className={styles.dot} />
          <span>Operazione in corso</span>
        </div>

        {/* Hero title */}
        <h1 className={styles.title}>
          <span className={styles.titleLine1}>
            P<Clock8 className={styles.clockIcon} strokeWidth={2.75} />cket
          </span>
          <span className={styles.titleLine2}>Heist</span>
        </h1>

        {/* Tagline */}
        <p className={styles.tagline}>
          Piccole missioni.&nbsp; Grande caos in ufficio.
        </p>

        {/* Description */}
        <p className={styles.description}>
          Assign covert micro-missions to your crew — plant a rubber duck,
          swap the coffee for decaf, claim the last donut. Every job has a
          ticking clock and a target.
        </p>

        {/* CTA */}
        <div className={styles.actions}>
          <Link href="/signup" className={styles.btnPrimary}>
            Start your first heist
          </Link>
          <Link href="/login" className={styles.btnGhost}>
            Already in the crew? Log in
          </Link>
        </div>

        {/* Footer badge */}
        <div className={styles.badge}>
          <span className={styles.badgeText}>48h</span>
          <span className={styles.badgeLabel}>per mission</span>
        </div>
      </div>
    </div>
  )
}
