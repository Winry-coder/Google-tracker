/* eslint-disable no-console */
import { google } from 'googleapis';
import http from 'http';
import url from 'url';
import 'dotenv/config';

/**
 * Helper script to generate Google OAuth Refresh Token
 * Usage: pnpm run setup:google-auth
 */

// Clean up env vars (remove quotes if present)
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID?.replace(/"/g, '');
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET?.replace(/"/g, '');
const REDIRECT_URI = 'http://localhost:3001/callback'; // Hardcoded for setup

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    '❌ Error: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env'
  );
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Define scopes needed - including full drive access to manage permissions on folders
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
];

async function main() {
  console.log('\n🔐 Google OAuth Setup Helper\n');
  console.log('⚠️  Make sure to stop your dev server (pnpm dev) first!\n');

  // Generate Auth URL - using port 3001 to avoid conflict with dev server
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Critical for getting refresh token
    scope: SCOPES,
    prompt: 'consent', // Force consent screen to ensure we get refresh token
    redirect_uri: 'http://localhost:3001/callback',
  });

  console.log('1️⃣  Open this URL in your browser:\n');
  console.log(authUrl);
  console.log('\nWaiting for code...');

  // Create temporary server to catch the callback
  // Note: We're listening on 3000 to match the REDIRECT_URI usually set in Google Console
  const server = http.createServer(async (req, res) => {
    try {
      if (!req.url) return;
      const q = url.parse(req.url, true).query;

      if (q.code) {
        console.log('\n2️⃣  Code received! Exchanging for tokens...');

        const { tokens } = await oauth2Client.getToken(q.code as string);

        if (tokens.refresh_token) {
          console.log('\n✅ SUCCESS! Refresh Token generated.');
          console.log('----------------------------------------');
          console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
          console.log('----------------------------------------');
          console.log('\n📝 Please manually add this line to your .env file.');
        } else {
          console.error(
            '\n⚠️  No refresh token returned. Did you approve access? Try running the script again.'
          );
        }

        res.end('Success! You can close this tab and check your terminal.');
        server.close();
        process.exit(0);
      }
    } catch (e) {
      console.error(e);
      res.end('Error occurred during authentication');
      server.close();
      process.exit(1);
    }
  });

  // Handle port conflicts (if app is already running on 3001)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      console.error(
        '\n❌ Error: Port 3001 is in use. Please stop any other services on this port and try again.'
      );
      process.exit(1);
    }
  });

  server.listen(3001, () => {
    console.log('\n✅ Listening on http://localhost:3001/callback');
  });
}

main().catch(console.error);
