# 🗄️ DATABASE SETUP FOR PRODUCTION

## ✅ What You Need to Do

### **1. Get Your Turso Database Details**
From your Turso dashboard (https://app.turso.tech), copy these two values:

```
TURSO_DATABASE_URL = libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN = your_long_auth_token_string
```

### **2. Set Environment Variables in Production**
In your deployment platform (Vercel/Railway/etc.), add these variables:

```env
TURSO_DATABASE_URL = libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN = your_long_auth_token_string
DATABASE_URL = libsql://your-db-name.turso.io?authToken=your_long_auth_token_string
```

### **3. Run Database Migration (After First Deploy)**
Once your app is deployed, run this command to create the database tables:

```bash
# For Vercel:
vercel env pull .env.local
pnpm prisma db push

# For Railway:
railway run pnpm prisma db push

# For DigitalOcean:
# SSH into your app and run: pnpm prisma db push
```

## 🎯 That's It!

**You don't need to:**
- ❌ Create tables manually
- ❌ Run SQL scripts
- ❌ Configure database schema
- ❌ Set up indexes or constraints

**Prisma handles everything automatically** when you run `pnpm prisma db push`.

## 📊 What Gets Created

Your database will have these tables:
- `User` - User accounts and Google OAuth data
- `Campaign` - Marketing campaigns
- `Variant` - A/B testing variants
- `SyncLog` - Sync operation logs
- `AuditLog` - User action history
- `Account` - OAuth account links
- `Session` - User sessions

## 🚀 Next Steps

1. **Deploy your app** with the 3 database environment variables
2. **Run the migration**: `pnpm prisma db push`
3. **Test the app** - database should work automatically!

**Questions?** The database schema is in `prisma/schema.prisma` if you want to see what gets created.