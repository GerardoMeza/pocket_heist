# Plan: Login Form Auth

## Context
The `AuthForm` component already handles signup end-to-end with Firebase. The login branch (`type="login"`) currently just `console.log`s and returns. This plan wires it to `signInWithEmailAndPassword`, shows a success message (no redirect), clears the form, and adds tests that mirror the existing signup test pattern.

---

## Files to Modify

### 1. `components/AuthForm/AuthForm.tsx`
- **Add `signInWithEmailAndPassword`** to the existing firebase/auth import line.
- **Add `success` state**: `const [success, setSuccess] = useState(false)`
- **Replace the login stub** in `handleSubmit` with:
  1. `setIsLoading(true)`, `setError(null)`, `setSuccess(false)`
  2. `await signInWithEmailAndPassword(auth, email, password)`
  3. On success: `setSuccess(true)`, clear `email` and `password` to `""`
  4. On failure: map error code via `ERROR_MESSAGES`, set `setError(...)`
  5. `finally`: `setIsLoading(false)`
- **Extend `ERROR_MESSAGES`** with login-specific codes:
  - `auth/invalid-credential` → "Invalid email or password."
  - `auth/user-not-found` → "No account found with this email."
  - `auth/wrong-password` → "Incorrect password."
  - `auth/too-many-requests` → "Too many attempts. Please try again later."
  (Keep existing shared codes: `auth/invalid-email`, generic fallback.)
- **Update button label** to include the loading string for login:
  Change `{!isLogin && isLoading ? "Signing up…" : isLogin ? "Log in" : "Sign up"}`
  to `{isLoading ? (isLogin ? "Logging in…" : "Signing up…") : (isLogin ? "Log in" : "Sign up")}`
- **Remove `console.log`** from the login path.
- **Render success message** below the error block (same conditional pattern):
  ```tsx
  {success && (
    <p className={styles.success} aria-live="polite">Logged in successfully!</p>
  )}
  ```

### 2. `components/AuthForm/AuthForm.module.css`
- Add a `.success` class using the `--color-success` token already defined in `globals.css`:
  ```css
  .success { @apply text-sm; color: var(--color-success); }
  ```

---
## Verification
1. `npm run dev` — visit `/login`, submit valid Firebase credentials, confirm success message appears and fields clear; submit bad credentials, confirm error message appears.
