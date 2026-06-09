import styles from "./Loader.module.css"

export default function Loader() {
  return (
    <div className={styles.wrapper}>
      <span className={styles.dot} />
    </div>
  )
}
