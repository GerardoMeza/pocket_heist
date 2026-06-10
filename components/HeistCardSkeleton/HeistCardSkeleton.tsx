import styles from "./HeistCardSkeleton.module.css"

export default function HeistCardSkeleton() {
  return (
    <article className={styles.card} data-testid="heist-card-skeleton">
      <div className={styles.title} />
      <div className={styles.meta}>
        <div className={styles.row} />
        <div className={styles.row} />
        <div className={styles.row} />
      </div>
    </article>
  )
}
