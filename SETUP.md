# Quick Setup Guide

## Backend Setup (5 minutes)

1. **Create and activate virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE virtual_internship_hub;
   ```

4. **Create .env file in backend directory:**
   ```env
   SECRET_KEY=django-insecure-change-this-in-production
   DEBUG=True
   DB_NAME=virtual_internship_hub
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   ```

5. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run server:**
   ```bash
   python manage.py runserver
   ```

Backend will run on `http://localhost:8000`

## Frontend Setup (3 minutes)

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

Frontend will run on `http://localhost:3000`

## Testing the Application

1. Open `http://localhost:3000` in your browser
2. Click "Register" to create a new account
3. Choose a role (Student, Mentor, or Administrator)
4. Fill in the required fields
5. After registration, you'll be redirected to your dashboard
6. You can logout and login again to test authentication

## Common Issues

### PostgreSQL Connection Error
- Make sure PostgreSQL is running
- Check your database credentials in `.env`
- Verify the database exists

### Port Already in Use
- Backend: Change port with `python manage.py runserver 8001`
- Frontend: Change port by setting `PORT=3001` in environment

### CORS Errors
- Ensure backend is running on port 8000
- Check `CORS_ALLOWED_ORIGINS` in `backend/config/settings.py`

### Module Not Found
- Make sure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

## Next Steps

After successful setup:
1. Test user registration for each role
2. Test login/logout functionality
3. Verify profile creation works correctly
4. Check that role-based access control works


