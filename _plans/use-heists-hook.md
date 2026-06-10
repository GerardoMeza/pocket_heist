# Plan: useHeists Hook + Heists Page Integration

## Context
The heists dashboard page (`app/(dashboard)/heists/page.tsx`) is currently a static placeholder. We need a real-time Firestore hook — `useHeists` — that queries the `heists` collection with three distinct filter modes and feeds live data into the page.

---

## Key Existing Files
| File | Role |
|------|------|
| `lib/firebase.ts` | Exports `auth` and `db` (Firestore) singletons |
| `contexts/AuthContext.tsx` | Provides `{ user, loading }` via React Context |
| `hooks/useUser.ts` | Consumes AuthContext; returns `{ user, loading }` |
| `types/firestore/heist.ts` | `Heist` interface + `CreateHeistInput` / `UpdateHeistInput` |
| `types/firestore/converters.ts` | `heistConverter` — handles Timestamp → Date for `deadline` and `createdAt` |
| `app/(dashboard)/heists/page.tsx` | Target page to update |
| `tests/components/CreateHeistForm.test.tsx` | Reference for Firestore mocking patterns |

### Heist schema (relevant fields)
```
assignedTo: string          // Firebase UID of assignee
createdBy: string           // Firebase UID of creator
deadline: Timestamp → Date  // via heistConverter
finalStatus: 'success' | 'failure' | null
```

---

## Implementation Steps

### 1. Create `hooks/useHeists.ts`
- Accept a single `filter: 'active' | 'assigned' | 'expired'` argument.
- Call `useUser()` to get the current `user`.
- Build a Firestore query against the `heists` collection (with `heistConverter`) using `where` + `Timestamp.now()`:
  - **`'active'`**: `where('assignedTo', '==', user.uid)` + `where('deadline', '>', Timestamp.now())`
  - **`'assigned'`**: `where('createdBy', '==', user.uid)` + `where('deadline', '>', Timestamp.now())`
  - **`'expired'`**: `where('deadline', '<=', Timestamp.now())` + `where('finalStatus', '!=', null)`
- Use `onSnapshot` for real-time updates; store results in `useState<Heist[]>`.
- Return `{ heists, loading, error }`.
- Return `{ heists: [], loading: false, error: null }` early if `user` is null.
- Unsubscribe from `onSnapshot` in the `useEffect` cleanup.
- Re-run the effect when `filter` or `user?.uid` changes.

### 2. Update `app/(dashboard)/heists/page.tsx`
- Add `"use client"` directive (needed to use hooks).
- Call `useHeists` three times, once per filter mode.
- Under each existing `<h2>` section, render a `<ul>` of heist titles from the returned array.
- Show nothing extra (no loading spinners or error UI) — just titles for now.

### 3. Create `tests/hooks/useHeists.test.ts`
Follow the project's established mocking pattern:
- Mock `@/lib/firebase` → `{ auth: {}, db: {} }`
- Mock `firebase/firestore` → expose `vi.fn()` stubs for `collection`, `query`, `where`, `onSnapshot`, `Timestamp`
- Mock `@/hooks/useUser` → control `user` return value
- Test cases:
  1. Returns empty array when user is null (unauthenticated).
  2. Calls `onSnapshot` with a query containing the correct `where` clauses for `'active'`.
  3. Calls `onSnapshot` with the correct clauses for `'assigned'`.
  4. Calls `onSnapshot` with the correct clauses for `'expired'`.
  5. Returns the heist array provided by the snapshot callback.
  6. Calls the unsubscribe function returned by `onSnapshot` on unmount.

---

## Verification
1. `npm test` — all existing tests pass and new `useHeists` tests pass.
2. `npm run dev` — visit `/heists`; each section renders titles from live Firestore data.
3. Add/modify a heist in Firestore console → titles update in real time without page refresh.
