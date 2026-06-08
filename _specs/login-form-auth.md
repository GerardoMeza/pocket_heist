# Spec for login-form-auth

branch: claude/feature/login-form-auth  

## Summary
- Wire the login form in `AuthForm` (when `type="login"`) to Firebase Authentication so that submitting valid credentials signs the user in and shows a success message in place of redirecting.

## Functional Requirements
- When the user submits the login form with a valid email and password, call `signInWithEmailAndPassword` from Firebase Auth.
- On success, display an inline success message (e.g. "Logged in successfully!") within the form area — no redirect.
- While the request is in-flight, disable the form inputs and submit button and show a loading label on the button (e.g. "Logging in…").
- On failure, display a user-friendly error message using the same error-display pattern already in place for signup.
- Map the following Firebase error codes to readable messages:
  - `auth/invalid-credential` → "Invalid email or password."
  - `auth/user-not-found` → "No account found with this email."
  - `auth/wrong-password` → "Incorrect password."
  - `auth/invalid-email` → "Please enter a valid email address."
  - `auth/too-many-requests` → "Too many attempts. Please try again later."
  - Any unmapped code → "Something went wrong. Please try again."
- The success state should be visually distinct from the error state (e.g. green-toned text or a themed success style).

## Possible Edge Cases
- User submits with an email that has no matching account.
- User submits with a correct email but wrong password.
- Firebase is unreachable or returns an unexpected error code.
- User submits the form multiple times rapidly (double-submit) — the loading state should prevent this.
- User clears the form after a success message is showing.

## Acceptance Criteria
- Submitting valid credentials calls `signInWithEmailAndPassword` and renders a success message without navigating away.
- Submitting invalid credentials renders an appropriate human-readable error message.
- The submit button reads "Logging in…" while the request is pending and is disabled.
- Both inputs are disabled during loading.
- The success message is visually distinct from error messages.
- No console.log calls remain in the login path.

## Open Questions
- Should the success message auto-dismiss after a timeout, or persist until the user navigates away? no
- Should the form fields be cleared after a successful login? yes

## Testing Guidelines
Create a test file at `./tests/components/AuthForm.login.test.tsx` and cover the following cases, without going too heavy:
- Renders the login form correctly (email input, password input, submit button).
- Calls `signInWithEmailAndPassword` with the correct email and password on submit.
- Shows a success message when Firebase resolves successfully.
- Shows an error message when Firebase rejects with a known error code.
- Shows a generic error message for unknown Firebase error codes.
- Disables inputs and button while loading.
