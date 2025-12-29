# 🚀 Production Deployment Guide

This guide covers deploying the Google Drive Access Tracker to production environments.

---

## 📋 Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] **Domain Name**: Purchase and configure domain (e.g., `yourapp.com`)
- [ ] **SSL Certificate**: HTTPS required for OAuth (Let's Encrypt or Cloud provider)
- [ ] **Database**: Set up production database (Turso recommended)
- [ ] **Google Cloud**: Configure OAuth credentials for production domain

### ✅ Security Configuration
- [ ] **Environment Variables**: All secrets properly configured
- [ ] **Token Encryption**: Generate new `TOKEN_ENCRYPTION_KEY`
- [ ] **NextAuth Secret**: Generate new `NEXTAUTH_SECRET`
- [ ] **Cron Secret**: Generate new `CRON_SECRET`

### ✅ Application Testing
- [ ] **Build Test**: `pnpm build` passes without errors
- [ ] **Type Check**: `npx tsc --noEmit` passes
- [ ] **Lint Check**: `pnpm lint` passes
- [ ] **Unit Tests**: `pnpm test` passes
- [ ] **E2E Tests**: `pnpm exec playwright test` passes

---

## 🌐 Hosting Options

### **Option 1: Vercel (Recommended)**

#### 1. Account Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login
```

#### 2. Project Setup
```bash
# Initialize in project directory
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set project name
# - Configure build settings (should auto-detect Next.js)
```

#### 3. Environment Variables
Set these in Vercel Dashboard → Project Settings → Environment Variables:

```bash
# Authentication
NEXTAUTH_SECRET=your_production_nextauth_secret
NEXTAUTH_URL=https://yourdomain.com

# Google OAuth
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret

# Database
TURSO_DATABASE_URL=your_production_turso_url
TURSO_AUTH_TOKEN=your_production_turso_token

# Security
TOKEN_ENCRYPTION_KEY=your_production_encryption_key
CRON_SECRET=your_production_cron_secret

# Optional
DISCORD_WEBHOOK_URL=your_discord_webhook
```

#### 4. Database Migration
```bash
# Generate Prisma client
npx prisma generate

# Push schema to production database
npx prisma db push

# Optional: Seed with initial data
npx prisma db seed
```

#### 5. Deploy
```bash
# Deploy to production
vercel --prod

# Or deploy from dashboard
vercel deploy --prod
```

#### 6. Domain Configuration
- Go to Vercel Dashboard → Project Settings → Domains
- Add your custom domain
- Configure DNS records as instructed

### **Option 2: Railway**

#### 1. Account Setup
- Sign up at [railway.app](https://railway.app)
- Connect GitHub repository

#### 2. Database Setup
- Add PostgreSQL or MySQL database service
- Copy connection string to environment variables

#### 3. Environment Variables
Set in Railway Dashboard → Project Variables:

```bash
# Same variables as Vercel above
DATABASE_URL=postgresql://...
```

#### 4. Deploy
- Push to main branch or deploy manually
- Railway auto-deploys on git push

### **Option 3: DigitalOcean App Platform**

#### 1. Account Setup
- Sign up at [digitalocean.com](https://digitalocean.com)
- Create new app from GitHub repository

#### 2. App Configuration
- **Runtime**: Node.js
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Environment**: Production

#### 3. Environment Variables
Configure in App Settings:

```bash
# Same variables as above
NODE_ENV=production
```

#### 4. Database
- Add managed PostgreSQL database
- Configure connection string

---

## 🗄️ Database Setup

### Turso (Recommended for SQLite)
```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Create database
turso db create your-app-name

# Get connection details
turso db show your-app-name

# Set environment variables
TURSO_DATABASE_URL=libsql://your-app-name.turso.io
TURSO_AUTH_TOKEN=your_auth_token
```

### PostgreSQL (Alternative)
```bash
# Using Railway, Supabase, or PlanetScale
# Set DATABASE_URL to PostgreSQL connection string
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

---

## 🔐 Google Cloud Configuration

### 1. Create OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Navigate to "APIs & Services" → "Credentials"
4. Create "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs:
   - Production: `https://yourdomain.com/api/auth/callback/google`
   - Local: `http://localhost:3000/api/auth/callback/google`

### 2. Enable Required APIs
- Google Drive API
- Google OAuth2 API
- People API (for user profiles)

### 3. Domain Verification
- Verify domain ownership in Google Search Console
- Required for OAuth production use

---

## 🔧 Environment Variables Reference

### Required for Production
```bash
# Core Authentication
NEXTAUTH_SECRET=openssl_rand_base64_32
NEXTAUTH_URL=https://yourdomain.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_turso_token

# Security
TOKEN_ENCRYPTION_KEY=openssl_rand_base64_32
CRON_SECRET=openssl_rand_base64_32
```

### Optional Features
```bash
# Notifications
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Email (Phase 4)
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com

# Analytics
OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp.honeycomb.io
OTEL_EXPORTER_OTLP_HEADERS=x-honeycomb-team=your_key
```

---

## 🔄 Post-Deployment Setup

### 1. Test Authentication
```bash
# Visit your production URL
https://yourdomain.com

# Test Google OAuth login
# Should redirect to Google, then back to dashboard
```

### 2. Test Database Connection
```bash
# Check if you can create campaigns
# Verify data persists across sessions
```

### 3. Test Sync Engine
```bash
# Create a test campaign
# Run manual sync
# Verify users are imported from Google Drive
```

### 4. Configure Cron Jobs
```bash
# For automated sync (if using cron)
curl -X POST https://yourdomain.com/api/cron/sync \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## 📊 Monitoring & Maintenance

### Health Checks
- **Uptime Monitoring**: Set up monitoring service (UptimeRobot, Pingdom)
- **Error Tracking**: Configure Sentry or similar
- **Performance**: Monitor with Vercel Analytics or similar

### Database Backups
```bash
# Turso automatic backups
# Or manual export:
npx prisma db push --force-reset
```

### Log Monitoring
- Vercel/Railway provides built-in logging
- Check application logs for errors
- Monitor sync job success/failure

---

## 🚨 Troubleshooting

### Common Issues

**OAuth Redirect Mismatch**
- Verify redirect URI in Google Console matches exactly
- Check if domain is verified

**Database Connection Failed**
- Verify TURSO_DATABASE_URL and TURSO_AUTH_TOKEN
- Check if database region matches your app region

**Build Failures**
- Ensure all environment variables are set
- Check Node.js version compatibility
- Verify package.json scripts

**Sync Not Working**
- Verify Google OAuth tokens are valid
- Check Drive API permissions
- Test with smaller folder first

---

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables not in code
- [ ] Database credentials secure
- [ ] OAuth redirect URIs correct
- [ ] Cron endpoints protected
- [ ] Token encryption key unique
- [ ] No sensitive data in logs

---

## 📈 Scaling Considerations

### Database
- Turso scales automatically
- Consider PostgreSQL for very high traffic

### Performance
- Enable Vercel Edge Functions for global CDN
- Implement caching for analytics queries
- Use database indexes for large datasets

### Monitoring
- Set up alerts for failed syncs
- Monitor API usage and quotas
- Track user growth and engagement

---

## 🎯 Go-Live Checklist

- [ ] Domain configured and SSL working
- [ ] Google OAuth working in production
- [ ] Database connected and migrated
- [ ] Test user can create campaign
- [ ] Test sync imports users
- [ ] Test public access links work
- [ ] Analytics dashboard loads
- [ ] Mobile responsive design verified
- [ ] All environment variables set
- [ ] Monitoring and alerts configured
- [ ] Backup strategy in place

---

**Ready to deploy?** Follow the steps above and your lead generation machine will be live! 🚀

_For testing instructions after deployment, see [Navigation Testing Guide](./NAVIGATION_TESTING_GUIDE.md)._</content>
<parameter name="filePath">c:\Users\LENOVO T14\Code\Google drive access tracker full stack application\seyi_stuff_1\DEPLOYMENT.md