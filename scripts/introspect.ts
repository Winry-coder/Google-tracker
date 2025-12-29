import 'dotenv/config';
import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url: url!,
  authToken,
});

async function main() {
  console.log('Introspecting "users" table...');
  try {
    const result = await client.execute('PRAGMA table_info("users")');
    const columns = result.rows.map(row => row.name);
    console.log('Columns in "users" table:');
    columns.forEach(c => console.log(' - ' + c));
  } catch (e) {
    console.error('Error:', e);
  }
}

main();
