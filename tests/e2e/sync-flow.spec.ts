import { test, expect } from '@playwright/test';

test.describe('Sync Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should trigger sync when clicking sync button', async ({ page }) => {
    // Mock the sync API response
    await page.route('**/api/sync', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            success: true,
            created: [],
            updated: [],
            revoked: [],
            duration: 1500,
            timestamp: new Date().toISOString(),
          },
        }),
      });
    });

    // Mock the sync status API response
    await page.route('**/api/sync/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            lastSync: {
              id: 'sync-1',
              status: 'success',
              timestamp: new Date().toISOString(),
              usersCreated: 3,
              usersUpdated: 1,
              usersRevoked: 0,
              duration: 1500,
            },
            recentSyncs: [],
          },
        }),
      });
    });

    const syncButton = page.getByRole('button', { name: /sync now/i });

    // Click the sync button
    await syncButton.click();

    // Verify button shows syncing state
    await expect(page.getByRole('button', { name: /syncing/i })).toBeVisible();

    // Wait for sync to complete
    await expect(syncButton).toBeEnabled({ timeout: 10000 });

    // Verify success toast appears
    await expect(page.getByText(/sync completed/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test('should display error toast when sync fails', async ({ page }) => {
    // Mock a failed sync API response
    await page.route('**/api/sync', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'OAuth token expired and refresh failed',
        }),
      });
    });

    const syncButton = page.getByRole('button', { name: /sync now/i });

    // Click the sync button
    await syncButton.click();

    // Wait for error toast
    await expect(page.getByText(/sync failed/i)).toBeVisible({
      timeout: 5000,
    });

    // Verify error message is displayed
    await expect(page.getByText(/oauth token expired/i)).toBeVisible();
  });

  test('should show sync status after successful sync', async ({ page }) => {
    // Mock successful sync
    await page.route('**/api/sync', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            success: true,
            created: [{ id: '1', email: 'new@example.com' }],
            updated: [{ id: '2', email: 'updated@example.com' }],
            revoked: [],
            duration: 2500,
            timestamp: new Date().toISOString(),
          },
        }),
      });
    });

    // Mock sync status
    await page.route('**/api/sync/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            lastSync: {
              id: 'sync-1',
              status: 'success',
              timestamp: new Date().toISOString(),
              usersCreated: 1,
              usersUpdated: 1,
              usersRevoked: 0,
              duration: 2500,
            },
            recentSyncs: [],
          },
        }),
      });
    });

    // Trigger sync
    await page.click('button:has-text("Sync Now")');

    // Wait for success notification
    await expect(page.getByText(/created: 1, updated: 1/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test('should disable sync button while syncing', async ({ page }) => {
    // Mock a slow sync
    await page.route('**/api/sync', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            success: true,
            created: [],
            updated: [],
            revoked: [],
            duration: 3000,
            timestamp: new Date().toISOString(),
          },
        }),
      });
    });

    const syncButton = page.getByRole('button', { name: /sync now/i });

    // Click sync button
    await syncButton.click();

    // Verify button is disabled
    await expect(syncButton).toBeDisabled();

    // Verify syncing text is shown
    await expect(page.getByText(/syncing/i)).toBeVisible();
  });
});
