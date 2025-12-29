# 🔐 Environment Variables Deployment Guide

## Quick Overview

This guide walks you through configuring every environment variable needed to deploy your application to production. Follow the **specific platform section** for your chosen deployment platform.

---

## 📋 Environment Variables Checklist

### **Required (Must Configure)**
- [ ] `NEXTAUTH_SECRET` - Session encryption key
- [ ] `NEXTAUTH_URL` - Your production domain
- [ ] `GOOGLE_CLIENT_ID` - OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` - OAuth client secret
- [ ] `DATABASE_URL` - Production database URL
- [ ] `TURSO_DATABASE_URL` - Turso database (if using Turso)
- [ ] `TURSO_AUTH_TOKEN` - Turso authentication token

### **Strongly Recommended**
- [ ] `TOKEN_ENCRYPTION_KEY` - Encrypts OAuth tokens
- [ ] `CRON_SECRET` - Sync endpoint security

### **Optional (Phase 4+)**
- [ ] `DISCORD_WEBHOOK_URL` - Lead notifications
- [ ] `SLACK_WEBHOOK_URL` - Lead notifications
- [ ] `RESEND_API_KEY` - Email service
- [ ] `CLEARBIT_API_KEY` - Lead enrichment

### **Not Needed for Basic Deployment**
- [ ] `GOOGLE_REDIRECT_URI` - Handled by NextAuth automatically
- [ ] `GOOGLE_REFRESH_TOKEN` - Only for background sync without user login
- [ ] `GOOGLE_DRIVE_FOLDER_ID` - Set per user/campaign in app
- [ ] `EMAIL_SERVER_*` - Use RESEND_API_KEY instead
- [ ] `DEFAULT_USER_ROLE` - Has default value (viewer)
- [ ] `OTEL_*` - Only for advanced telemetry
- [ ] `NEXT_PUBLIC_API_URL` - Usually same as NEXTAUTH_URL

---

## 🔑 Generating Required Secrets

### **1. NEXTAUTH_SECRET** (Session Encryption Key)
Generate a cryptographically secure random string:

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

**On Windows PowerShell:**
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**Example output:**
```
8Jk7mP2qR9vL4nX8dG1fH5tY6wZ3sA0bC9e7mK5r2x
```

### **2. TOKEN_ENCRYPTION_KEY** (OAuth Token Encryption)
Use the same method as above to generate another 32-byte key:

```bash
openssl rand -base64 32
```

### **3. CRON_SECRET** (API Security)
Generate a random string for webhook authorization:

```bash
openssl rand -base64 32
```

---

## 🌐 Google OAuth Configuration

### **Step 1: Create Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a Project"** → **"New Project"**
3. Name: `"Google Drive Access Tracker"`
4. Click **"Create"**
5. Wait for project to be created

### **Step 2: Enable Required APIs**

1. Go to [API Library](https://console.cloud.google.com/apis/library)
2. Search for **"Google Drive API"** → Click **"Enable"**
3. Search for **"Google Sheets API"** → Click **"Enable"** (optional, for exports)
4. Search for **"Google People API"** → Click **"Enable"** (for user info)

### **Step 3: Create OAuth 2.0 Credentials**

1. Go to [Credentials](https://console.cloud.google.com/apis/credentials)
2. Click **"+ Create Credentials"** → **"OAuth Client ID"**
3. Click **"Configure OAuth Consent Screen"**
4. Choose **"External"** (unless you have a Google Workspace domain)
5. Fill in:
   - **App name**: "Google Drive Access Tracker"
   - **User support email**: Your email
   - **Developer contact**: Your email
6. Click **"Save & Continue"**
7. On "Scopes" page, click **"Add or Remove Scopes"**
8. Add these scopes:
   - `https://www.googleapis.com/auth/drive.readonly` (View Google Drive)
   - `https://www.googleapis.com/auth/userinfo.email` (Get email)
   - `https://www.googleapis.com/auth/userinfo.profile` (Get profile)
9. Click **"Update & Continue"** → **"Save & Continue"**
10. On "Test users" page, click **"+ Add Users"** and add your email

### **Step 4: Get OAuth Credentials**

