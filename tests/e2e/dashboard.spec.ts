import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display dashboard title and description', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /drive sync dashboard/i })
    ).toBeVisible();

    await expect(
      page.getByText(/manage google drive folder permissions/i)
    ).toBeVisible();
  });

  test('should display sync button', async ({ page }) => {
    const syncButton = page.getByRole('button', { name: /sync now/i });
    await expect(syncButton).toBeVisible();
    await expect(syncButton).toBeEnabled();
  });

  test('should display getting started section', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /getting started/i })
    ).toBeVisible();

    await expect(page.getByText(/configure your .env file/i)).toBeVisible();
  });

  test('should display users table with headers', async ({ page }) => {
    await expect(
      page.getByRole('columnheader', { name: /email/i })
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: /name/i })
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: /status/i })
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: /source/i })
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: /last synced/i })
    ).toBeVisible();
  });

  test('should display empty state message when no users', async ({ page }) => {
    // This test assumes no users are loaded initially
    await expect(
      page.getByText(/no users found. run a sync to fetch users/i)
    ).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page, viewport }) => {
    // Only run this test on mobile viewports
    if (viewport && viewport.width < 768) {
      // Check that dashboard is still visible and usable
      await expect(
        page.getByRole('heading', { name: /drive sync dashboard/i })
      ).toBeVisible();

      // Sync button should be visible
      await expect(
        page.getByRole('button', { name: /sync now/i })
      ).toBeVisible();
    }
  });
});
