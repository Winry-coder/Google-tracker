# 🧪 Testing Guide: Access Tracker Pulse

This guide provides step-by-step instructions to verify every feature of the Access Tracker Pulse application, including the new **Creator Per-User OAuth** flow.

---

## 🛠️ Step 0: Environment Setup

Before testing, ensure your environment is correctly configured.

1.  **Environment Variables**:
    Ensure your `.env` file includes the new encryption key:

    ```env
    TOKEN_ENCRYPTION_KEY=your_base64_key_here
    ```

    _Tip: Generate a key using `openssl rand -base64 32` or an online generator._

2.  **Database**:
    Run migrations to ensure your schema is up to date:

    ```bash
    npx prisma migrate dev
    ```

3.  **Create Admin Account (Optional)**:
    If you still want to test the admin portal specifically:
    ```bash
    npx tsx scripts/create-admin.ts admin@example.com password123 "Test Admin"
    ```

---

## 🔐 1. Authentication & Onboarding (New Flow)

The application now supports individual creators signing in with their own Google accounts.

- **Creator Login**:
  - Navigate to `/login`.
  - Click **"Sign in with Google"**.
  - Authorize the application with a Google account.
  - **Verify**: You are redirected to `/onboarding` (if first time) or `/campaigns` (if returning).

- **Onboarding Flow**:
  - After signing in for the first time, you should see the **"Connect Folder"** step.
  - Paste a valid Google Drive folder URL (that the signed-in user has access to).
  - Click **"Create Campaign"**.
  - **Verify**: You are redirected to the campaign dashboard, and the campaign is created with your user as the `owner`.

- **Admin Login (Legacy)**:
  - use the credentials `admin@example.com` / `password123`.
  - **Verify**: Access to the global admin view (if authorized).

---

## 📁 2. Campaign Management

Campaigns are now scoped to the logged-in user.

- **Verify Ownership**:
  - Sign in as **User A**. Create a campaign "User A Campaign".
  - Sign out and sign in as **User B**.
  - **Verify**: User B **cannot** see "User A Campaign" in their list.

- **Create Additional Campaigns**:
  - From the dashboard, click **"New Campaign"**.
  - Enter details and a _different_ Drive Folder ID.
  - **Verify**: Both campaigns appear in the list.

- **Public Access**:
  - Navigate to the public link `/access/[slug]`.
  - **Verify**: The page loads correctly regardless of who is logged in (it's public).

---

## 🧪 3. A/B Testing & Variants

- **Add Variants**:
  - Open a Campaign.
  - Click **"Add Variant"**.
  - Configure unique titles/descriptions.
- **Traffic Splitting**:
  - Open the public link in multiple private windows.
  - **Verify**: You see different variants rotated (sticky sessions might keep showing the same one per browser/cookie).

---

## 📊 4. Lead Tracking & Analytics

- **Submit a Lead**:
  - On the public access page, enter a "Test User" email.
  - Submit the form.
- **Verify Attribution**:
  - Go back to the dashboard (as the Campaign Owner).
  - **Verify**: The "Total Leads" count has incremented.
  - **Verify**: The new lead appears in the user list, tagged with the correct Campaign and Source.

---

## 🔄 5. Sync Engine

The sync now runs using the **Campaign Owner's** credentials, not a global token.

- **Manual Sync**:
  - Click **"Sync Now"** on the dashboard.
  - **Verify**: The system connects to Drive using _your_ specific encrypted tokens.
  - **Verify**: Changes in your Drive folder (new editors/viewers) are reflected in the user list.

---

## 🛠 Troubleshooting

- **"Invalid Key Length" Error**:
  - Check `TOKEN_ENCRYPTION_KEY` in `.env`. It must be a 32-byte key encoded in Base64.
- **"Folder not found" during onboarding**:
  - Ensure the Google Account you signed in with actually has "Editor" or "Viewer" access to that specific folder.
- **Lint/Type Errors**:
  - Run `pnpm build` or `npx tsc` to verify type safety.

_Happy Testing!_ 🚀
