import { test, expect } from '@playwright/test';

// This test exercises the creator onboarding flow at a high level by
// mocking the backend API calls. It does NOT perform a real Google OAuth
// round-trip, but verifies that the UI flows correctly from onboarding
// to campaign creation.

test.describe('Creator onboarding and campaign creation', () => {
  test('mocked Google sign-in user can onboard and see campaign', async ({ page }) => {
    // Mock /api/users/me to indicate no campaigns yet
    await page.route('**/api/users/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-1',
          email: 'creator@example.com',
          role: 'viewer',
          name: 'Test Creator',
          hasCampaigns: false,
        }),
      });
    });

    // Mock POST /api/campaigns to simulate campaign creation
    await page.route('**/api/campaigns', async (route) => {
      if (route.request().method() === 'POST') {
        const now = new Date().toISOString();
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 'camp-1',
              name: "Test Creator's Campaign",
              slug: 'test-creators-campaign',
              description: null,
              folderId: 'mock-folder-id',
              isActive: true,
              totalLeads: 0,
              viewCount: 0,
              createdAt: now,
              updatedAt: now,
            },
          }),
        });
      } else {
        // For GET /api/campaigns (when campaigns page loads)
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [
              {
                id: 'camp-1',
                name: "Test Creator's Campaign",
                slug: 'test-creators-campaign',
                description: null,
                folderId: 'mock-folder-id',
                isActive: true,
                totalLeads: 0,
                viewCount: 0,
                emailSubject: null,
                emailBody: null,
                webhookUrl: null,
                variants: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          }),
        });
      }
    });

    // Start at onboarding page (assumes user is already authenticated by NextAuth)
    await page.goto('/onboarding');

    // Fill in the folder URL field
    const folderInput = page.getByLabel(/google drive folder link/i);
    await folderInput.fill('https://drive.google.com/drive/folders/mock-folder-id');

    // Click the "Create Campaign" button
    const createButton = page.getByRole('button', { name: /create campaign/i });
    await createButton.click();

    // After successful creation, user should be redirected to /campaigns
    await page.waitForURL('**/campaigns');

    // Verify the campaign appears in the campaign list
    await expect(page.getByText("Test Creator's Campaign")).toBeVisible();
  });
});