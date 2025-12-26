# 🧪 Testing Guide: Access Tracker Pulse

This guide provides step-by-step instructions to verify every feature of the Access Tracker Pulse application.

---

## �️ Step 0: Setup Test Data

Before testing, you need to create an administrative account to access the dashboard.

1.  **Create Admin Account**:
    Run the following command in your terminal:

    ```bash
    npx tsx scripts/create-admin.ts admin@example.com password123 "Test Admin"
    ```

    - **User**: `admin@example.com`
    - **Password**: `password123`

2.  **Seed Database (Optional)**:
    To populate the dashboard with existing mock data/logs:
    ```bash
    npx prisma db seed
    ```

---

## �🔐 1. Authentication & Security

- **Admin Login**:
  - Navigate to `/login`.
  - Enter the credentials created in Step 0 (`admin@example.com` / `password123`).
  - **Verify**: Successful redirect to the dashboard `/`.
- **Protected Routes**:
  - Log out or use incognito mode.
  - Attempt to access `/` or `/api/users`.
  - **Verify**: Automatic redirect to `/login`.
- **Middleware Redirect Loop**:
  - Access `/login` while unauthenticated.
  - **Verify**: No infinite loading or browser "Too many redirects" error.

## 📁 2. Campaign Management

- **Create Campaign**:
  - On the dashboard, click **"New Campaign"**.
  - Fill in the Name, Slug, and a valid Google Drive Folder ID.
  - **Verify**: Campaign appears in the list.
- **Edit Campaign**:
  - Click the **Edit icon** on an existing campaign.
  - Change the name or description and save.
  - **Verify**: Changes are persisted in the table.
- **Delete Campaign**:
  - Use the **Delete icon** to remove a campaign.
  - **Verify**: Campaign is soft-deleted (disappears from UI but remains in DB).

## 🧪 3. A/B Testing & Variants

- **Add Variants**:
  - Open the Campaign Form.
  - Click **"Add Variant"** in the A/B Testing section.
  - Set different Titles, Descriptions, and Button Text for Variant A and Variant B.
- **Toggle Variants**:
  - Use the **Switch** in the form to enable/disable specific variants.
  - **Verify**: Only active variants are used on the public page.

## 🌐 4. Public Access Request Page

- **Landing Page Rendering**:
  - Navigate to `/access/[slug]` (e.g., `/access/my-campaign`).
  - **Verify**: The page displays the content from either the main campaign or a selected variant.
- **Traffic Splitting**:
  - Refresh the public page multiple times in a new private window.
  - **Verify**: You should rotate between different active variants (if more than one is active).
- **Lead Submission**:
  - Fill in the Name and Email on the public page and click the CTA.
  - **Verify**: Redirect to the "Access Granted" success screen.

## 📊 5. Lead Tracking & Analytics

- **Lead Attribution**:
  - After submitting a lead, check the Dashboard.
  - **Verify**: The new lead appears with the correct **Campaign** and **Variant** labels.
- **Conversion Metrics**:
  - Check the Campaign analytics table on the dashboard.
  - **Verify**: **Views** and **Leads** counts increment correctly for both the campaign and the specific variant.
- **CSV Export**:
  - Click the **"Export"** button.
  - **Verify**: A `.csv` file is downloaded with Name, Email, Source, and Campaign details.

## 🔄 6. Sync Engine (Technical)

- **Manual Sync**:
  - Click the **"Sync Now"** button on the dashboard.
  - **Verify**: The status indicator shows "Syncing" and then "Success".
- **Database Reconciliation**:
  - Manually add/remove a permission in the Google Drive folder.
  - Run the sync.
  - **Verify**: The dashboard reflects the changes (new users added, removed users marked as revoked).

## 🧹 7. Bulk Operations

- **Bulk Delete**:
  - Select multiple users using the checkboxes in the main table.
  - Click the **Delete** button in the selection toolbar.
  - **Verify**: All selected users are removed from the list.

---

## 🛠 Troubleshooting

- **Build Errors**: Run `pnpm build` to ensure all types are valid.
- **Console Logs**: Check the browser devtools and server terminal for any red error messages.
- **Database**: Use `npx prisma studio` to inspect the raw data if counts seem incorrect.

_Happy Testing!_ 🚀
