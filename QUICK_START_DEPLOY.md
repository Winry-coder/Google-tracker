# ⚡ QUICK START: ENVIRONMENT VARIABLES & DEPLOYMENT

## 🎯 Your 30-Minute Production Launch Checklist

### **Step 1: Generate Secrets** (5 min)

**On Mac/Linux:**
```bash
openssl rand -base64 32  # NEXTAUTH_SECRET
openssl rand -base64 32  # TOKEN_ENCRYPTION_KEY  
openssl rand -base64 32  # CRON_SECRET
```

**On Windows PowerShell:**
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```
*Run command 3 times and save each output*

---

### **Step 2: Google OAuth Setup** (10 min)

Go to: https://console.cloud.google.com/

1. Create new project: `"Google Drive Access Tracker"`
2. Enable APIs:
   - Google Drive API
   - Google Sheets API (optional)
   - Google People API
3. Create OAuth Credential:
   - Type: Web application
   - **⚠️ CRITICAL: Add Authorized Redirect URIs:**
     - `http://localhost:3000/api/auth/callback/google` (local testing)
     - `https://yourdomain.com/api/auth/callback/google` (production)
4. Copy credentials:
   ```
   GOOGLE_CLIENT_ID = your_long_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET = your_secret_key
   ```

**🚨 IMPORTANT:** Without the correct redirect URIs, Google OAuth will fail with "redirect_uri_mismatch" error!

---

### **Step 3: Create Database** (5 min)

**Easiest Option: Turso** (https://turso.tech)

1. Sign up with GitHub
2. Create database: `"google-tracker-prod"`
3. Copy these:
   ```
   TURSO_DATABASE_URL = libsql://your-db-name.turso.io
   TURSO_AUTH_TOKEN = your_long_token
   DATABASE_URL = libsql://your-db-name.turso.io?authToken=your_long_token
   ```

---

### **Step 4: Deploy to Vercel** (10 min) ⭐ Easiest

1. Go to: https://vercel.com
2. Import your GitHub repository
3. Go to **Settings → Environment Variables**
4. Add these 7 variables:

```env
NEXTAUTH_SECRET = [from step 1]
NEXTAUTH_URL = https://your-project.vercel.app
GOOGLE_CLIENT_ID = [from step 2]
GOOGLE_CLIENT_SECRET = [from step 2]
TURSO_DATABASE_URL = [from step 3]
TURSO_AUTH_TOKEN = [from step 3]
DATABASE_URL = [from step 3]
TOKEN_ENCRYPTION_KEY = [from step 1]
CRON_SECRET = [from step 1]
NEXT_PUBLIC_API_URL = https://your-project.vercel.app
```

5. Click **Deploy**
6. Wait 3-5 minutes for build
7. Click production URL when ready ✅

---

## 🚢 Alternative Deployment Platforms

### **Railway** (45 min)
```
1. Visit: https://railway.app
2. Create new project → Deploy from GitHub
3. Add PostgreSQL database
4. Add all environment variables
5. Deploy
```

### **DigitalOcean** (1 hour)
```
1. Visit: https://cloud.digitalocean.com
2. Create new app from GitHub
3. Add environment variables
4. Select Basic plan
5. Deploy
```

---

## ✅ Production Verification

After deployment, verify everything works:

```bash
# 1. Open your production URL
https://your-project.vercel.app

# 2. Click "Sign In with Google"
# Should redirect to Google login

# 3. Complete OAuth flow
# Should redirect back to your app with user logged in

# 4. Check database
# Should have new user record

# 5. Test campaign creation
# Should work without errors
```

---

## 📋 Complete Environment Variables List

### **Required (9 variables)**
```env
NEXTAUTH_SECRET = [generated]
NEXTAUTH_URL = https://your-project.vercel.app
GOOGLE_CLIENT_ID = [from Google Console]
GOOGLE_CLIENT_SECRET = [from Google Console]
TURSO_DATABASE_URL = [from Turso]
TURSO_AUTH_TOKEN = [from Turso]
DATABASE_URL = [combine above two]
TOKEN_ENCRYPTION_KEY = [generated]
CRON_SECRET = [generated]
NEXT_PUBLIC_API_URL = https://your-project.vercel.app
```

### **Optional (you can add later)**
```env
DISCORD_WEBHOOK_URL = https://discord.com/api/webhooks/...  # Lead notifications
SLACK_WEBHOOK_URL = https://hooks.slack.com/...           # Lead notifications
RESEND_API_KEY = re_...                                    # Email service
CLEARBIT_API_KEY = sk_...                                  # Lead enrichment
```

### **Not Needed**
```env
GOOGLE_REDIRECT_URI = # Handled automatically by NextAuth
GOOGLE_REFRESH_TOKEN = # Only for advanced background sync
GOOGLE_DRIVE_FOLDER_ID = # Set per user in the app
DEFAULT_USER_ROLE = # Has default value (viewer)
EMAIL_SERVER_* = # Use RESEND_API_KEY instead
OTEL_* = # Advanced telemetry only
```

---

## 📚 Need More Details?

All environment variables documented in:
→ **[ENV_DEPLOYMENT_GUIDE.md](./ENV_DEPLOYMENT_GUIDE.md)**

Platform-specific guides in:
→ **[DEPLOYMENT.md](./DEPLOYMENT.md)**

Testing procedures in:
→ **[TESTING_START_HERE.md](./TESTING_START_HERE.md)**

---

## 🚨 Common Issues

| Problem | Solution |
|---------|----------|
| "NEXTAUTH_SECRET not set" | Add to env vars, select "All Environments" |
| "Google OAuth redirect mismatch" | Add exact URL to Google Console redirect URIs |
| "DATABASE_URL not found" | Add database env vars (TURSO_DATABASE_URL + TURSO_AUTH_TOKEN) |
| "Build failed" | Check logs, ensure all 9 env vars are set |
| "Can't sign in" | Verify Google Client ID/Secret are correct |

---

## 🎉 You're Ready to Launch!

**Required Time: 30-45 minutes**

**Your 3 Required Secrets:**
- [ ] NEXTAUTH_SECRET ← Generate
- [ ] TOKEN_ENCRYPTION_KEY ← Generate
- [ ] CRON_SECRET ← Generate

**Your 2 Google Credentials:**
- [ ] GOOGLE_CLIENT_ID ← From Google Console
- [ ] GOOGLE_CLIENT_SECRET ← From Google Console

**Your 3 Database Credentials:**
- [ ] TURSO_DATABASE_URL ← From Turso
- [ ] TURSO_AUTH_TOKEN ← From Turso
- [ ] DATABASE_URL ← Combine above two

**Once you have all 8: DEPLOY! 🚀**

---

## 📞 Emergency Links

- Google Console: https://console.cloud.google.com
- Turso: https://app.turso.tech
- Vercel: https://vercel.com
- Railway: https://railway.app
- DigitalOcean: https://cloud.digitalocean.com

---

**Questions?** See [ENV_DEPLOYMENT_GUIDE.md](./ENV_DEPLOYMENT_GUIDE.md) for complete details.
