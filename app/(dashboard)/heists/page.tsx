"use client"

import { useHeists } from "@/hooks/useHeists"

export default function HeistsPage() {
  const { heists: active } = useHeists("active")
  const { heists: assigned } = useHeists("assigned")
  const { heists: expired } = useHeists("expired")

  return (
    <div className="page-content">
      <div className="active-heists">
        <h2>Your Active Heists</h2>
        <ul>
          {active.map(h => <li key={h.id}>{h.title}</li>)}
        </ul>
      </div>
      <div className="assigned-heists">
        <h2>Heists You&apos;ve Assigned</h2>
        <ul>
          {assigned.map(h => <li key={h.id}>{h.title}</li>)}
        </ul>
      </div>
      <div className="expired-heists">
        <h2>All Expired Heists</h2>
        <ul>
          {expired.map(h => <li key={h.id}>{h.title}</li>)}
        </ul>
      </div>
    </div>
  )
}
