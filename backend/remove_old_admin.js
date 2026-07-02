const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: (process.env.NODE_ENV === 'production' || (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('onrender.com')))
        ? { rejectUnauthorized: false } 
        : false
});

async function removeOldAdmin() {
    try {
        const client = await pool.connect();
        const result = await client.query(
            "DELETE FROM admins WHERE email = 'malarsilkskarivalam@gmail.com'"
        );
        console.log(`Deleted ${result.rowCount} admin record(s) with old email.`);
        client.release();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

removeOldAdmin();
