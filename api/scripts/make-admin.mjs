// Gives an existing account the ADMINISTRATOR role.
// Usage: npm run make-admin -- lea@test.fr
// No need to log in again: the API reads the role from the database on each request.
import 'dotenv/config';
import pg from 'pg';

const email = process.argv[2];
if (!email) {
  console.error('Usage: npm run make-admin -- <email>');
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const { rowCount } = await client.query(
    `UPDATE "User" SET role = 'ADMINISTRATOR' WHERE email = $1`,
    [email],
  );
  if (rowCount === 0) {
    console.error(`No account with the email ${email}`);
    process.exitCode = 1;
  } else {
    console.log(`${email} is now ADMINISTRATOR`);
  }
} finally {
  await client.end();
}
