# Plan: Navbar Logout Button

## Context
The Navbar component currently has no auth awareness. The `AuthProvider` + `useUser` hook already exist and expose `{ user, loading }`. This plan wires `useUser` into Navbar to conditionally render a "Log Out" button that calls Firebase's `signOut` when clicked.

---

## Step 1 — Update `components/Navbar/Navbar.tsx`

- Add `"use client"` directive (needed because `useUser` uses `useContext`).
- Import `useUser` from `@/hooks/useUser`.
- Import `signOut` from `firebase/auth` and `auth` from `@/lib/firebase`.
- Destructure `{ user }` from `useUser()`.
- Add an async `handleLogout` function that calls `signOut(auth)`.
- Render a `<button onClick={handleLogout} className={styles.logoutButton}>Log Out</button>` inside the `<ul>` — only when `user` is non-null. Place it alongside the existing "Create Heist" `<li>`.

**File:** `components/Navbar/Navbar.tsx`

---

## Step 2 — Update `components/Navbar/Navbar.module.css`

Add `.logoutButton` style:
- Background: `#ff0076` (matches Figma primary button and the existing `border` color used on `.logoLink`)
- Text: white, uppercase, semibold, `font-size: 19px`, `letter-spacing: -0.38px`
- Border radius: `100px` (fully rounded, per Figma)
- Padding: consistent with `.ctaButton` (`0.75rem 1.25rem`)
- `cursor: pointer`, `border: none`

**File:** `components/Navbar/Navbar.module.css`

---

## Step 3 — Update `tests/components/Navbar.test.tsx`

No mocks needed.

New test cases:

1. **Clicking logout calls signOut**

**File:** `tests/components/Navbar.test.tsx`

---

## Verification

```bash
npx vitest run tests/components/Navbar.test.tsx
npm test
npm run build
```

Manual: start dev server (`npm run dev`), sign in, confirm button appears in Navbar; click it, confirm button disappears.
