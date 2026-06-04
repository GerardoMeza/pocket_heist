# Authentication Login & Signup Forms

## Overview

Add email/password authentication forms to the `/login` and `/signup` pages. Users can switch between the two forms easily. On submission, form data is logged to the console (no real auth yet).

---

## Pages Affected

- `app/(public)/login/page.tsx`
- `app/(public)/signup/page.tsx`

---

## Features

### Login Form (`/login`)

- Email input field (type `email`, required)
- Password input field (type `password`, required) with a toggle icon to show/hide the password
- Submit button labeled **"Log in"**
- On submit: log `{ email, password }` to the console
- Link/button to navigate to `/signup` ("Don't have an account? Sign up")

### Signup Form (`/signup`)

- Email input field (type `email`, required)
- Password input field (type `password`, required) with a toggle icon to show/hide the password
- Submit button labeled **"Sign up"**
- On submit: log `{ email, password }` to the console
- Link/button to navigate to `/login` ("Already have an account? Log in")

---

## UX Requirements

- The show/hide password toggle must be an icon button placed inside or adjacent to the password field
- Switching between `/login` and `/signup` should feel seamless — a single visible link at the bottom of each form
- Both forms should be visually consistent (same layout, same field styles)
- Forms should be centered on the page, matching the existing public layout style

---

## Behavior

| Event | Result |
|---|---|
| User submits login form | Console: `{ email, password }` |
| User submits signup form | Console: `{ email, password }` |
| User clicks password toggle | Password field switches between `password` and `text` type |
| User clicks "Sign up" link on login page | Navigates to `/signup` |
| User clicks "Log in" link on signup page | Navigates to `/login` |

---

## Out of Scope

- Real authentication / session management
- Form validation error messages
- "Forgot password" flow
- Remember me / persistent sessions
