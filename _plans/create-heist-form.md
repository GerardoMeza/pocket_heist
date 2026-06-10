# Plan: Create Heist Form

## Context
The `/heists/create` page is a placeholder. This plan implements the full form that lets an authenticated user create a new heist document in Firestore and redirects to `/heists` on success. The spec answers open questions: current user is excluded from the assignee dropdown, deadline must be at least 48 hours from now, and a cancel button navigating to `/heists` is required.

---

## Approach

### 1. Add a User Firestore type
**File:** `types/firestore/user.ts` (new)

Add a simple `FirestoreUser` interface: `{ id: string; codename: string }`. Export it from `types/firestore/index.ts` alongside the heist exports.

No converter needed — user documents are read-only here and the shape is flat.

### 2. Create the `CreateHeistForm` component
**Files:**
- `components/CreateHeistForm/CreateHeistForm.tsx`
- `components/CreateHeistForm/CreateHeistForm.module.css`
- `components/CreateHeistForm/index.ts`

**Behavior:**
- On mount, fetch all documents from the `users` Firestore collection, filter out the current user's `uid`, and store as `assignableUsers: FirestoreUser[]`.
- Form fields (controlled via `useState`):
  - `title` — text input, required
  - `description` — textarea, required
  - `assignedTo` — `<select>` populated from `assignableUsers`, value is `user.id`, label is `user.codename`. Show a disabled placeholder option "Select a crew member" when users are loading or none are available.
  - `deadline` — `<input type="date">`, required; set `min` attribute to today + 48 hours computed at render time
- On submit (`handleSubmit`):
  1. Set `isLoading = true`, clear error
  2. Build the `CreateHeistInput` payload:
     - `title`, `description` — from form state
     - `assignedTo` — selected user id
     - `assignedToCodename` — look up from `assignableUsers`
     - `createdBy` — `user.uid` (from `useUser()`)
     - `createdByCodename` — fetch alongside users list by reading `users/{uid}`
     - `deadline` — `new Date(deadlineString)`
     - `finalStatus: null`
     - `createdAt: serverTimestamp()`
  3. Call `addDoc(collection(db, "heists"), payload)`
  4. On success: `router.push("/heists")`
  5. On error: set inline error message
  6. `finally`: `setIsLoading(false)`
- A "Cancel" button (type="button") calls `router.push("/heists")`
- While `isLoading`: disable all form fields and the submit button; show "Creating…" on the submit button
- If `assignableUsers` is empty after loading: show "No crew members available" in the dropdown (disabled)

**Reuse:**
- `db` from `lib/firebase.ts`
- `useUser` from `hooks/useUser.ts`
- `useRouter` from `next/navigation`
- `CreateHeistInput` from `types/firestore/heist.ts`
- `FirestoreUser` (new) from `types/firestore/user.ts`
- Firestore: `addDoc`, `collection`, `getDocs`, `doc`, `getDoc`, `serverTimestamp` from `firebase/firestore`

**Styling (CSS module, following AuthForm patterns):**
- Form container: `flex flex-col gap-5 max-w-sm mx-auto my-4 w-full`
- Field wrapper: `flex flex-col gap-1`
- Labels: `text-body text-sm font-medium`
- Inputs/select/textarea: `bg-lighter text-heading rounded-lg px-4 py-2 outline-none border border-transparent focus:border-primary transition-colors`
- Submit button: `bg-primary text-dark font-semibold rounded-lg py-2 px-4 hover:opacity-90 transition-opacity disabled:opacity-50`
- Cancel button: secondary/ghost style using `text-body` and a border
- Error message: `text-sm` with `color: var(--color-error)`

### 3. Update the page
**File:** `app/(dashboard)/heists/create/page.tsx`

Replace the placeholder with:
```tsx
import CreateHeistForm from "@/components/CreateHeistForm"

export default function CreateHeistPage() {
  return (
    <div className="center-content">
      <div className="page-content">
        <h2 className="form-title">Create a New Heist</h2>
        <CreateHeistForm />
      </div>
    </div>
  )
}
```

### 4. Write tests
**File:** `tests/components/CreateHeistForm.test.tsx`

Mocks needed (following existing patterns from `AuthForm.test.tsx`):
- `firebase/firestore` — mock `getDocs`, `getDoc`, `addDoc`, `collection`, `doc`, `serverTimestamp`
- `@/lib/firebase` — mock `db`
- `next/navigation` — mock `useRouter` with `mockPush`
- `@/hooks/useUser` — mock `useUser` returning `{ user: { uid: "u1" }, loading: false }`

Test cases:
1. Renders title, description, assignee dropdown, and deadline fields
2. Populates the assignee dropdown with users fetched from Firestore (excluding current user)
3. Shows a loading/disabled state on the submit button while submitting
4. Calls `addDoc` with the correct payload shape on valid submission
5. Redirects to `/heists` after successful submission

---

## Verification
1. Run `npm test` — all tests should pass including the new `CreateHeistForm.test.tsx`
2. Run `npm run dev` and navigate to `/heists/create`:
   - Confirm assignee dropdown lists users (excluding self)
   - Submit a valid form and confirm redirect to `/heists`
   - Confirm the new document appears in Firestore
   - Test with the deadline less than 48 hours out and confirm the date picker blocks it
3. Run `npm run lint` — no type errors