1. Go back to [Credentials](https://console.cloud.google.com/apis/credentials)
2. Click **"+ Create Credentials"** → **"OAuth Client ID"**
3. Choose **"Web application"**
4. Name: `"Production"`
5. Under **"Authorized JavaScript origins"**, add:
   - `http://localhost:3000` (for testing)
   - `https://yourdomain.com` (replace with your domain)
6. Under **"Authorized redirect URIs"**, add:
   - `http://localhost:3000/api/auth/callback/google` (testing)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Click **"Create"**
8. Copy your credentials:
   - **GOOGLE_CLIENT_ID**: The long string ending in `.apps.googleusercontent.com`
   - **GOOGLE_CLIENT_SECRET**: The secret key

**Save these immediately** - you'll need them for all platforms!

---

## 🗄️ Database Setup Options

### **Option A: Turso (Recommended) - Free Tier Available**

#### **Setup Steps:**

1. Go to [Turso Dashboard](https://app.turso.tech/)
2. Sign up with GitHub
3. Click **"Create a Database"**
4. Name: `"google-tracker-prod"` (or similar)
5. Choose region closest to users
6. Click **"Create"**
7. In dashboard, click your database name
8. Under **"Connection"** tab, copy:
   - **Database URL**: Looks like `libsql://your-db-name.turso.io`
   - **Auth Token**: Long random string

**Your environment variables:**
```env
TURSO_DATABASE_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your_token_here
DATABASE_URL=libsql://your-db-name.turso.io?authToken=your_token_here
```

### **Option B: Railway PostgreSQL**

1. Go to [Railway Dashboard](https://railway.app/)
2. Create new project
3. Add **"PostgreSQL"** database
4. Copy connection string from "Connect" tab
5. Set as `DATABASE_URL`

### **Option C: Vercel Postgres**

1. In Vercel project settings
2. Go to **"Storage"** → **"Create"** → **"Postgres"**
3. Copy connection string
4. Set as `DATABASE_URL`

### **Option D: Neon (PostgreSQL)**

1. Go to [Neon Console](https://console.neon.tech/)
2. Create new project
3. Copy connection string
4. Set as `DATABASE_URL`

---

## 📱 Platform-Specific Setup

### **VERCEL DEPLOYMENT**

#### **Step 1: Connect Repository**

1. Go to [Vercel](https://vercel.com/)
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository
4. Click **"Import"**

#### **Step 2: Configure Environment Variables**

In Vercel project settings:

1. Go to **"Settings"** → **"Environment Variables"**
2. Add each variable:

```
NEXTAUTH_SECRET = your_generated_secret
NEXTAUTH_URL = https://your-project.vercel.app
GOOGLE_CLIENT_ID = your_google_client_id
GOOGLE_CLIENT_SECRET = your_google_client_secret
TURSO_DATABASE_URL = libsql://...
TURSO_AUTH_TOKEN = your_token
DATABASE_URL = libsql://...?authToken=...
TOKEN_ENCRYPTION_KEY = your_generated_key
CRON_SECRET = your_generated_secret
NEXT_PUBLIC_API_URL = https://your-project.vercel.app
```

3. Make sure to select **"All Environments"** for each

#### **Step 3: Deploy**

1. In Vercel, go to **"Deployments"**
2. Click **"Deploy Now"** or let it auto-deploy on push
3. Wait for build to complete
4. Click production URL when ready

#### **Step 4: Run Database Migration**

After first deployment:

```bash
# From your local machine
TURSO_DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." pnpm prisma db push
```

---

### **RAILWAY DEPLOYMENT**

#### **Step 1: Connect Repository**

1. Go to [Railway](https://railway.app/)
2. Click **"Create New Project"** → **"Deploy from GitHub"**
3. Select your repository
4. Click **"Deploy"**

#### **Step 2: Add PostgreSQL**

1. In project, click **"+ Add"** → **"Database"** → **"PostgreSQL"**
2. Railway will automatically set `DATABASE_URL`

#### **Step 3: Configure Environment Variables**

1. Click your project
2. Go to **"Variables"** tab
3. Add all variables manually:

```
NEXTAUTH_SECRET = your_generated_secret
NEXTAUTH_URL = https://your-project-name.up.railway.app
GOOGLE_CLIENT_ID = your_google_client_id
GOOGLE_CLIENT_SECRET = your_google_client_secret
TOKEN_ENCRYPTION_KEY = your_generated_key
CRON_SECRET = your_generated_secret
NEXT_PUBLIC_API_URL = https://your-project-name.up.railway.app
```

**Note:** Railway automatically provides `DATABASE_URL` from PostgreSQL plugin

#### **Step 4: Deploy & Migrate**

1. Railway auto-deploys on push
2. Go to **"Deployments"** tab to watch build
3. After successful deploy, run:

```bash
RAILWAY_TOKEN="your_token" railway run pnpm prisma db push
```

---

### **DIGITALOCEAN APP PLATFORM**

#### **Step 1: Prepare Configuration**

Create `app.yaml` in your repo root:

```yaml
name: google-tracker
services:
- name: web
  github:
    repo: your-username/your-repo
    branch: main
  build_command: pnpm install && pnpm build
  run_command: pnpm start
  http_port: 3000
  envs:
  - key: NEXTAUTH_SECRET
    scope: RUN_AND_BUILD_TIME
    value: ${NEXTAUTH_SECRET}
  - key: NEXTAUTH_URL
    scope: RUN_AND_BUILD_TIME
    value: ${NEXTAUTH_URL}
  # ... add all other variables
databases:
- name: postgres
  engine: PG
  version: "14"
  production: true
```

#### **Step 2: Create DigitalOcean App**

1. Go to [DigitalOcean](https://cloud.digitalocean.com/)
2. Click **"Create"** → **"Apps"**
3. Select **"GitHub"** and authorize
4. Select your repository
5. Click **"Edit Plan"**
6. Ensure **"Basic (Starter)"** is selected (cheapest)
7. Click **"Next"**

#### **Step 3: Configure Environment Variables**

In app creation form:
1. For each environment variable, add it
2. Make sure PostgreSQL is selected as database

```
NEXTAUTH_SECRET = your_secret
NEXTAUTH_URL = https://your-app-slug.ondigitalocean.app
GOOGLE_CLIENT_ID = your_id
GOOGLE_CLIENT_SECRET = your_secret
DATABASE_URL = provided_automatically_by_do
TOKEN_ENCRYPTION_KEY = your_key
CRON_SECRET = your_secret
NEXT_PUBLIC_API_URL = https://your-app-slug.ondigitalocean.app
```

#### **Step 4: Deploy**

1. Click **"Create Resources"**
2. Wait for deployment (5-10 minutes)
3. Once complete, click your app URL

#### **Step 5: Run Migration**

After deployment:

```bash
# SSH into your app container
doctl apps get YOUR_APP_ID

# Then run migration
pnpm prisma db push
```

---

## ✅ Verification Checklist

After configuring all environment variables for your chosen platform:

### **1. Verify Google OAuth**
```bash
curl -X GET "https://yourdomain.com/api/auth/signin"
```
Should show login page without errors.

### **2. Test Database Connection**
```bash
# Your platform should show database is connected in logs
pnpm prisma db push
```

### **3. Test OAuth Redirect**
1. Open your production URL
2. Click "Sign In with Google"
3. Complete OAuth flow
4. Should redirect back to dashboard

### **4. Check Logs**
Monitor logs for any environment variable errors:
```
❌ Error: GOOGLE_CLIENT_ID not configured
✅ All environment variables loaded successfully
```

### **5. Test API Endpoint**
```bash
curl -X GET "https://yourdomain.com/api/users" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
Should return user data (not 401 Unauthorized).

---

## 🔧 Common Issues & Solutions

### **Issue: "NEXTAUTH_SECRET is not set"**
**Solution:** Make sure you've added `NEXTAUTH_SECRET` in your platform's environment variable settings. Verify it's set for "All Environments" (not just preview/production).

### **Issue: "Google OAuth redirect mismatch"**
**Solution:** 
1. Go to [Google Console](https://console.cloud.google.com/apis/credentials)
2. Click your OAuth app
3. Add your production domain to "Authorized redirect URIs"
4. Format: `https://yourdomain.com/api/auth/callback/google`

### **Issue: "DATABASE_URL is not set"**
**Solution:**
- **Vercel/Railway/DigitalOcean**: May need to manually create/connect database
- Check platform's database service is running
- Copy connection string to `DATABASE_URL` variable

### **Issue: Database migration fails**
**Solution:**
```bash
# Run locally first to test
pnpm prisma db push

# Then on production:
vercel env pull .env.local  # For Vercel
pnpm prisma db push
```

### **Issue: "Token encryption key error"**
**Solution:**
1. Regenerate `TOKEN_ENCRYPTION_KEY`:
   ```bash
   openssl rand -base64 32
   ```
2. Update in platform settings
3. Restart deployment

---

## 📊 Environment Variables Reference

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `NEXTAUTH_SECRET` | Session encryption | ✅ Yes | `8Jk7mP2q...` |
| `NEXTAUTH_URL` | Auth callback URL | ✅ Yes | `https://app.example.com` |
| `GOOGLE_CLIENT_ID` | OAuth client ID | ✅ Yes | `123...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth secret | ✅ Yes | `GOCSP...` |
| `DATABASE_URL` | Database connection | ✅ Yes | `libsql://db.turso.io?...` |
| `TURSO_DATABASE_URL` | Turso URL | ✅ (if Turso) | `libsql://db.turso.io` |
| `TURSO_AUTH_TOKEN` | Turso token | ✅ (if Turso) | `token_...` |
| `TOKEN_ENCRYPTION_KEY` | Token encryption | 🟡 Recommended | `8Jk7mP2q...` |
| `CRON_SECRET` | Sync endpoint key | 🟡 Recommended | `8Jk7mP2q...` |
| `NEXT_PUBLIC_API_URL` | Public API URL | 🟡 Usually same as NEXTAUTH_URL | `https://app.example.com` |
| `GOOGLE_REDIRECT_URI` | OAuth redirect | ❌ Not needed (auto-handled) | - |
| `GOOGLE_REFRESH_TOKEN` | Background sync | ❌ Optional (advanced) | - |
| `GOOGLE_DRIVE_FOLDER_ID` | Default folder | ❌ Set in app per user | - |
| `DEFAULT_USER_ROLE` | Default role | ❌ Has default (viewer) | - |
| `DISCORD_WEBHOOK_URL` | Discord notifications | ⚪ Optional | `https://discord.com/api/webhooks/...` |
| `SLACK_WEBHOOK_URL` | Slack notifications | ⚪ Optional | `https://hooks.slack.com/...` |
| `RESEND_API_KEY` | Email service | ⚪ Optional (Phase 4) | `re_...` |
| `EMAIL_SERVER_*` | Email config | ❌ Use RESEND_API_KEY instead | - |
| `OTEL_*` | Telemetry | ❌ Optional (advanced) | - |
| `CLEARBIT_API_KEY` | Lead enrichment | ⚪ Optional (Phase 4) | `sk_...` |

---

## 🚀 Quick Start: 30-Minute Setup

### **For Vercel (Easiest):**

1. **Generate secrets (5 min):**
   ```bash
   openssl rand -base64 32  # NEXTAUTH_SECRET
   openssl rand -base64 32  # TOKEN_ENCRYPTION_KEY
   openssl rand -base64 32  # CRON_SECRET
   ```

2. **Get Google credentials (10 min):**
   - Go to [Google Console](https://console.cloud.google.com)
   - Create OAuth app
   - Copy `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

3. **Create Turso database (5 min):**
   - Go to [Turso](https://app.turso.tech/)
   - Create database
   - Copy `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`

4. **Deploy on Vercel (10 min):**
   - Import GitHub repo to Vercel
   - Add all 7 environment variables
   - Click Deploy
   - **Done! 🎉**

**Total time: ~30 minutes**

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs/projects/environment-variables
- **Railway Docs**: https://docs.railway.app/deploy/dockerfiles
- **DigitalOcean Docs**: https://docs.digitalocean.com/products/app-platform/
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2
- **Turso Docs**: https://docs.turso.tech/

---

## ✅ Deployment Verification

After completing all environment variable setup:

```bash
# 1. Verify all variables are set
echo $NEXTAUTH_SECRET  # Should print your secret
echo $GOOGLE_CLIENT_ID  # Should print your ID

# 2. Test build locally
pnpm build

# 3. Check for any missing env errors
pnpm start

# 4. Visit http://localhost:3000 and test login
```

**Once all checks pass, you're ready for production! 🚀**
