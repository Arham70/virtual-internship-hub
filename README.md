# Virtual Internship Hub

AI-Supported Virtual Internship Hub for Freelancing Careers - A comprehensive platform connecting students with mentors through AI-driven assessments, task allocation, and portfolio generation.

## Features (FR1 - User Registration and Authentication)

- ✅ Role-based user registration (Student, Mentor, Administrator)
- ✅ Secure login and logout functionality
- ✅ Password validation
- ✅ Role-based access control
- ✅ JWT token-based authentication
- ✅ Separate Student and Mentor profiles
- ✅ Session handling

## Tech Stack

### Backend
- **Django 4.2.7** - Python web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Database
- **JWT Authentication** - Token-based auth
- **CORS Headers** - Cross-origin resource sharing

### Frontend
- **React 18.2** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Context API** - State management

## Project Structure

```
virtual-internship-hub/
├── backend/
│   ├── accounts/
│   │   ├── models.py          # User, StudentProfile, MentorProfile models
│   │   ├── serializers.py     # API serializers
│   │   ├── views.py            # API views
│   │   ├── urls.py             # URL routing
│   │   ├── permissions.py      # Custom permissions
│   │   └── admin.py            # Admin configuration
│   ├── config/
│   │   ├── settings.py         # Django settings
│   │   └── urls.py             # Main URL configuration
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Login, Register, ProtectedRoute
│   │   │   └── dashboard/     # Dashboard components
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── services/
│   │   │   └── api.js          # API service
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- pip (Python package manager)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE virtual_internship_hub;
   ```

6. **Configure environment variables:**
   Create a `.env` file in the `backend` directory:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   DB_NAME=virtual_internship_hub
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=localhost
   DB_PORT=5432
   ```

7. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

8. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

9. **Run development server:**
   ```bash
   python manage.py runserver
   ```
   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/accounts/register/` - Register a new user
- `POST /api/accounts/login/` - Login user
- `POST /api/accounts/logout/` - Logout user
- `POST /api/accounts/token/refresh/` - Refresh JWT token

### Profile
- `GET /api/accounts/profile/` - Get current user profile
- `PUT /api/accounts/profile/` - Update current user profile
- `GET /api/accounts/student-profile/` - Get student profile
- `PUT /api/accounts/student-profile/` - Update student profile
- `GET /api/accounts/mentor-profile/` - Get mentor profile
- `PUT /api/accounts/mentor-profile/` - Update mentor profile

### Lists
- `GET /api/accounts/students/` - List all students (Admin/Mentor only)
- `GET /api/accounts/mentors/` - List all mentors

## User Roles

### Student
- Can register with first name, last name, target domain, and skill level
- Access to student dashboard
- Can view and update their profile

### Mentor
- Can register with professional bio and expertise area
- Access to mentor dashboard
- Can view all students
- Can view and update their profile

### Administrator
- Full system access
- Can manage users and tasks
- Access to admin dashboard

## Database Models

### User
- `email` - Unique email address
- `username` - Unique username
- `role` - STUDENT, MENTOR, or ADMINISTRATOR
- `target_domain` - Target freelancing domain (for students)

### StudentProfile
- `user` - OneToOne relationship with User
- `first_name` - First name
- `last_name` - Last name
- `phone_number` - Phone number (optional)
- `bio` - Biography (optional)
- `current_skill_level` - BEGINNER, INTERMEDIATE, ADVANCED, or EXPERT

### MentorProfile
- `user` - OneToOne relationship with User
- `professional_bio` - Professional biography
- `expertise_area` - Areas of expertise
- `years_of_experience` - Years of experience
- `is_available` - Availability status

## Development

### Running Tests
```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm test
```

### Code Formatting
```bash
# Backend (using black)
pip install black
black .

# Frontend (using prettier)
npm install -g prettier
prettier --write "src/**/*.{js,jsx}"
```

## Environment Variables

### Backend (.env)
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (True/False)
- `DB_NAME` - PostgreSQL database name
- `DB_USER` - PostgreSQL username
- `DB_PASSWORD` - PostgreSQL password
- `DB_HOST` - Database host
- `DB_PORT` - Database port

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env` file
- Verify database exists: `psql -U postgres -l`

### CORS Issues
- Ensure backend CORS settings allow frontend origin
- Check `CORS_ALLOWED_ORIGINS` in `settings.py`

### Token Issues
- Clear browser localStorage
- Check token expiration settings
- Verify JWT secret key matches

## Next Steps (Future Features)

- FR2: Skill Assessment and Domain Recommendation
- FR3: AI-driven Task/Project Allocation
- FR4: Automated Evaluation of Submissions
- FR5: Mentor Dashboard for Review and Feedback
- FR6: Portfolio Generation for Students
- FR7: AI-powered Chatbot for Career Guidance

## License

This project is part of a university project.

## Contributors

- Your Name

---

For more information, please refer to the project documentation or contact the development team.
