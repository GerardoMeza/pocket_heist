"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, getDocs, getDoc, doc, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useUser } from "@/hooks/useUser"
import { CreateHeistInput, FirestoreUser } from "@/types/firestore"
import styles from "./CreateHeistForm.module.css"

function getMinDeadline(): string {
  const d = new Date()
  d.setHours(d.getHours() + 48)
  return d.toISOString().split("T")[0]
}

export default function CreateHeistForm() {
  const router = useRouter()
  const { user } = useUser()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [deadline, setDeadline] = useState("")
  const [assignableUsers, setAssignableUsers] = useState<FirestoreUser[]>([])
  const [currentUserCodename, setCurrentUserCodename] = useState("")
  const [usersLoading, setUsersLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const minDeadline = getMinDeadline()

  useEffect(() => {
    if (!user) return

    async function fetchUsers() {
      try {
        const [snapshot, currentDoc] = await Promise.all([
          getDocs(collection(db, "users")),
          getDoc(doc(db, "users", user!.uid)),
        ])
        const others = snapshot.docs
          .map(d => d.data() as FirestoreUser)
          .filter(u => u.id !== user!.uid)
        setAssignableUsers(others)
        if (currentDoc.exists()) {
          setCurrentUserCodename((currentDoc.data() as FirestoreUser).codename)
        }
      } finally {
        setUsersLoading(false)
      }
    }

    fetchUsers()
  }, [user])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    const assignedUser = assignableUsers.find(u => u.id === assignedTo)

    const payload: CreateHeistInput = {
      title,
      description,
      assignedTo,
      assignedToCodename: assignedUser?.codename ?? "",
      createdBy: user.uid,
      createdByCodename: currentUserCodename,
      deadline: new Date(deadline),
      finalStatus: null,
      createdAt: serverTimestamp(),
    }

    try {
      await addDoc(collection(db, "heists"), payload)
      router.push("/heists")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Create heist">
      <div className={styles.field}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={isLoading}
          required
          rows={3}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="assignedTo">Assign To</label>
        <select
          id="assignedTo"
          value={assignedTo}
          onChange={e => setAssignedTo(e.target.value)}
          disabled={isLoading || usersLoading}
          required
        >
          <option value="" disabled>
            {usersLoading ? "Loading crew…" : assignableUsers.length === 0 ? "No crew members available" : "Select a crew member"}
          </option>
          {assignableUsers.map(u => (
            <option key={u.id} value={u.id}>{u.codename}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="deadline">Deadline</label>
        <input
          id="deadline"
          type="date"
          value={deadline}
          min={minDeadline}
          onChange={e => setDeadline(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      {error && (
        <p className={styles.error} aria-live="polite">{error}</p>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancel}
          onClick={() => router.push("/heists")}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button type="submit" className={styles.submit} disabled={isLoading}>
          {isLoading ? "Creating…" : "Create Heist"}
        </button>
      </div>
    </form>
  )
}
