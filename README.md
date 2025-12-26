# 🚀 Google Drive Access Sync Dashboard

A production-ready Next.js application that automatically synchronizes Google Drive folder permissions with an internal user access database.

## 📋 Project Status

### ✅ Completed (By Claude)

- **Project Setup**
  - ✅ Next.js 14+ with App Router and TypeScript strict mode
  - ✅ Tailwind CSS with shadcn/ui components
  - ✅ ESLint, Prettier, and code quality tools
  - ✅ Vitest and Playwright testing configuration
  - ✅ Complete folder structure

- **Database**
  - ✅ Prisma schema with User, SyncLog, AuditLog, SyncConfig models
  - ✅ Indexes for performance
  - ✅ Seed script with test data
  - ✅ Prisma client singleton

- **Google Integration**
  - ✅ OAuth2 client with token refresh
  - ✅ **Per-User Authentication** (Flow A): Creators sign in with their own Google accounts
  - ✅ **Secure Token Storage**: AES-256 encryption for user tokens
  - ✅ Drive API integration with rate limiting
  - ✅ Permission fetching with pagination
  - ✅ Edge case handling (suspended accounts, duplicates, etc.)

- **Sync Engine** (Core Feature)
  - ✅ 4-stage pipeline: FETCH → MAP → RECONCILE → PERSIST
  - ✅ User creation from Drive permissions
  - ✅ User update logic
  - ✅ Access revocation for removed users
  - ✅ Comprehensive error handling
  - ✅ Sync logging and audit trails

- **API Routes**
  - ✅ POST /api/sync - Trigger manual sync
  - ✅ GET /api/sync/status - Get sync status
  - ✅ GET /api/users - List users with pagination
  - ✅ POST /api/users - Create user manually
  - ✅ GET /api/users/[id] - Get single user
  - ✅ PATCH /api/users/[id] - Update user
  - ✅ DELETE /api/users/[id] - Delete user

- **Frontend**
  - ✅ Root layout with Tailwind CSS
  - ✅ Basic dashboard page
  - ✅ shadcn/ui Button and Table components
  - ✅ Responsive design foundation

- **Utilities**
  - ✅ Type definitions for all models
  - ✅ Zod validation schemas
  - ✅ Error handling utilities
  - ✅ Format utilities (dates, emails, etc.)
  - ✅ OpenTelemetry tracer setup
  - ✅ Structured logging

### 🔨 To Be Completed (By Junior Developer)

See the **Implementation Checklist** section in `claude.md` for detailed tasks.

**High Priority:**

1. Install dependencies: `pnpm install`
2. Configure .env file (see Setup section below)
3. Run database migrations
4. Build remaining UI components:
   - User table with TanStack Table
   - Sync button with loading states
   - Toast notifications
   - User detail modal
5. Implement state management (Zustand stores, TanStack Query hooks)
6. Write unit tests (target 80%+ coverage)
7. Write E2E tests (Playwright for all browsers)
8. Setup CI/CD pipeline (GitHub Actions)

## 🛠 Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript 5, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Prisma ORM, Turso (SQLite)
- **APIs:** Google Drive API, OAuth 2.0
- **State:** Zustand, TanStack Query
- **Testing:** Vitest (unit), Playwright (E2E)
- **Observability:** OpenTelemetry
- **Code Quality:** ESLint, Prettier, Husky

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Install Playwright browsers (for E2E tests)
pnpm exec playwright install
```

## ⚙️ Configuration

### 1. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in all the TODO fields in `.env`. See `.env.example` for detailed instructions on how to obtain each credential.

**Critical Environment Variables:**

- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `GOOGLE_REDIRECT_URI` - OAuth callback URL
- `GOOGLE_REDIRECT_URI` - OAuth callback URL
- `GOOGLE_REFRESH_TOKEN` - Generate using setup script (for Admin/System access)
- `GOOGLE_DRIVE_FOLDER_ID` - Default folder ID (optional)
- `TURSO_DATABASE_URL` - From Turso dashboard
- `TURSO_AUTH_TOKEN` - From Turso CLI
- `TOKEN_ENCRYPTION_KEY` - 32-byte Base64 key for encrypting user tokens (Generate with `openssl rand -base64 32`)

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID
3. Add authorized redirect URI: `http://localhost:3000/api/auth/google`
4. Copy Client ID and Client Secret to `.env`
5. Run setup script: `pnpm run setup:google-auth` (to be implemented)

