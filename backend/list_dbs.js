const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function listDatabases() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres', // Connect to default db
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    await client.connect();
    const res = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false;');
    console.log('Existing Databases:');
    res.rows.forEach(row => console.log(` - ${row.datname}`));
    await client.end();
  } catch (err) {
    console.error('Error listing databases:', err.message);
  }
}

listDatabases();
