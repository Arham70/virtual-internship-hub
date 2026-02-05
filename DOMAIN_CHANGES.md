# Domain Model Changes

## Summary of Changes

### Backend Changes

1. **New Domain Model**
   - Created a `Domain` model to manage freelancing domains
   - Fields: `name`, `code`, `description`, `created_at`
   - Replaces the old `DOMAIN_CHOICES` list

2. **User Model**
   - Removed `target_domain` field (moved to StudentProfile)

3. **StudentProfile Model**
   - Added `target_domains` field (ManyToMany relationship with Domain)
   - Students can now select **multiple domains**

4. **MentorProfile Model**
   - Changed `expertise_area` (CharField) to `expertise_domain` (ForeignKey to Domain)
   - Mentors can now select **only one domain**

5. **Serializers**
   - Updated to handle domain relationships
   - `StudentProfileSerializer`: Handles multiple domain IDs
   - `MentorProfileSerializer`: Handles single domain ID
   - Added `DomainSerializer` for domain data

6. **Views**
   - Added `DomainListView` to fetch all available domains
   - Updated registration to handle domain IDs

7. **Admin**
   - Added `DomainAdmin` for managing domains
   - Updated profile admins to show domain relationships

8. **Management Command**
   - Created `populate_domains` command to seed initial domain data

### Frontend Changes

1. **Register Component**
   - Fetches domains from API on mount
   - Students: Multiple domain selection using checkboxes
   - Mentors: Single domain selection using dropdown
   - Sends domain IDs instead of domain codes

2. **API Service**
   - Added `getDomains()` method to fetch domains

3. **Dashboard Components**
   - Updated to display domains correctly
   - Student dashboard shows all selected domains
   - Mentor dashboard shows single expertise domain

## Migration Steps

1. **Run migrations:**
   ```bash
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   ```

2. **Populate domains:**
   ```bash
   python manage.py populate_domains
   ```

3. **Update existing data (if needed):**
   - Existing students: Manually assign domains through admin or API
   - Existing mentors: Update expertise_domain field

## API Endpoints

- `GET /api/accounts/domains/` - List all available domains
- `POST /api/accounts/register/` - Register with domain IDs
  - Students: `target_domain_ids: [1, 2, 3]` (array of domain IDs)
  - Mentors: `expertise_domain_id: 1` (single domain ID)

## Example Registration Data

### Student Registration
```json
{
  "email": "student@example.com",
  "username": "student123",
  "password": "password123",
  "password_confirm": "password123",
  "role": "STUDENT",
  "first_name": "John",
  "last_name": "Doe",
  "target_domain_ids": [1, 2, 3],
  "current_skill_level": "BEGINNER"
}
```

### Mentor Registration
```json
{
  "email": "mentor@example.com",
  "username": "mentor123",
  "password": "password123",
  "password_confirm": "password123",
  "role": "MENTOR",
  "professional_bio": "Experienced developer...",
  "expertise_domain_id": 3
}
```

## Benefits

1. **Flexibility**: Students can pursue multiple domains
2. **Consistency**: Mentors have clear single expertise
3. **Scalability**: Easy to add new domains without code changes
4. **Data Integrity**: Foreign key relationships ensure valid domains
5. **Better Filtering**: Can easily filter students/mentors by domain


