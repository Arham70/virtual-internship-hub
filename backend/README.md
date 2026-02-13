# Virtual Internship Hub – Backend

Django REST API with JWT auth, forgot-password (OTP via email), and Swagger UI.

## Setup

```bash
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
```

## Environment (.env)

Create `.env` in `backend/`:

```env
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=virtual_internship_hub
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# SMTP (for forgot-password OTP emails)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@yourdomain.com

# OTP expiry in minutes (default 2)
PASSWORD_RESET_OTP_EXPIRE_MINUTES=2
```

For Gmail: use an [App Password](https://support.google.com/accounts/answer/185833), not your normal password.

## PostgreSQL setup

1. **Install PostgreSQL** (if not installed): [PostgreSQL downloads](https://www.postgresql.org/download/windows/).

2. **Create database and user** (PowerShell or `psql`):

   - Open **psql** or **pgAdmin** and run:

   ```sql
   CREATE USER your_db_user WITH PASSWORD 'your_db_password';
   CREATE DATABASE virtual_internship_hub OWNER your_db_user;
   ```

   Or with default `postgres` user:

   ```sql
   CREATE DATABASE virtual_internship_hub;
   ```

3. **Set `.env`** in `backend/` with the same values:

   ```env
   DB_NAME=virtual_internship_hub
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   ```

## Apply migrations (no manual migration files)

From `backend/` with your venv activated:

```powershell
# 1. Generate migrations (Django creates accounts/migrations/0001_initial.py)
python manage.py makemigrations

# 2. Apply all migrations to PostgreSQL
python manage.py migrate

# 3. Load domains and create superuser
python manage.py populate_domains
python manage.py createsuperuser
```

If **migrate** fails with `relation "users" does not exist`:

- Open `accounts/migrations/0001_initial.py`.
- Inside the `Migration` class (same level as `dependencies`), add:
  ```python
  run_before = [
      ('admin', '0001_initial'),
  ]
  ```
- Run `python manage.py migrate` again.

## Run

```bash
python manage.py runserver
```

API: `http://localhost:8000/api/accounts/`  
Swagger UI: `http://localhost:8000/swagger/`  
ReDoc: `http://localhost:8000/redoc/`

## API Overview

- **Auth:** `POST /api/accounts/register/`, `POST /api/accounts/login/`, `POST /api/accounts/logout/`
- **JWT refresh:** `POST /api/accounts/token/refresh/`
- **Forgot password:**  
  - `POST /api/accounts/forgot-password/send-otp/` – send OTP (expires in 2 min)  
  - `POST /api/accounts/forgot-password/verify-otp/` – verify OTP  
  - `POST /api/accounts/forgot-password/reset/` – set new password  
  - `POST /api/accounts/forgot-password/resend-otp/` – resend OTP
- **Profile:** `GET/PUT /api/accounts/profile/`, `student-profile/`, `mentor-profile/`
- **Lists:** `GET /api/accounts/domains/`, `students/`, `mentors/`

All views use class-based approach; JWT required except for register, login, forgot-password, domains, and token refresh.
