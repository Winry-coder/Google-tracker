# 🧭 Navigation & Testing Guide: Google Drive Access Tracker

This comprehensive guide provides step-by-step navigation through all features of the Google Drive Access Tracker application, along with detailed testing procedures to ensure everything works properly.

## 📋 Table of Contents

1. [Application Overview](#-application-overview)
2. [Navigation Structure](#-navigation-structure)
3. [Core Features Testing](#-core-features-testing)
4. [User Authentication Flow](#-user-authentication-flow)
5. [Campaign Management](#-campaign-management)
6. [User Directory & Management](#-user-directory--management)
7. [Analytics & Reporting](#-analytics--reporting)
8. [Settings & Configuration](#-settings--configuration)
9. [API Endpoints Testing](#-api-endpoints-testing)
10. [Troubleshooting Guide](#-troubleshooting-guide)

---

## 🎯 Application Overview

The Google Drive Access Tracker is a comprehensive SaaS application that automatically synchronizes Google Drive folder permissions with an internal user access database. It features:

### ✅ **Implemented Features:**

#### **Authentication & User Management**
- Google OAuth 2.0 integration with per-user authentication
- Secure token encryption (AES-256)
- User onboarding flow
- Session management with NextAuth.js

#### **Campaign Management**
- Multi-campaign support with user ownership
- Google Drive folder integration
- Campaign-specific sync configurations
- Public access links for lead capture

#### **Sync Engine**
- Automated Google Drive permission synchronization
- 4-stage pipeline: FETCH → MAP → RECONCILE → PERSIST
- Real-time sync status monitoring
- Comprehensive error handling and logging

#### **User Interface**
- Responsive dashboard with AuthenticatedLayout
- User directory with advanced filtering and search
- Bulk user operations (grant/revoke/suspend access)
- Mobile-responsive design
- Activity feed and notifications

#### **Analytics & Reporting**
- Campaign performance metrics
- Lead tracking and attribution
- Timeline analytics (7/30/90 days)
- User engagement statistics

#### **API Infrastructure**
- RESTful API endpoints
- Rate limiting and security
- Comprehensive error handling
- OpenTelemetry tracing

#### **Developer Experience**
- TypeScript strict mode
- ESLint and Prettier configuration
- Vitest unit testing
- Playwright E2E testing
- Prisma ORM with database migrations

### 🔄 **Expected Features (Future Implementation):**

#### **Advanced Features**
- Discord webhook notifications
- Email automation
- Advanced user segmentation
- Export functionality (CSV/PDF)
- Advanced filtering and search
- User activity logging

#### **Enterprise Features**
- Team collaboration
- Role-based access control
- Audit trails
- Compliance reporting
- Multi-organization support

---

## 🧭 Navigation Structure

### **Public Routes**
```
/
/help
/privacy
/terms
/access/[slug]          # Public campaign access
```

### **Authenticated Routes**
```
/dashboard              # Main dashboard with user directory
/campaigns              # Campaign management
/analytics              # Analytics and reporting
/settings               # User settings and preferences
/onboarding             # Initial setup flow
```

### **API Routes**
```
/api/auth/[...nextauth] # Authentication
/api/users              # User management
/api/campaigns          # Campaign operations
/api/sync               # Synchronization
/api/analytics          # Analytics data
/api/stats              # System statistics
```

---

## 🧪 Core Features Testing

### **Prerequisites**

1. **Environment Setup:**
   ```bash
   # Install dependencies
   pnpm install

   # Copy environment file
   cp .env.example .env

   # Configure required environment variables
   # GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc.
   ```

2. **Database Setup:**
   ```bash
   # Generate Prisma client
   pnpm prisma generate

   # Run migrations
   pnpm prisma db push

   # Seed with test data
   pnpm prisma db seed
   ```

3. **Start Development Server:**
   ```bash
   pnpm dev
   ```

---

## 🔐 User Authentication Flow

### **Test 1: Google OAuth Login**

1. **Navigate to Login Page:**
   - Visit `http://localhost:3000/login`
   - Verify page loads with "Sign in with Google" button

2. **Initiate OAuth Flow:**
   - Click "Sign in with Google"
   - Verify redirect to Google OAuth consent screen

3. **Complete Authentication:**
   - Grant permissions for Google Drive access
   - Verify redirect to `/onboarding` (first time) or `/dashboard` (returning user)

4. **Expected Results:**
   - ✅ User session created
   - ✅ JWT token stored in cookies
   - ✅ User profile data saved to database
   - ✅ Google tokens encrypted and stored securely

### **Test 2: User Onboarding**

1. **Access Onboarding:**
   - Complete Google login
   - Verify redirect to `/onboarding`

2. **Campaign Creation:**
   - Enter campaign name
   - Provide Google Drive folder URL
   - Click "Create Campaign"

3. **Expected Results:**
   - ✅ Campaign created in database
   - ✅ User set as campaign owner
   - ✅ Redirect to campaign dashboard
   - ✅ Folder permissions synced automatically

### **Test 3: Session Management**

1. **Test Session Persistence:**
   - Login and navigate between pages
   - Refresh browser
   - Verify session maintained

2. **Test Logout:**
   - Click logout button
   - Verify redirect to login page
   - Verify session destroyed

---

## 📁 Campaign Management

### **Test 4: Campaign Creation**

1. **Access Campaign Management:**
   - Navigate to `/campaigns`
   - Click "New Campaign" or "Create Campaign"

2. **Fill Campaign Details:**
   - Campaign Name: "Test Campaign"
   - Description: "Testing campaign functionality"
   - Google Drive Folder URL: Valid folder URL with edit access

3. **Create Campaign:**
   - Click "Create Campaign"
   - Verify loading state and success message

4. **Expected Results:**
   - ✅ Campaign appears in campaign list
   - ✅ Public access link generated
   - ✅ Initial sync triggered
   - ✅ Campaign owner set to current user

### **Test 5: Campaign Permissions**

1. **Test User Isolation:**
   - Create campaign as User A
   - Login as User B
   - Verify User B cannot see User A's campaigns

2. **Test Public Access:**
   - Copy campaign access link
   - Open in incognito/private window
   - Verify public access works without authentication

### **Test 6: Campaign Sync**

1. **Manual Sync:**
   - Go to campaign dashboard
   - Click "Sync Now" button
   - Verify sync progress indicator

2. **Monitor Sync Status:**
   - Check `/api/sync/status` endpoint
   - Verify sync logs in database
   - Confirm user permissions updated

---

## 👥 User Directory & Management

### **Test 7: User Directory Display**

1. **Access Dashboard:**
   - Navigate to `/dashboard`
   - Verify user directory table loads

2. **Table Features:**
   - ✅ Search functionality
   - ✅ Campaign filtering
   - ✅ Status badges (Active/Suspended/Revoked)
   - ✅ Bulk selection checkboxes
   - ✅ Responsive design (desktop/mobile views)

### **Test 8: User Search & Filtering**

1. **Test Search:**
   - Enter email/name in search box
   - Verify real-time filtering
   - Test partial matches

2. **Test Campaign Filter:**
   - Select different campaigns from dropdown
   - Verify users filtered by campaign
   - Test "All Campaigns" and "Manual/Untagged" options

### **Test 9: Bulk User Operations**

1. **Select Multiple Users:**
   - Check multiple user checkboxes
   - Verify bulk actions bar appears

2. **Test Bulk Actions:**
   - **Grant Access:** Change status to "active"
   - **Suspend Access:** Change status to "suspended"
   - **Delete Users:** Remove users from system
   - Verify confirmation dialogs

3. **Expected Results:**
   - ✅ Status changes reflected in UI
   - ✅ Database updates correctly
   - ✅ Audit logs created

### **Test 10: User Detail View**

1. **Access User Details:**
   - Click on user row in table
   - Verify user detail sheet opens

2. **Test User Information:**
   - ✅ Profile information display
   - ✅ Campaign associations
   - ✅ Access history
   - ✅ Edit capabilities

---

## 📊 Analytics & Reporting

### **Test 11: Analytics Dashboard**

1. **Access Analytics:**
   - Navigate to `/analytics`
   - Verify page loads with charts and metrics

2. **Test Analytics Features:**
   - ✅ Campaign performance metrics
   - ✅ Lead attribution tracking
   - ✅ Timeline views (7/30/90 days)
   - ✅ User engagement statistics

### **Test 12: Data Visualization**

1. **Test Chart Interactions:**
   - Hover over chart elements
   - Verify tooltips display correct data
   - Test responsive behavior

2. **Test Time Range Selection:**
   - Switch between different time periods
   - Verify data updates correctly
   - Test date range picker

---

## ⚙️ Settings & Configuration

### **Test 13: User Settings**

1. **Access Settings:**
   - Navigate to `/settings`
   - Verify settings page loads

2. **Test Settings Features:**
   - ✅ Profile information editing
   - ✅ Notification preferences
   - ✅ API key management
   - ✅ Account deletion

### **Test 14: Notification Settings**

1. **Configure Notifications:**
   - Enable/disable email notifications
   - Configure Discord webhooks
   - Test notification delivery

---

## 🔌 API Endpoints Testing

### **Test 15: Authentication APIs**

```bash
# Test session endpoint
curl -X GET http://localhost:3000/api/auth/session

# Test user profile
curl -X GET http://localhost:3000/api/users/me
```

### **Test 16: User Management APIs**

```bash
# List users with pagination
curl -X GET "http://localhost:3000/api/users?page=1&pageSize=10"

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# Update user
curl -X PATCH http://localhost:3000/api/users/[id] \
  -H "Content-Type: application/json" \
  -d '{"status":"active"}'
```

### **Test 17: Campaign APIs**

```bash
# List campaigns
curl -X GET http://localhost:3000/api/campaigns

# Create campaign
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Campaign","folderId":"folder_id"}'
```

### **Test 18: Sync APIs**

```bash
# Trigger manual sync
curl -X POST http://localhost:3000/api/sync

# Check sync status
curl -X GET http://localhost:3000/api/sync/status
```

### **Test 19: Analytics APIs**

```bash
# Get overview metrics
curl -X GET http://localhost:3000/api/analytics/overview

# Get campaign analytics
curl -X GET http://localhost:3000/api/analytics/campaigns

# Get timeline data
curl -X GET "http://localhost:3000/api/analytics/timeline?days=7"
```

---

## 🔧 Troubleshooting Guide

### **Common Issues & Solutions**

#### **Authentication Issues**
- **"Invalid client" error:**
  - Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
  - Verify OAuth redirect URI in Google Cloud Console

- **"Access denied" during sync:**
  - Ensure user has granted Drive API permissions
  - Check token encryption key validity

#### **Database Issues**
- **Migration errors:**
  ```bash
  pnpm prisma db push --force-reset
  pnpm prisma db seed
  ```

- **Connection issues:**
  - Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`
  - Check Turso database status

#### **Sync Issues**
- **"Folder not found":**
  - Verify folder ID is correct
  - Ensure user has access to the folder
  - Check Google Drive API permissions

- **Rate limiting:**
  - Implement exponential backoff
  - Check Google API quota usage

#### **UI Issues**
- **Components not rendering:**
  - Check console for TypeScript errors
  - Verify all required props passed

- **Styling issues:**
  - Check Tailwind CSS classes
  - Verify component imports

#### **API Issues**
- **403 Forbidden:**
  - Check authentication middleware
  - Verify user permissions

- **500 Internal Server Error:**
  - Check server logs
  - Verify environment variables
  - Test database connectivity

### **Debug Commands**

```bash
# Check TypeScript compilation
npx tsc --noEmit

# Run linting
pnpm lint

# Check database connection
pnpm prisma studio

# View API logs
tail -f logs/app.log

# Test API endpoints
curl -X GET http://localhost:3000/api/health
```

### **Performance Monitoring**

- **Database queries:** Use Prisma Studio to monitor slow queries
- **API response times:** Check Network tab in browser dev tools
- **Memory usage:** Monitor Node.js process metrics
- **Error rates:** Check application logs for error patterns

---

## 📈 Testing Checklist

### **Pre-Deployment Checklist**
- [ ] All TypeScript compilation passes
- [ ] ESLint passes with no errors
- [ ] All unit tests pass (target: 80%+ coverage)
- [ ] E2E tests pass on all browsers
- [ ] Database migrations tested
- [ ] Environment variables validated
- [ ] API endpoints tested with various inputs
- [ ] Authentication flow tested end-to-end
- [ ] Responsive design tested on mobile/desktop
- [ ] Performance benchmarks met

### **Production Readiness**
- [ ] Error monitoring configured (Sentry/LogRocket)
- [ ] Analytics tracking implemented
- [ ] Backup strategy in place
- [ ] SSL certificates configured
- [ ] CDN setup for static assets
- [ ] Rate limiting configured
- [ ] Security headers implemented

---

## 🎯 Quick Feature Verification

Use this checklist for rapid feature verification:

### **Authentication**
- [ ] Google OAuth login works
- [ ] User onboarding completes
- [ ] Session persistence works
- [ ] Logout functionality works

### **Core Functionality**
- [ ] Campaign creation works
- [ ] User directory displays
- [ ] Search/filtering works
- [ ] Bulk operations work
- [ ] Sync functionality works

### **User Experience**
- [ ] Responsive design works
- [ ] Loading states display
- [ ] Error messages clear
- [ ] Navigation smooth

### **Data Integrity**
- [ ] Database operations work
- [ ] API responses correct
- [ ] Data validation works
- [ ] Audit logs created

---

_Happy Testing! 🚀 If you encounter any issues not covered here, please check the application logs and database state for additional debugging information._