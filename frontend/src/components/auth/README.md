# Auth components

Login, signup, and forgot-password UI. Design follows the Figma layout.

**Import from here:** `import { AuthPage, ProtectedRoute } from './components/auth';`

- **AuthPage.jsx** – Main screen; holds state and switches between login / signup / forgot.
- **AuthLayout.jsx** – Wraps left panel + right form card.
- **LoginForm.jsx**, **SignupForm.jsx**, **ForgotPasswordForm.jsx** – Form UI only; receive props and callbacks.
- **FormInput.jsx**, **RoleSwitcher.jsx** – Reusable pieces.
- **constants.js**, **authUtils.js** – Shared constants and helpers.
- **ProtectedRoute.jsx** – Redirects to login when not authenticated.

See **frontend/README.md** for the full app structure.
