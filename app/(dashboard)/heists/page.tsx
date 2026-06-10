"use client"

import { useHeists } from "@/hooks/useHeists"
import HeistCard from "@/components/HeistCard"
import HeistCardSkeleton from "@/components/HeistCardSkeleton"
import styles from "./heists.module.css"

const SKELETON_COUNT = 6

function HeistSection({ title, filter }: { title: string; filter: "active" | "assigned" }) {
  const { heists, loading } = useHeists(filter)

  return (
    <section>
      <h2>{title}</h2>
      <div className={styles.grid}>
        {loading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => <HeistCardSkeleton key={i} />)
          : heists.length === 0
            ? <p className={styles.empty}>No {title.toLowerCase()} right now.</p>
            : heists.map(h => <HeistCard key={h.id} heist={h} />)
        }
      </div>
    </section>
  )
}

export default function HeistsPage() {
  return (
    <div className="page-content">
      <HeistSection title="Active Heists" filter="active" />
      <HeistSection title="Heists You&apos;ve Assigned" filter="assigned" />
    </div>
  )
}
