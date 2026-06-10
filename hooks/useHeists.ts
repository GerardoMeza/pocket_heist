"use client"

import { useEffect, useState } from "react"
import { collection, onSnapshot, query, Timestamp, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { heistConverter } from "@/types/firestore/converters"
import { Heist } from "@/types/firestore/heist"
import { useUser } from "@/hooks/useUser"

type HeistFilter = "active" | "assigned" | "expired"

export function useHeists(filter: HeistFilter) {
  const { user } = useUser()
  const [heists, setHeists] = useState<Heist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setHeists([])
      setLoading(false)
      return
    }

    const now = Timestamp.now()
    const ref = collection(db, "heists").withConverter(heistConverter)

    let q
    if (filter === "active") {
      q = query(ref, where("assignedTo", "==", user.uid), where("deadline", ">", now))
    } else if (filter === "assigned") {
      q = query(ref, where("createdBy", "==", user.uid), where("deadline", ">", now))
    } else {
      q = query(ref, where("deadline", "<=", now), where("finalStatus", "!=", null))
    }

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        setHeists(snapshot.docs.map(doc => doc.data()))
        setLoading(false)
      },
      err => {
        setError(err)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [filter, user?.uid])

  return { heists, loading, error }
}
