import { google, Auth } from 'googleapis';
import { GoogleAPIError } from '@/lib/utils/errors';
import type { OAuth2Config } from '@/types/google';

/**
 * Creates and configures OAuth2 client for Google APIs
 * Handles token refresh and error handling
 */
export function createOAuthClient(
  config?: Partial<OAuth2Config>
): Auth.OAuth2Client {
  const clientId = config?.clientId || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = config?.clientSecret || process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = config?.redirectUri || process.env.GOOGLE_REDIRECT_URI;

  /* TODO: Junior Developer — Ensure these environment variables are set:
   * GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
   * See .env.example for instructions
   */
  if (!clientId || !clientSecret || !redirectUri) {
    const missing = [];
    if (!clientId) missing.push('GOOGLE_CLIENT_ID');
    if (!clientSecret) missing.push('GOOGLE_CLIENT_SECRET');
    if (!redirectUri) missing.push('GOOGLE_REDIRECT_URI');

    throw new GoogleAPIError(
      `Missing required OAuth2 credentials: ${missing.join(', ')}. Check your .env file.`
    );
  }

  const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  const refreshToken = config?.refreshToken || process.env.GOOGLE_REFRESH_TOKEN;

  if (refreshToken) {
    client.setCredentials({
      refresh_token: refreshToken,
    });
  }

  return client;
}

/**
 * Gets a valid OAuth2 client with refreshed tokens
 * Automatically refreshes expired tokens
 */
export async function getValidOAuthClient(): Promise<Auth.OAuth2Client> {
  const client = createOAuthClient();

  try {
    await client.getAccessToken();
    return client;
  } catch (error) {
    if ((error as { code?: number }).code === 401) {
      try {
        await client.refreshAccessToken();
        return client;
      } catch (refreshError) {
        throw new GoogleAPIError(
          'OAuth token expired and refresh failed',
          401,
          refreshError as Error
        );
      }
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new GoogleAPIError(
      `Failed to get valid OAuth client: ${message}`,
      500,
      error as Error
    );
  }
}
