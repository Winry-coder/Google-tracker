# Google Drive Access Tracker - AI Coding Guidelines

## Architecture Overview

This is a Next.js 14 application with App Router that synchronizes Google Drive folder permissions with a user database. Key components:

- **Frontend**: Next.js 14, React 18, TypeScript (strict), Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Prisma ORM, Turso (SQLite)
- **State**: Zustand stores + TanStack Query for server state
- **Auth**: NextAuth.js with Google OAuth 2.0
- **Testing**: Vitest (unit) + Playwright (E2E)

## File Structure Conventions

Follow the mandatory structure from `claude.md`:

```
app/                    # Next.js App Router
  api/                  # API routes (RESTful with Zod validation)
  (dashboard)/          # Authenticated routes
  (auth)/               # Public auth routes
components/
  ui/                   # shadcn/ui components (button, table, etc.)
  tables/               # Data tables with TanStack Table
  layouts/              # Layout components
lib/
  prisma/client.ts      # Singleton Prisma client
  google/               # Google API helpers
  sync/                 # 4-stage sync engine (FETCH→MAP→RECONCILE→PERSIST)
  utils/cn.ts           # Tailwind class merger
  validations/          # Zod schemas
store/                  # Zustand stores (user-store, sync-store, ui-store)
hooks/                  # TanStack Query hooks (use-users, use-sync)
types/                  # TypeScript definitions
```

## Code Patterns

### Components
- Use shadcn/ui components with `cva` for variants
- Import `cn` from `@/lib/utils` for class merging
- Forward refs for custom components
- Example: `components/ui/button.tsx`

### API Routes
- Validate with Zod schemas from `lib/validations/`
- Return `APIResponse<T>` type
- Check session with `getServerSession(authOptions)`
- Handle errors with try/catch, return structured responses

### Database
- Use Prisma client singleton from `lib/prisma/client`
- Follow schema patterns: indexes on frequently queried fields
- Use transactions for multi-step operations
- Relations: User ↔ Campaign, User ↔ AuditLog

### State Management
- **Server state**: TanStack Query hooks in `hooks/`
- **Global state**: Zustand stores in `store/`
- **UI state**: Local component state or ui-store

### Authentication
- Session-based with NextAuth.js
- Admin role required for user management
- Google OAuth for Drive access

## Development Workflow

### Scripts
```bash
pnpm dev              # Development server
pnpm build            # Build with Prisma generate
pnpm lint             # ESLint check
pnpm typecheck        # TypeScript strict check
pnpm test             # Vitest unit tests
pnpm test:e2e         # Playwright E2E tests
pnpm prisma db push   # Apply schema changes
```

### Git Conventions
- **Branches**: `feature/description`, `fix/issue`, `test/add-tests`
- **Commits**: `feat: add feature`, `fix: resolve issue`, `test: add coverage`
- **PRs**: Include testing checklist, screenshots for UI changes

### Testing
- Unit tests: `tests/unit/` with Vitest
- E2E tests: `tests/e2e/` with Playwright
- Fixtures: `tests/fixtures/` for mock data
- Coverage target: 80%+

## Key Integration Points

### Google Drive Sync
- 4-stage pipeline in `lib/sync/reconcile.ts`
- Permissions fetched via `lib/google/drive.ts`
- Normalized in `lib/sync/map-permissions.ts`
- Persisted with audit logs

### Database Schema
- User model with Google-specific fields
- Campaign model for multi-campaign support
- AuditLog for all user/permission changes
- SyncLog for operation tracking

### Environment Variables
- Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Database: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
- Auth: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

## Quality Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **Linting**: ESLint with TypeScript rules, Prettier formatting
- **Imports**: Absolute paths with `@/` alias
- **Error Handling**: Structured error responses, logging
- **Security**: Input validation, session checks, encrypted tokens

## Common Patterns

### API Response Format
```typescript
type APIResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

### Component Props
```typescript
interface ComponentProps extends VariantProps<typeof componentVariants> {
  className?: string;
}
```

### Database Queries
```typescript
const users = await prisma.user.findMany({
  where: { status: 'active' },
  include: { campaign: true },
});
```

### Hook Pattern
```typescript
export function useUsers(params: UseUsersParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
  });
}
```</content>
<parameter name="filePath">c:\Users\LENOVO T14\Code\Google drive access tracker full stack application\seyi_stuff_1\.github\copilot-instructions.md