### 3. Turso Database Setup

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create database
turso db create drive-sync-db

# Get database URL
turso db show drive-sync-db --url

# Create auth token
turso db tokens create drive-sync-db

# Copy URL and token to .env
```

### 4. Database Migration

```bash
# Generate Prisma client
pnpm prisma generate

# Push schema to database
pnpm prisma db push

# Seed database with test data
pnpm prisma db seed
```

## 🚀 Development

```bash
# Start development server
pnpm dev

# Run in separate terminals:
# Terminal 1: Dev server
pnpm dev

# Terminal 2: Unit tests (watch mode)
pnpm test --watch

# Terminal 3: Playwright UI mode
pnpm exec playwright test --ui
```

Visit [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Unit Tests (Vitest)

```bash
# Run all unit tests
pnpm test

# Run with coverage
pnpm test --coverage

# Run specific test file
pnpm test sync.test.ts

# Watch mode
pnpm test --watch
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests (headless)
pnpm exec playwright test

# Run with UI mode (recommended for development)
pnpm exec playwright test --ui

# Run specific browser
pnpm exec playwright test --project=chromium

# Run in headed mode
pnpm exec playwright test --headed

# Debug mode
pnpm exec playwright test --debug
```

### Testing Across Browsers & Devices

```bash
# Desktop browsers
pnpm exec playwright test --project=chromium --project=firefox --project=webkit

# Mobile devices
pnpm exec playwright test --project=iphone-13 --project=ipad-pro

# All browsers and devices (takes 20+ minutes)
pnpm exec playwright test
```

## 📁 Project Structure

```
/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── sync/                 # Sync endpoints
│   │   └── users/                # User endpoints
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Dashboard page
│
├── components/
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       └── table.tsx
│
├── lib/
│   ├── google/                   # Google API integration
│   │   ├── client.ts             # OAuth2 client
│   │   ├── drive.ts              # Drive API methods
│   │   └── permissions.ts        # Permission helpers
│   ├── prisma/
│   │   └── client.ts             # Prisma singleton
│   ├── sync/                     # Core sync engine
│   │   ├── reconcile.ts          # Main sync logic
│   │   ├── fetch-drive-users.ts
│   │   ├── create-users.ts
│   │   ├── update-users.ts
│   │   └── revoke-users.ts
│   ├── telemetry/
│   │   ├── tracer.ts             # OpenTelemetry setup
│   │   └── logger.ts             # Structured logging
│   ├── utils/                    # Utility functions
│   │   ├── cn.ts                 # className helper
│   │   ├── format.ts             # Formatting utilities
│   │   └── errors.ts             # Error classes
│   └── validations/              # Zod schemas
│       ├── user.schema.ts
│       ├── sync.schema.ts
│       └── api.schema.ts
│
├── types/                        # TypeScript types
│   ├── user.ts
│   ├── sync.ts
│   ├── google.ts
│   └── api.ts
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed script
│
├── tests/
│   ├── unit/                     # Unit tests (to be written)
│   ├── e2e/                      # E2E tests (to be written)
│   ├── fixtures/                 # Test fixtures
│   └── setup/                    # Test setup
│
├── scripts/
│   ├── setup-google-auth.ts      # OAuth setup helper (to be written)
│   └── sync-cron.ts              # Cron job (to be written)
│
├── .env.example                  # Environment variables template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── vitest.config.ts              # Vitest config
├── playwright.config.ts          # Playwright config
└── claude.md                     # Complete project brief
```

## 🔄 How the Sync Engine Works

### 4-Stage Pipeline

1. **FETCH** - Retrieve all permissions from Google Drive folder
   - Handles pagination (100 permissions per page)
   - Implements rate limiting with exponential backoff
   - Retries on 429 (rate limit) errors

2. **MAP** - Normalize Drive permissions to internal format
   - Filters out domain-wide and group permissions
   - Deduplicates by Google ID (prefers highest role)
   - Maps to MappedUser format

3. **RECONCILE** - Determine actions (create/update/revoke)
   - Compares Drive permissions with database users
   - Identifies new users → CREATE
   - Identifies changed users → UPDATE
   - Identifies removed users → REVOKE

4. **PERSIST** - Execute database operations
   - Creates audit logs for all changes
   - Logs sync results to SyncLog table
   - Returns SyncResult with created/updated/revoked counts

### Edge Cases Handled

- ✅ Suspended Google accounts (marked as suspended)
- ✅ Email aliases (normalized and deduplicated)
- ✅ Domain-wide permissions (filtered out)
- ✅ Group permissions (filtered out)
- ✅ Duplicate permissions (highest role wins)
- ✅ Token expiration (auto-refresh)
- ✅ Rate limiting (exponential backoff)
- ✅ Large folders (pagination)
- 🔨 Concurrent syncs (locking mechanism - to be implemented)

## 🔐 Security Features

- ✅ All credentials in environment variables (never in code)
- ✅ TypeScript strict mode (no implicit any)
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma)
- ✅ Security headers in Next.js config
- ✅ OAuth token refresh
- 🔨 CSRF protection (to be implemented)
- 🔨 Rate limiting per user (to be implemented)
- 🔨 Authentication middleware (to be implemented)

## 📊 API Endpoints

### Sync

- `POST /api/sync` - Trigger manual sync
  - Body: `{ folderId?: string, force?: boolean }`
  - Returns: `SyncResult`

- `GET /api/sync/status` - Get sync status
  - Returns: Last sync and recent history

### Users

- `GET /api/users` - List users
  - Query params: `page`, `pageSize`, `sortBy`, `sortOrder`, `status`, `source`, `search`
  - Returns: Paginated user list

- `POST /api/users` - Create user manually
  - Body: `CreateUserInput`
  - Returns: Created user

- `GET /api/users/[id]` - Get single user
  - Returns: User object

- `PATCH /api/users/[id]` - Update user
  - Body: `UpdateUserInput`
  - Returns: Updated user

- `DELETE /api/users/[id]` - Delete user
  - Returns: Success message

## 🐛 Troubleshooting

### "Cannot find module @/lib/..."

```bash
# Regenerate TypeScript paths
# Restart your IDE/editor
```

### "Prisma Client not generated"

```bash
pnpm prisma generate
```

### "Google API 401 Unauthorized"

```bash
# Regenerate OAuth token
pnpm run setup:google-auth
```

### "Turso database connection failed"

```bash
# Verify credentials
turso db show <db-name>

