# Virtual Internship Hub – Frontend

React app: login, signup, forgot password, and role-based dashboards (Student, Mentor, Admin).

---

## What each folder does

| Folder | Purpose |
|--------|--------|
| **`src/api/`** | Backend API layer. Axios client (`client.js`), interceptors, token refresh. One file per area: `auth.api.js`, `student.api.js`, `mentor.api.js`, `admin.api.js`, `domains.api.js`. No UI, no page logic—only HTTP calls. |
| **`src/components/ui/`** | Reusable UI only: `FormInput`, `MultiSelect`, `OTPInput`, `Icons`. Used by auth and other screens. |
| **`src/components/auth/`** | Auth flows: `AuthPage` (login/signup/forgot), `LoginForm`, `SignupForm`, `ForgotPasswordForm`, `AuthLayout`, `RoleSwitcher`, `ProtectedRoute`. Imports UI from `components/ui`. |
| **`src/components/dashboard/`** | Role dashboards: `StudentDashboard`, `MentorDashboard`, `AdminDashboard`. |
| **`src/components/home/`** | Landing/home page (e.g. role choice before login/register). |
| **`src/context/`** | Global auth state: `AuthContext` (user, login, register, logout, loading). `AuthProvider` wraps the app in `App.jsx`. |
| **`src/hooks/`** | API-related hooks: `useDomains`, `useForgotPassword`, `useAuth` (re-export from context). Used by pages to fetch data or trigger API calls. |
| **`src/services/`** | Page/feature logic only (no HTTP). E.g. `authPage.service.js`: signup validation, building signup payload. Not for raw API calls—those live in `api/`. |
| **`src/utilities/`** | Shared helpers and constants: `constants.js` (VIEW, ROLE, FORGOT_STEP), `authUtils.js` (redirectByRole, getErrorMessage). Used in multiple places. |

---

## Run

```bash
npm install
npm start
```

Runs at `http://localhost:3000`. Set `REACT_APP_API_URL` if the backend is not at `http://localhost:8000/api`.

---

## Routes

| Path | What |
|------|------|
| `/` | Redirects to `/login` or home |
| `/login`, `/register` | AuthPage (login / signup) |
| `/student/dashboard`, `/mentor/dashboard`, `/admin/dashboard` | Role dashboards (protected) |
| `/dashboard` | Redirects to role-specific dashboard |
| `/unauthorized` | 403 page |
