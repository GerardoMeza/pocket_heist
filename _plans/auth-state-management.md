# Plan: Auth State Management (`useUser` hook)

## Context
The app has no Firebase client SDK or auth state yet. AuthForm exists as a UI-only component (logs to console). We need a global, realtime auth state solution so any page or component can call `useUser()` and get `{ user, loading }`. No login/signup/logout logic is in scope — just the listener infrastructure.

## Steps

### 0. Install Firebase
```
npm install firebase
```

### 1. Create `lib/firebase.ts`
- Initialize Firebase app singleton (guarded with `getApps()` to prevent hot-reload re-init)
- Export `auth` from `getAuth(app)`
- Read config from `NEXT_PUBLIC_FIREBASE_*` env vars

**Env vars needed in `.env.local`:**
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### 2. Create `contexts/AuthContext.tsx`
- `"use client"` directive — allows import from Server Component root layout without converting it
- Context shape: `{ user: User | null, loading: boolean }` — read-only
- `AuthProvider`: subscribes to `onAuthStateChanged(auth, ...)` in `useEffect`, cleans up with the returned unsubscribe fn
- `loading` starts `true`, set to `false` after first callback fires
- Export both `AuthContext` (for the hook) and `AuthProvider` (for the layout)

### 3. Create `hooks/useUser.ts`
- Reads `AuthContext` via `useContext`
- Throws `"useUser must be used within an AuthProvider"` if context is `undefined`
- Returns `{ user, loading }`

### 4. Modify `app/layout.tsx`
- Import `AuthProvider` from `@/contexts/AuthContext`
- Wrap `{children}` with `<AuthProvider>` inside `<body>`
- Root layout stays a Server Component (no `"use client"` needed — `AuthProvider` is the client boundary)

### 5. Create `tests/contexts/AuthContext.test.tsx`
Mock strategy:
```ts
vi.mock("@/lib/firebase", () => ({ auth: {} }))
vi.mock("firebase/auth", () => ({ onAuthStateChanged: vi.fn() }))
```
Test cases:
- `loading` is `true` before `onAuthStateChanged` fires
- `user` and `loading: false` set correctly when callback fires with a user
- `user: null, loading: false` when callback fires with `null`
- Unsubscribe fn is called on unmount

### 6. Create `tests/hooks/useUser.test.tsx`
Test cases:
- Returns `{ user, loading }` when inside `AuthProvider`
- Throws the expected error when called outside any provider

## Files to create/modify
| Action | Path |
|--------|------|
| Create | `lib/firebase.ts` |
| Create | `contexts/AuthContext.tsx` |
| Create | `hooks/useUser.ts` |
| Modify | `app/layout.tsx` |
| Create | `tests/contexts/AuthContext.test.tsx` |
| Create | `tests/hooks/useUser.test.tsx` |

## Notes
- No existing components currently reference Firebase auth — nothing to migrate
- `loading: true` default prevents hydration mismatch and premature redirects before auth resolves
- Per-page handling of `loading` state is out of scope for this feature

## Verification
1. `npm test` — all new tests pass
2. `npm run dev` — app boots without errors, no console Firebase warnings
3. Add a temporary `console.log(useUser())` in a page to confirm `{ user: null, loading: false }` after auth resolves

## Out of scope
- Login, signup, and logout functionality
- User profile management
- Password reset and email verification
- Firebase auth integration in Login/Signup forms (those just log to console for now)
- Logout button or UI elements that depend on auth state (those will come in a future feature)
- Do not use the `useUser` hook in any existing components yet — we will migrate those in a future task after this foundational state management is in place.