# Test connection
pnpm prisma db pull
```

### "Tests timing out"

Increase timeout in test file:

```typescript
test.setTimeout(60000); // 60 seconds
```

## 📚 Additional Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Google Drive API Guide](https://developers.google.com/drive/api/guides/about-sdk)
- [Playwright Testing](https://playwright.dev/docs/intro)
- [shadcn/ui Components](https://ui.shadcn.com/docs)

## 🎯 Next Steps for Junior Developer

1. **Setup Environment** (Week 1)
   - Install all dependencies
   - Configure .env file
   - Setup Google OAuth
   - Setup Turso database
   - Run migrations and seed

2. **Complete Frontend** (Week 2-3)
   - Install remaining shadcn/ui components
   - Build user table with TanStack Table
   - Implement sync button with loading states
   - Add toast notifications
   - Create user detail modal
   - Add state management (Zustand + TanStack Query)

3. **Write Tests** (Week 4-5)
   - Unit tests for sync engine (80%+ coverage)
   - Unit tests for API routes
   - E2E tests for sync flow
   - E2E tests for user table
   - Cross-browser testing
   - Mobile responsive testing

4. **Polish & Deploy** (Week 6)
   - Add error boundaries
   - Implement loading skeletons
   - Setup GitHub Actions CI/CD
   - Deploy to production (Vercel/Railway)
   - Monitor and fix issues

## 📝 License

Private project - All rights reserved

## 🤝 Contributing

Follow the guidelines in `claude.md` for:

- Git workflow (branch naming, commit messages)
- Code quality rules (TypeScript strict, function size)
- Testing requirements (80%+ coverage)
- Pull request template

---

**Built with ❤️ using Next.js, TypeScript, and Prisma**
