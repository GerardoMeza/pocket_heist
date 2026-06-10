import Link from "next/link"
import { User, CalendarClock } from "lucide-react"
import { Heist } from "@/types/firestore/heist"
import styles from "./HeistCard.module.css"

interface Props {
  heist: Heist
}

function formatDeadline(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function HeistCard({ heist }: Props) {
  return (
    <article className={styles.card}>
      <Link href={`/heists/${heist.id}`} className={styles.title}>
        <h3>{heist.title}</h3>
      </Link>
      <ul className={styles.meta}>
        <li>
          <User size={12} />
          <span className={styles.label}>To:</span>
          <span className={styles.target}>{heist.assignedToCodename}</span>
        </li>
        <li>
          <User size={12} />
          <span className={styles.label}>By:</span>
          <span className={styles.creator}>{heist.createdByCodename}</span>
        </li>
        <li>
          <CalendarClock size={12} />
          <span className={styles.label}>{formatDeadline(heist.deadline)}</span>
        </li>
      </ul>
    </article>
  )
}
