import { Pool } from 'pg';
import 'dotenv/config';


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

// A quick test function to ensure the connection works
pool.connect((err: any, client: any, release: any) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Successfully connected to Postgres database!');
  release();
});

export default pool;