# Spec for signup-firebase-auth

branch: claude/feature/signup-firebase-auth  
figma_component (if used): N/A

## Summary
- Hook the existing signup form (`app/(public)/signup`) to Firebase Authentication using the existing `lib/firebase.ts` setup.
- On successful signup, generate a random PascalCase display name (codename) and set it as the user's Firebase display name.
- Create a document in the Firestore `users` collection storing the user's `id` and `codename` (no email).

## Functional Requirements
- The signup form must call Firebase Auth's email/password sign-up method on submission.
- After a successful sign-up, a random codename must be generated in PascalCase (e.g. `SilverFoxTango`).
- The generated codename must be set as the Firebase Auth user's display name (`updateProfile`).
- A document must be created in the Firestore `users` collection with the following fields:
  - `id`: the Firebase Auth UID
  - `codename`: the generated PascalCase display name
- The user's email must NOT be stored in Firestore.
- Only the Firebase SDK may be used (no third-party auth libraries).
- On success, the user should be redirected to the authenticated area (`/heists`).
- On failure, an appropriate error message must be shown to the user within the form.
- The form must be disabled / show a loading state while the request is in flight.

## Figma Design Reference
- N/A — no Figma link provided.

## Possible Edge Cases
- Email already in use — Firebase returns a specific error code; surface a user-friendly message.
- Weak password — Firebase enforces a minimum length; show the relevant error.
- Network failure during sign-up or during Firestore document creation — handle gracefully and allow retry.
- Firestore write fails after Auth account is created — user exists in Auth but has no Firestore document; consider retrying or flagging the inconsistency.
- Codename collision — two users could theoretically receive the same codename; acceptable for now unless uniqueness is required.

## Acceptance Criteria
- Submitting the signup form with valid credentials creates a Firebase Auth user.
- The new user's `displayName` in Firebase Auth is set to the generated PascalCase codename.
- A document exists in `users/{uid}` containing `id` and `codename` fields, with no `email` field.
- Invalid submissions (bad email, weak password, duplicate account) show a descriptive inline error.
- The form shows a loading/disabled state during submission.
- On success, the user is redirected to `/heists`.

## Open Questions
- How many words should the generated codename contain (e.g. two words, three words)? 2 or 3 words
- Should codenames be guaranteed unique across the `users` collection, or is collision acceptable? acceptable for now
- Should the signup page redirect to an onboarding step to show the user their codename before going to `/heists`? no, just redirect to `/heists` immediately after signup

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Successful signup creates a Firebase Auth user, sets the display name, and writes the Firestore document.
- Failed signup (e.g. email already in use) shows an error message and does not redirect.
- The form is disabled while submission is in progress.
- The generated codename follows PascalCase format.
- The Firestore document does not contain the user's email.
