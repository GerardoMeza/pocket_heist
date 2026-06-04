# Context

The `/login` and `/signup` pages exist but are empty shells with only a heading. This plan adds working email/password forms with a show/hide password toggle, a submit button, and a link to switch between the two pages. Submissions log to the console only — no real auth. The open question in the spec was resolved: use a shared reusable `AuthForm` component.

---

# Approach

## 1. Create `AuthForm` component

**Files to create:**
- `components/AuthForm/AuthForm.tsx`
- `components/AuthForm/AuthForm.module.css`
- `components/AuthForm/index.ts`

**Props:**
```
type: "login" | "signup"
```

**Behavior:**
- Renders controlled `email` and `password` inputs
- Password field toggles between `type="password"` and `type="text"` via an icon button (use `Eye` / `EyeOff` from `lucide-react`, already a project dependency)
- Submit button label: `"Log in"` when `type="login"`, `"Sign up"` when `type="signup"`
- `onSubmit`: calls `console.log({ email, password })` and calls `e.preventDefault()`
- Switch link at the bottom: login page shows `"Don't have an account? Sign up"` → `/signup`; signup page shows `"Already have an account? Log in"` → `/login`. Use Next.js `<Link>`.

**Styling:**
- Use CSS Module with `@reference "../../app/globals.css"`
- Reuse existing global tokens: `bg-lighter`, `text-body`, `text-primary`, `text-heading`
- Form should be visually centered and consistent with the `.page-content` / `.center-content` pattern already used on the public pages

## 2. Update `/login` page

**File:** `app/(public)/login/page.tsx`

- Replace placeholder content with `<AuthForm type="login" />`
- Wrap in the existing `.center-content` + `.page-content` divs (same pattern as other public pages)
- Fix the component name (currently named `SignupPage` by mistake — rename to `LoginPage`)

## 3. Update `/signup` page

**File:** `app/(public)/signup/page.tsx`

- Replace placeholder content with `<AuthForm type="signup" />`
- Wrap in the existing `.center-content` + `.page-content` divs

## 4. Write tests

**File:** `tests/components/AuthForm.test.tsx`

Follow the Vitest + Testing Library pattern from `tests/components/Avatar.test.tsx`:

- Renders email and password input fields
- Renders "Log in" button when `type="login"`
- Renders "Sign up" button when `type="signup"`
- Password field is hidden (`type="password"`) by default
- Clicking the toggle makes password visible (`type="text"`)
- Clicking toggle again hides it again
- Submitting the form calls `console.log` with `{ email, password }`
- Switch link points to `/signup` when `type="login"`
- Switch link points to `/login` when `type="signup"`

---

# Files Modified

| File | Action |
|---|---|
| `components/AuthForm/AuthForm.tsx` | Create |
| `components/AuthForm/AuthForm.module.css` | Create |
| `components/AuthForm/index.ts` | Create |
| `app/(public)/login/page.tsx` | Update |
| `app/(public)/signup/page.tsx` | Update |
| `tests/components/AuthForm.test.tsx` | Create |

---

# Verification

1. `npm test` — all AuthForm tests pass
2. `npm run dev` — visit `/login`: form renders, toggle works, submit logs to console, link goes to `/signup`
3. Visit `/signup`: same checks, link goes to `/login`
4. `npm run lint` — no lint errors
