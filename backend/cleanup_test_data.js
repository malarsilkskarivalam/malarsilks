const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: (process.env.NODE_ENV === 'production' || (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('onrender.com')))
        ? { rejectUnauthorized: false } 
        : false
});

async function cleanupTestData() {
    try {
        const client = await pool.connect();
        
        console.log('Cleaning up test orders and users...');
        
        // 1. Delete order items
        await client.query('DELETE FROM order_items');
        console.log('Deleted all order items.');

        // 2. Delete orders
        await client.query('DELETE FROM orders');
        console.log('Deleted all orders.');

        // 3. Delete users
        await client.query('DELETE FROM users');
        console.log('Deleted all users.');

        client.release();
        console.log('Database cleanup completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error during database cleanup:', error.message);
        process.exit(1);
    }
}

cleanupTestData();
