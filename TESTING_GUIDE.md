# 🧪 Testing Guide: Google Drive Access Tracker

This guide provides comprehensive testing procedures for the fully implemented Google Drive Access Tracker application, including all current features and functionality.

---

## 🛠️ Environment Setup

### Prerequisites
1. **Dependencies Installed:**
   ```bash
   pnpm install
   pnpm exec playwright install
   ```

2. **Environment Variables:**
   ```bash
   cp .env.example .env
   # Fill in all required variables:
   # GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, TURSO_DATABASE_URL, etc.
   ```

3. **Database Ready:**
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   pnpm prisma db seed
   ```

4. **Development Server:**
   ```bash
   pnpm dev
   ```

---

## 🔐 1. Authentication & User Management

### **Test 1.1: Google OAuth Login**
- **Steps:**
  1. Navigate to `/login`
  2. Click "Sign in with Google"
  3. Complete OAuth flow
  4. Verify redirect to `/onboarding` or `/dashboard`
- **Expected:** ✅ User session created, tokens encrypted, profile saved

### **Test 1.2: User Onboarding**
- **Steps:**
  1. Complete Google login
  2. Fill campaign creation form
  3. Submit with valid Drive folder URL
- **Expected:** ✅ Campaign created, user set as owner, initial sync triggered

### **Test 1.3: Session Persistence**
- **Steps:**
  1. Login and navigate between pages
  2. Refresh browser
  3. Test logout functionality
- **Expected:** ✅ Session maintained, secure logout

---

## 📁 2. Campaign Management

### **Test 2.1: Campaign Creation**
- **Steps:**
  1. Navigate to `/campaigns`
  2. Click "New Campaign"
  3. Fill form with valid Drive folder URL
  4. Submit and verify creation
- **Expected:** ✅ Campaign in database, public link generated

### **Test 2.2: Campaign Isolation**
- **Steps:**
  1. Create campaign as User A
  2. Login as User B
  3. Verify User B cannot see User A's campaigns
- **Expected:** ✅ User-scoped campaign access

### **Test 2.3: Public Access Links**
- **Steps:**
  1. Copy campaign access link
  2. Open in incognito window
  3. Submit lead form
- **Expected:** ✅ Public access works without authentication

---

## 👥 3. User Directory & Management

### **Test 3.1: User Directory Display**
- **Steps:**
  1. Navigate to `/dashboard`
  2. Verify table loads with user data
  3. Test responsive design on mobile
- **Expected:** ✅ Table displays, responsive layout works

### **Test 3.2: Search & Filtering**
- **Steps:**
  1. Enter search terms in search box
  2. Test campaign filter dropdown
  3. Verify real-time filtering
- **Expected:** ✅ Search works, filters apply correctly

### **Test 3.3: Bulk User Operations**
- **Steps:**
  1. Select multiple users via checkboxes
  2. Use bulk actions: Grant/Suspend/Delete
  3. Verify confirmation dialogs
- **Expected:** ✅ Operations complete, UI updates, database changes (Drive permissions revoked/granted)

### **Test 3.4: GDPR Wipe (Hard Delete)**
- **Steps:**
  1. Select a user in the Dashboard.
  2. Open the User Detail Sheet.
  3. Click "GDPR Wipe" (if available) or trigger via API `/api/users/gdpr-wipe`.
- **Expected:** ✅ User record completely removed from DB, Drive access revoked.

---

## 🔄 4. Sync Engine & Reliability

### **Test 4.1: Manual Sync & Dry Run**
- **Steps:**
  1. Click "Sync" button in Dashboard.
  2. Click "Dry Run" button.
- **Expected:** ✅ Dry Run shows expected changes without applying them. Manual Sync applies changes.

### **Test 4.2: Circuit Breaker (Queue Mode)**
- **Steps:**
  1. Simulate 3 consecutive Google API failures (e.g., by temporary disconnecting network or using mock errors).
  2. Submit a lead via a landing page.
- **Expected:** ✅ System enters "Queue Mode". User sees "Processing your access" message. Lead saved in DB with `hasAccess: false`.

### **Test 4.3: Retry Engine**
- **Steps:**
  1. Ensure a lead is in "Queue Mode" (from Test 4.2).
  2. Trigger the retry worker: `/api/access/retry?secret=YOUR_CRON_SECRET`.
- **Expected:** ✅ Failed grant is retried. If successful, user is granted access and DB updated.

### **Test 4.4: Self-Healing Auth (Health Checks)**
- **Steps:**
  1. Manually revoke app access in Google Account settings for a campaign owner.
  2. Run a sync for that campaign.
- **Expected:** ✅ Sync detects invalid token, marks campaign as `isActive: false` and status as `needs_reauth`.

---

## 📊 5. Analytics & A/B Testing

### **Test 5.1: A/B Test Traffic Splitting**
- **Steps:**
  1. Open a campaign landing page (`/access/[slug]`) in multiple browsers/incognito.
  2. Verify different variants (A vs B) are shown if configured.
  3. Submit leads on different variants.
- **Expected:** ✅ Traffic is distributed. Cookies ensure "sticky" variants.

### **Test 5.2: Winning Variant Analytics**
- **Steps:**
  1. Navigate to `/analytics`.
  2. Observe the "Campaign Metrics" table.
- **Expected:** ✅ The variant with the highest conversion rate is highlighted with a "Winner" badge.

### **Test 3.4: User Detail Sheets**
- **Steps:**
  1. Click user row in table
  2. Verify detail sheet opens
  3. Test edit capabilities
- **Expected:** ✅ User info displays, editing works

---

## 🔄 4. Sync Engine

### **Test 4.1: Manual Sync**
- **Steps:**
  1. Click "Sync Now" on dashboard
  2. Monitor progress indicator
  3. Check sync status endpoint
- **Expected:** ✅ Sync completes, users updated, logs created

### **Test 4.2: Sync Status Monitoring**
- **Steps:**
  1. Check `/api/sync/status` during sync
  2. Verify progress indicators
  3. Review sync logs in database
- **Expected:** ✅ Real-time status updates

---

## 📊 5. Analytics & Reporting

### **Test 5.1: Analytics Dashboard**
- **Steps:**
  1. Navigate to `/analytics`
  2. Verify charts and metrics load
  3. Test different time ranges
- **Expected:** ✅ Data displays, interactions work

### **Test 5.2: Data Visualization**
- **Steps:**
  1. Hover over chart elements
  2. Test responsive behavior
  3. Verify data accuracy
- **Expected:** ✅ Charts interactive, data correct

---

## ⚙️ 6. Settings & Configuration

### **Test 6.1: User Settings**
- **Steps:**
  1. Navigate to `/settings`
  2. Test profile editing
  3. Configure notifications
- **Expected:** ✅ Settings save, preferences applied

---

## 🔌 7. API Endpoints Testing

### **Test 7.1: Authentication APIs**
```bash
# Session management
curl -X GET http://localhost:3000/api/auth/session
curl -X GET http://localhost:3000/api/users/me
```

### **Test 7.2: CRUD Operations**
```bash
# Users
curl -X GET "http://localhost:3000/api/users?page=1&pageSize=10"
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"email":"test@example.com"}'

