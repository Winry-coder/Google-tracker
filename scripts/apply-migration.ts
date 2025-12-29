import 'dotenv/config';
import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error('TURSO_DATABASE_URL not set');
  process.exit(1);
}

const client = createClient({
  url,
  authToken,
});

async function main() {
  const sqlPath = path.join(process.cwd(), 'migration.sql');
  let sql = '';
  try {
    // Try reading as utf8 first
    sql = fs.readFileSync(sqlPath, 'utf8');
    // Remove BOM if present
    if (sql.charCodeAt(0) === 0xfeff) {
      sql = sql.slice(1);
    }
    
    // If it looks like garbled UTF-16 (lots of high characters), try UTF-16LE
    // Or simpler: if it contains null bytes, it might be UTF-16
    if (sql.includes('\0')) {
      sql = fs.readFileSync(sqlPath, 'utf16le');
    }
  } catch (e) {
    console.error('Could not read migration.sql', e);
    process.exit(1);
  }

  console.log('SQL Length:', sql.length);
  console.log('SQL Preview:', sql.substring(0, 100));

  console.log('Testing connection...');
  try {
    await client.execute('SELECT 1');
    console.log('Connection OK');
  } catch (e) {
    console.error('Connection failed:', e);
    // Don't exit yet, try migration anyway or exit?
  }

  console.log('Applying migration to ' + url);
  console.log('SQL Preview:', sql.substring(0, 200));
  try {
    await client.executeMultiple(sql);
    console.log('✅ Migration applied successfully');
  } catch (e) {
    console.error('❌ Error applying migration:', e);
    process.exit(1);
  }
}

main();
