# SI CRM Backend

REST API for SI CRM, a real estate client relationship management system built for SI Realty Group.

## Technologies

- Node.js + NestJS
- TypeScript
- Prisma 6 (ORM)
- PostgreSQL
- JWT (access token + refresh token with rotation)
- bcryptjs + SHA256
- class-validator
- Docker + Docker Compose

## Architecture

Clean Architecture with SOLID principles, organized in 4 layers per module:

- `domain` — entities and repository interfaces
- `application` — use cases with business rules
- `infra` — concrete implementations (Prisma, guards)
- `presentation` — controllers and DTOs

## Modules

- `auth` — register, login, refresh, logout
- `users` — authenticated user data
- `statuses` — dynamic kanban status CRUD
- `leads` — full lead CRUD with filters
- `kanban` — grouped board view and lead movement
- `activities` — activity history auto-registered on lead movement
- `dashboard` — aggregated stats, distributions and recent data
- `ai` — chat proxy to AI microservice

## Requirements

- Node.js 18+
- Docker + Docker Compose
- npm

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

## Running Locally

**1. Start the database:**

```bash
docker-compose up -d
```

**2. Install dependencies:**

```bash
npm install
```

**3. Run migrations:**

```bash
npx prisma migrate dev
```

**4. Start the server:**

```bash
npm run start:dev
```

The API will be available at `http://localhost:3333`

## Integration

- **Frontend:** expects this API at `http://localhost:3333`
- **AI Microservice:** expects FastAPI running at `http://localhost:8000` (configurable via `AI_SERVICE_URL`)

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout |
| GET | `/users/me` | Get authenticated user |
| PATCH | `/users/me` | Update user name |
| GET | `/statuses` | List statuses |
| POST | `/statuses` | Create status |
| PATCH | `/statuses/:id` | Update status |
| DELETE | `/statuses/:id` | Delete status |
| GET | `/leads` | List leads with filters |
| POST | `/leads` | Create lead |
| GET | `/leads/:id` | Get lead by id |
| PATCH | `/leads/:id` | Update lead |
| DELETE | `/leads/:id` | Delete lead |
| GET | `/kanban` | Get kanban board |
| PATCH | `/kanban/:leadId/move` | Move lead to status |
| GET | `/activities` | List activities |
| GET | `/dashboard` | Get dashboard data |
| POST | `/ai/chat` | Send message to AI |