# Campaigns
curl -X GET http://localhost:3000/api/campaigns
curl -X POST http://localhost:3000/api/campaigns -H "Content-Type: application/json" -d '{"name":"Test","folderId":"id"}'
```

### **Test 7.3: Sync & Analytics**
```bash
# Sync operations
curl -X POST http://localhost:3000/api/sync
curl -X GET http://localhost:3000/api/sync/status

# Analytics
curl -X GET http://localhost:3000/api/analytics/overview
curl -X GET "http://localhost:3000/api/analytics/timeline?days=7"
```

---

## 🧪 8. Automated Testing

### **Unit Tests (Vitest)**
```bash
# Run all unit tests
pnpm test

# With coverage
pnpm test --coverage

# Watch mode
pnpm test --watch
```

### **E2E Tests (Playwright)**
```bash
# Run all E2E tests
pnpm exec playwright test

# UI mode (recommended)
pnpm exec playwright test --ui

# Specific browser
pnpm exec playwright test --project=chromium

# Debug mode
pnpm exec playwright test --debug
```

---

## 🔧 9. Troubleshooting

### **Common Issues**

- **OAuth Errors:** Check Google Cloud Console configuration
- **Database Issues:** Verify Turso connection and migrations
- **Sync Failures:** Ensure user has Drive folder access
- **API Errors:** Check authentication and permissions

### **Debug Commands**
```bash
# Type checking
npx tsc --noEmit

# Linting
pnpm lint

# Database inspection
pnpm prisma studio

# Build verification
pnpm build
```

---

## ✅ Testing Checklist

### **Authentication**
- [ ] Google OAuth login
- [ ] User onboarding
- [ ] Session management
- [ ] Logout functionality

### **Campaign Management**
- [ ] Campaign creation
- [ ] Campaign isolation
- [ ] Public access links
- [ ] Campaign sync

### **User Management**
- [ ] User directory display
- [ ] Search and filtering
- [ ] Bulk operations
- [ ] User detail views

### **Analytics**
- [ ] Dashboard metrics
- [ ] Chart interactions
- [ ] Time range selection

### **API Testing**
- [ ] Authentication endpoints
- [ ] CRUD operations
- [ ] Sync functionality
- [ ] Analytics data

### **Quality Assurance**
- [ ] TypeScript compilation
- [ ] ESLint checks
- [ ] Unit test coverage
- [ ] E2E test passing
- [ ] Responsive design
- [ ] Performance benchmarks

---

_Happy Testing! 🚀 For detailed navigation instructions, see the [Navigation & Testing Guide](./NAVIGATION_TESTING_GUIDE.md)._
