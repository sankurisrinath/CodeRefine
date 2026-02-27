# 🗄️ Database Setup Guide - Local PostgreSQL

## Prerequisites

✅ PostgreSQL installed locally (version 12 or higher)
✅ Python 3.9+ installed
✅ pip package manager

## Quick Setup (5 minutes)

### 1. Install PostgreSQL (if not already installed)

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Install with default settings
- Remember the password you set for 'postgres' user

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Configure Environment Variables

```bash
cd CodeRefine-main/backend
cp .env.example .env
```

Edit `.env` file:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgresql_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=coderefine
SECRET_KEY=generate-random-secret-key-here
GROQ_API_KEY=your_groq_api_key
```

### 3. Install Python Dependencies

```bash
cd CodeRefine-main/backend
pip install -r requirements.txt
```

### 4. Run Automatic Database Setup

```bash
cd CodeRefine-main
python scripts/setup_database.py
```

This script will:
- ✅ Connect to your local PostgreSQL
- ✅ Create 'coderefine' database
- ✅ Run all migrations
- ✅ Create tables (users, sessions, analysis_history, projects)
- ✅ Verify setup

### 5. Start the Backend Server

```bash
cd CodeRefine-main/backend
python main.py
```

Server will start at: http://localhost:8000

## Manual Migration Commands

If you need to run migrations manually:

```bash
cd CodeRefine-main/backend

# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history
```

## Database Schema

### Tables Created:

1. **users** - User accounts
   - id, username, email, hashed_password, full_name
   - is_active, is_verified, created_at, updated_at

2. **sessions** - Login sessions
   - id, user_id, session_token, ip_address
   - user_agent, expires_at, created_at

3. **analysis_history** - Code analysis records
   - id, user_id, project_id, language, mode
   - code_snippet, static_issues, ai_suggestions
   - aggregated_issues, optimized_code, confidence_score

4. **projects** - User projects
   - id, user_id, name, description, language
   - repository_url, is_active, created_at, updated_at

## Testing Database Connection

```bash
# Test PostgreSQL connection
psql -U postgres -h localhost -p 5432

# List databases
\l

# Connect to coderefine database
\c coderefine

# List tables
\dt

# View users table structure
\d users
```

## Troubleshooting

### Error: "could not connect to server"
- **Solution**: Make sure PostgreSQL is running
  ```bash
  # Windows: Check Services
  # macOS: brew services list
  # Linux: sudo systemctl status postgresql
  ```

### Error: "password authentication failed"
- **Solution**: Check POSTGRES_PASSWORD in .env matches your PostgreSQL password

### Error: "database does not exist"
- **Solution**: Run `python scripts/setup_database.py` again

### Error: "permission denied"
- **Solution**: Grant permissions:
  ```sql
  psql -U postgres
  GRANT ALL PRIVILEGES ON DATABASE coderefine TO postgres;
  ```

## API Endpoints After Setup

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Analysis (Protected)
- POST `/analyze` - Analyze code (requires authentication)

### History (Protected)
- GET `/api/history/` - List analysis history
- GET `/api/history/{id}` - Get specific analysis

### Projects (Protected)
- GET `/api/projects/` - List projects
- POST `/api/projects/` - Create project
- GET `/api/projects/{id}` - Get project
- PUT `/api/projects/{id}` - Update project
- DELETE `/api/projects/{id}` - Delete project

### Profile (Protected)
- GET `/api/profile/` - Get profile
- PUT `/api/profile/` - Update profile
- POST `/api/profile/change-password` - Change password

All protected endpoints require a Bearer token in the Authorization header.
