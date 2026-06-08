"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { generateCodename } from "@/lib/codename"
import styles from "./AuthForm.module.css"

interface AuthFormProps {
  type: "login" | "signup"
}

const ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/invalid-email": "Please enter a valid email address.",
}

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isLogin = type === "login"
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (isLogin) {
      console.log({ email, password })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log("1. creating user...")
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      console.log("2. user created:", user.uid)
      const codename = generateCodename()
      await updateProfile(user, { displayName: codename })
      console.log("3. profile updated, codename:", codename)
      await setDoc(doc(db, "users", user.uid), { id: user.uid, codename })
      console.log("4. firestore doc created")
      router.push("/heists")
    } catch (err: unknown) {
      console.error("Signup error:", err)
      const code = (err as { code?: string }).code ?? ""
      setError(ERROR_MESSAGES[code] ?? "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label={isLogin ? "Log in" : "Sign up"}>
      <h2 className="form-title">{isLogin ? "Log in to Your Account" : "Create an Account"}</h2>

      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Password</label>
        <div className={styles.passwordWrapper}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {error && (
        <p className={styles.error} aria-live="polite">{error}</p>
      )}

      <button type="submit" className={styles.submit} disabled={isLoading}>
        {!isLogin && isLoading ? "Signing up…" : isLogin ? "Log in" : "Sign up"}
      </button>

      <p className={styles.switch}>
        {isLogin ? (
          <>Don&apos;t have an account? <Link href="/signup">Sign up</Link></>
        ) : (
          <>Already have an account? <Link href="/login">Log in</Link></>
        )}
      </p>
    </form>
  )
}
