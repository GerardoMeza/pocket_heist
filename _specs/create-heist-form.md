# Spec for Create Heist Form

branch: claude/feature/create-heist-form

## Summary
Build a form on the "Create a New Heist" page that lets an authenticated user fill in heist details, assign it to another user fetched from Firestore, and submit it to create a new heist document in the `heists` collection. On success, the user is redirected to `/heists`.

## Functional Requirements
- The form must collect the following user-facing fields using the `CreateHeistInput` interface:
  - `title` — text input, required
  - `description` — textarea, required
  - `assignedTo` — select dropdown populated from the `users` Firestore collection (stores the user's `id`)
  - `assignedToCodename` — automatically resolved from the selected user; not a separate visible field
  - `deadline` — date picker, required
- `createdBy` and `createdByCodename` must be set programmatically from the currently authenticated user
- `createdAt` must be set programmatically using Firestore `serverTimestamp()`
- `finalStatus` must default to `null` on creation
- On valid submission, write the document to the Firestore `heists` collection and redirect to `/heists`
- While submitting, the submit button should show a loading state and the form should be disabled
- If submission fails, display an error message to the user

## Firestore Data Requirements
- Read the `users` collection to populate the assignee dropdown; each user document must expose at minimum `id` and `codename`
- Write to the `heists` collection using `CreateHeistInput` as the document shape

## Possible Edge Cases
- The `users` collection is empty — show a placeholder message in the dropdown ("No users available")
- The currently authenticated user is the only user — they can still assign the heist to themselves
- Network failure during Firestore write — surface an inline error and keep the form data intact
- The user navigates away before submitting — no partial document should be written
- `deadline` is set to a past date — consider whether validation should block submission or allow it

## Acceptance Criteria
- The form renders all required fields on `/heists/create`
- The assignee dropdown lists users fetched from Firestore, showing their codename as the label
- Submitting the form with valid data creates a new document in the `heists` collection with the correct shape matching `CreateHeistInput`
- `createdAt` is a Firestore server timestamp, `createdBy`/`createdByCodename` reflect the logged-in user, `finalStatus` is `null`
- After a successful write the user is redirected to `/heists`
- Form is disabled and the submit button shows a loading indicator while the write is in progress
- An inline error message appears if the Firestore write fails

## Open Questions
- Should the currently authenticated user be excluded from the assignee dropdown, or can they assign the heist to themselves? excluded
- Is a minimum deadline date enforced (e.g., must be today or later)? 48 hours
- Should there be a cancel/back button that navigates back to `/heists`? yes 

## Testing Guidelines
Create a test file in `./tests` for this feature and cover the following cases without going too heavy:
- Renders all form fields (title, description, assignee dropdown, deadline)
- Populates the assignee dropdown with users fetched from Firestore
- Shows a loading state on the submit button while submitting
- Calls the Firestore `addDoc` function with the correct payload on valid submission
- Redirects to `/heists` after a successful submission
- Displays an error message when the Firestore write throws
