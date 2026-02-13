# Virtual Internship Hub – Frontend

React app for login, signup, and role-based dashboards (Student, Mentor, Admin).

---

## Folder structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── index.js              ← App entry (renders <App />)
│   ├── index.css             ← Tailwind + global styles
│   ├── App.jsx               ← Routes only (login, register, dashboards, 403)
│   │
│   ├── context/
│   │   └── AuthContext.jsx    ← Auth state (user, login, register, logout)
│   │
│   ├── services/
│   │   └── api.js             ← Axios instance + authAPI (login, register, getDomains, etc.)
│   │
│   └── components/
│       ├── auth/              ← Login, Signup, Forgot password
│       │   ├── index.js       ← Export: AuthPage, ProtectedRoute
│       │   ├── AuthPage.jsx    ← Main auth screen (switches between login/signup/forgot)
│       │   ├── AuthLayout.jsx  ← Left panel + right form card
│       │   ├── AuthLeftPanel.jsx
│       │   ├── LoginForm.jsx
│       │   ├── SignupForm.jsx
│       │   ├── ForgotPasswordForm.jsx
│       │   ├── FormInput.jsx
│       │   ├── RoleSwitcher.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── Icons.jsx
│       │   ├── MultiSelect.jsx
│       │   ├── OTPInput.jsx
│       │   ├── constants.js
│       │   └── authUtils.js
│       │
│       ├── dashboard/         ← Role-specific dashboards
│       │   ├── index.js       ← Export: StudentDashboard, MentorDashboard, AdminDashboard
│       │   ├── StudentDashboard.jsx
│       │   ├── MentorDashboard.jsx
│       │   ├── AdminDashboard.jsx
│       │   └── Dashboard.css
│       │
│       └── UnauthorizedPage.jsx   ← 403 page
│
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md (this file)
```

---

## What lives where

| Folder / file        | Purpose |
|----------------------|--------|
| **src/App.jsx**      | Defines all routes; uses AuthProvider, AuthPage, ProtectedRoute, dashboards. |
| **context/**        | Global auth state (user, login, register, logout). |
| **services/**       | API calls (authAPI used by AuthContext and AuthPage). |
| **components/auth/**| Everything for login, signup, forgot password. Import `AuthPage` and `ProtectedRoute` from `./components/auth`. |
| **components/dashboard/** | Student / Mentor / Admin dashboard screens. Import from `./components/dashboard`. |
| **components/UnauthorizedPage.jsx** | 403 screen. |

---

## How to run

```bash
npm install
npm start
```

App runs at `http://localhost:3000`. Backend should be at `http://localhost:8000` (see `src/services/api.js`).

---

## Routes

| Path                 | Who can see it        | What shows                    |
|----------------------|------------------------|-------------------------------|
| `/`                  | Anyone                 | Redirects to `/login`         |
| `/login`             | Not logged in          | AuthPage (login form)         |
| `/register`          | Not logged in          | AuthPage (signup form)        |
| `/student/dashboard` | Logged-in Student      | StudentDashboard              |
| `/mentor/dashboard`  | Logged-in Mentor       | MentorDashboard               |
| `/admin/dashboard`   | Logged-in Admin        | AdminDashboard                |
| `/dashboard`         | Logged in              | Redirects to role dashboard   |
| `/unauthorized`      | Anyone                 | UnauthorizedPage (403)        |
