# Regina Recycle Application

Full-stack recycling app built with NestJS, React (Vite), Prisma, and PostgreSQL.

---

## Tech Stack

**Backend:** NestJS, Prisma, PostgreSQL, TypeScript  
**Frontend:** React, Vite, Tailwind CSS, Axios, TypeScript  
**Deployment:** Vercel

---

## Prerequisites

**Required for both Windows and macOS:**

- **Node.js v18+**
  - Download: https://nodejs.org/
  - Verify: `node --version`
- **Git**
  - Download: https://git-scm.com/
  - Verify: `git --version`
- **PostgreSQL v14+**
  - **macOS:** `brew install postgresql@14`
  - **Windows:** Download installer from https://www.postgresql.org/download/windows/
  - Verify: `psql --version`
- **npm** (comes with Node.js)
  - Verify: `npm --version`
- **Code Editor** (recommended: VS Code)
  - Download: https://code.visualstudio.com/

---

## Quick Start for New Team Members

### 1. Clone Repository

```bash
git clone https://github.com/reginarecycle/regina-recycle-app.git
cd regina-recycle-app
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

**Edit `backend/.env` - Get DATABASE_URL from team lead:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/regina_recycle_dev?schema=public"
PORT=4000
NODE_ENV=development
```

**For local PostgreSQL:**

**macOS/Linux:**

```bash
# Start PostgreSQL
brew services start postgresql@14  # macOS
# OR
sudo service postgresql start      # Linux

# Create database
psql postgres
CREATE DATABASE regina_recycle_dev;
\q
```

**Windows:**

```cmd
# PostgreSQL should auto-start after installation
# Open Command Prompt or PowerShell

# Create database
psql -U postgres
CREATE DATABASE regina_recycle_dev;
\q
```

**Update .env (all platforms):**

```env
# macOS/Linux
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/regina_recycle_dev?schema=public"

# Windows (usually uses postgres user)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/regina_recycle_dev?schema=public"
```

**Generate Prisma and migrate:**

```bash
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

Backend runs at: `http://localhost:4000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

**`frontend/.env`:**

```env
VITE_API_URL=http://localhost:4000/api
```

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Running Locally

**Terminal 1:**

```bash
cd backend && npm run start:dev
```

**Terminal 2:**

```bash
cd frontend && npm run dev
```

---

## Database Management

**Prisma Studio (Visual):**

```bash
cd backend
npx prisma studio
```

**Command Line:**

```bash
psql -U YOUR_USERNAME -d regina_recycle_dev
\dt                    # List tables
\d "User"             # View table structure
SELECT * FROM "User"; # View data
\q                    # Exit
```

**Create Migration:**

```bash
npx prisma migrate dev --name description
```

---

## Common Issues

**“Cannot find module ‘@prisma/client’”**

```bash
cd backend && npx prisma generate
```

**“Port 4000 already in use”**

_macOS/Linux:_

```bash
lsof -ti:4000 | xargs kill -9
```

_Windows (PowerShell):_

```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process -Force
```

_Windows (Command Prompt):_

```cmd
netstat -ano | findstr :4000
taskkill /PID <PID_NUMBER> /F
```

**“Database connection failed”**

_macOS:_

- Check PostgreSQL is running: `brew services list`
- Start if stopped: `brew services start postgresql@14`

_Linux:_

- Check status: `sudo service postgresql status`
- Start if stopped: `sudo service postgresql start`

_Windows:_

- Check Services app (Win + R → `services.msc`)
- Look for “postgresql-x64-14” service
- Right-click → Start if not running

**Frontend can’t connect to backend**

- Ensure backend is running: `http://localhost:4000/api/users`
- Check `VITE_API_URL` in `frontend/.env`
- Restart frontend after changing `.env`

**Windows-specific: “psql is not recognized”**

- Add PostgreSQL bin folder to PATH:
- Default location: `C:\Program Files\PostgreSQL\14\bin`
- System Properties → Environment Variables → Path → Add

---

## Useful Commands

**Backend:**

```bash
npm run start:dev      # Development with hot reload
npm run build          # Build for production
npx prisma studio      # Visual database browser
npx prisma generate    # Generate Prisma Client
npx prisma migrate dev # Create/apply migration
```

**Frontend:**

```bash
npm run dev            # Development server
npm run build          # Build for production
npm run preview        # Preview production build
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes, then commit
git add .
git commit -m "feat: description of changes"
git push origin feature/your-feature

# Create Pull Request on GitHub
# After approval, merge and delete branch
```

**Commit format:** `type: description`  
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## Environment Variables

**Backend `.env`:**

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"
PORT=4000
NODE_ENV=development
```

**Frontend `.env`:**

```env
VITE_API_URL=http://localhost:4000/api
```

---

## Getting Help

- **Docs:** [Prisma](https://prisma.io/docs) | [NestJS](https://docs.nestjs.com) | [Vite](https://vitejs.dev)

---

**Last Updated:** 10th February 2026
