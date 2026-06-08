# Plan: Signup Firebase Auth with Codename

## Context
The signup form exists (`app/(public)/signup/page.tsx` → `<AuthForm type="signup" />`) but currently only logs to console on submit. Firebase Auth is initialized in `lib/firebase.ts` and an `AuthProvider` wraps the app, but no actual sign-up flow or Firestore integration is wired up. This plan hooks the signup form to Firebase Auth, generates a random PascalCase codename for each new user, and persists it to Firestore — without storing the user's email.

---

## Step 1 — Add Firestore to `lib/firebase.ts`

Add `getFirestore` import and export `db` alongside the existing `auth` export. Use the same `app` instance — no new initialization pattern needed.

**File:** `lib/firebase.ts`

---

## Step 2 — Create `lib/codename.ts`

New utility module exporting `generateCodename(): string`.

- Maintain two arrays: `ADJECTIVES` (~15 color/tone words, already PascalCase, e.g. `Crimson`, `Shadow`, `Silver`) and `NOUNS` (~15 thematic words, e.g. `Wolf`, `Fox`, `Vault`, `Blade`).
- Randomly pick 2 or 3 words (50/50): 2 → adjective + noun; 3 → adjective + noun + noun.
- Concatenate without separator — PascalCase is guaranteed because each word is already capitalized in the array.
- Use `Math.random()` — no external dependency.

**File:** `lib/codename.ts` (new)

---

## Step 3 — Update `components/AuthForm/AuthForm.tsx`

### New state
- `error: string | null` — inline error message
- `isLoading: boolean` — disables inputs and submit button during flight

### New imports
- `useRouter` from `next/navigation`
- `createUserWithEmailAndPassword`, `updateProfile` from `firebase/auth`
- `doc`, `setDoc` from `firebase/firestore`
- `auth`, `db` from `@/lib/firebase`
- `generateCodename` from `@/lib/codename`

### `handleSubmit` logic (signup path only — guarded by `type === "signup"`)
1. Set `isLoading = true`, `error = null`
2. `try`:
   - `createUserWithEmailAndPassword(auth, email, password)` → `user`
   - `generateCodename()` → `codename`
   - `updateProfile(user, { displayName: codename })`
   - `setDoc(doc(db, "users", user.uid), { id: user.uid, codename })`
   - `router.push("/heists")`
3. `catch`: map Firebase error codes to user-friendly strings:
   - `auth/email-already-in-use` → "An account with this email already exists."
   - `auth/weak-password` → "Password must be at least 6 characters."
   - `auth/invalid-email` → "Please enter a valid email address."
   - default → "Something went wrong. Please try again."
   - Set `error` to the mapped string
4. `finally`: `isLoading = false`

> The existing login path (`type === "login"`) keeps the current `console.log` stub — login is out of scope.

### JSX changes
- All `<input>` elements: add `disabled={isLoading}`
- Submit button: add `disabled={isLoading}`, show `"Signing up…"` when `isLoading && type === "signup"`
- Add `<p className={styles.error} aria-live="polite">{error}</p>` between password field and submit button (rendered only when `error` is non-null)

### CSS
- Add `.error` to `components/AuthForm/AuthForm.module.css` using `@apply text-sm` with red color token.

**Files:** `components/AuthForm/AuthForm.tsx`, `components/AuthForm/AuthForm.module.css`

---

## Step 4 — Update `tests/components/AuthForm.test.tsx`

### Additional mocks at the top
No need for mocks.

> The existing test "submitting the form logs email and password" uses `type="login"` and tests the console.log stub — this path stays unchanged so that test remains valid.

### New test cases (all with `type="signup"`)
1. **Success** — resolves correctly → `router.push("/heists")` called, no error shown
2. **Loading state** — never-resolving promise → inputs and button are disabled, button reads "Signing up…"
3. **Error: email in use** — `auth/email-already-in-use` → error message visible, router not called
4. **Error: weak password** — `auth/weak-password` → correct error message shown
5. **Error: generic** — unknown code → fallback message shown
6. **Error clears on retry** — error shown after first fail, gone after second successful submit

**File:** `tests/components/AuthForm.test.tsx`

---

## Step 5 — Create `tests/lib/codename.test.ts`

Test cases:
1. Returns a non-empty string
2. No spaces or separators in the result
3. Length ≥ 6 characters
4. Split by `/[A-Z][a-z]+/g` yields 2 or 3 matches
5. Each split word starts with an uppercase letter
6. Call 50 times — all results match the expected pattern (smoke test for both length branches)

**File:** `tests/lib/codename.test.ts` (new, under `tests/lib/`)

---

## Sequencing

1. `lib/firebase.ts` + `lib/codename.ts` (parallel — independent)
2. `tests/lib/codename.test.ts` (depends on step 1)
3. `components/AuthForm/AuthForm.tsx` + `AuthForm.module.css` (depends on step 1)
4. `tests/components/AuthForm.test.tsx` (depends on step 3)

---

## Verification

```bash
npm test
npx vitest run tests/lib/codename.test.ts
npx vitest run tests/components/AuthForm.test.tsx
npm run build
```

Manual checks in Firebase console:
- Auth → Users: new user exists with the generated codename as `displayName`
- Firestore → `users/{uid}`: document has `id` and `codename` fields, no `email` field
