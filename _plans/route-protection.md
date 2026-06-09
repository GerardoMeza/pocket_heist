# Plan: Route Protection

## Context
The app has two Next.js route groups — `(public)` for unauthenticated pages and `(dashboard)` for authenticated pages — but neither currently enforces access. Any user can visit any route regardless of auth state. This plan wires up `useUser` (which already exposes `{ user, loading }` from `AuthContext`) in both group layouts to redirect users to the right place and show a loader while Firebase resolves auth state.

---

## Files to Create

### 1. `components/Loader/Loader.tsx` + `Loader.module.css` + `index.ts`
A minimal shared full-page loader displayed while auth state is pending. Centered spinner or pulsing dot — keep it visually simple. No props needed.

### 2. `components/RouteGuard/RouteGuard.tsx` + `index.ts`
A `"use client"` component that encapsulates the guard logic. Accepts:
- `children: React.ReactNode`
- `requireAuth: boolean` — `true` for dashboard, `false` for public
- `redirectTo: string` — where to send the user if the condition fails

Behavior:
- While `loading === true` → render `<Loader />`
- When `loading === false` and `requireAuth === true` and `user === null` → `router.replace(redirectTo)`, render `<Loader />` (keep showing loader during redirect)
- When `loading === false` and `requireAuth === false` and `user !== null` → `router.replace(redirectTo)`, render `<Loader />`
- Otherwise → render `{children}`

Uses `useRouter` from `next/navigation` and `useUser` from `@/hooks/useUser`.

---

## Files to Modify

### 3. `app/(public)/layout.tsx`
Wrap `{children}` with `<RouteGuard requireAuth={false} redirectTo="/heists">` around the existing `<main className="public">`.

### 4. `app/(dashboard)/layout.tsx`
Wrap existing content with `<RouteGuard requireAuth={true} redirectTo="/login">` around the `<Navbar />` and `<main>`.

---

## Reuse
- `useUser` — `hooks/useUser.ts` (already returns `{ user, loading }`)
- `AuthContext` — already sets `loading: true` until `onAuthStateChanged` fires, so the loading state is reliable

---

## Testing
Create `tests/components/RouteGuard.test.tsx` covering:
- Shows `<Loader />` while loading
- Redirects to `/login` when `requireAuth=true` and user is null
- Redirects to `/heists` when `requireAuth=false` and user is set
- Renders children when `requireAuth=true` and user is set
- Renders children when `requireAuth=false` and user is null

Mock `useUser`, `next/navigation`, and `next/link` as per existing test patterns.

---

## Verification
1. `npm test` — all RouteGuard tests pass
2. `npm run dev` — visiting `/login` while logged in redirects to `/heists`; visiting `/heists` while logged out redirects to `/login`; loader appears briefly on both groups before redirect
