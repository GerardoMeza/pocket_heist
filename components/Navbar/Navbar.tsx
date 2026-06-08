"use client"

import { Clock8 } from "lucide-react"
import Link from "next/link"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useUser } from "@/hooks/useUser"
import styles from "./Navbar.module.css"

export default function Navbar() {
  const { user } = useUser()

  async function handleLogout() {
    await signOut(auth)
  }

  return (
    <div className={styles.siteNav}>
      <nav>
        <header>
          <h1>
            <Link href="/heists" className={styles.logoLink}>
              P<Clock8 className={styles.logo} size={14} strokeWidth={2.75} />
              cket Heist
            </Link>
          </h1>
          <div>Tiny missions. Big office mischief.</div>
        </header>
        <ul>
          <li>
            <Link href="/heists/create" className={styles.ctaButton}>Create Heist</Link>
          </li>
          {user && (
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>Log Out</button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}
