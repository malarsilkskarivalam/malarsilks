const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_5Jdut1TpEbfm@ep-dawn-cell-aocyxr86-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
});

const setup = async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to Neon PostgreSQL!');

        // 1. Create all tables
        console.log('\n--- Creating tables ---');

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                address TEXT,
                city VARCHAR(100),
                pincode VARCHAR(10),
                role VARCHAR(20) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('✅ users table created');

        await client.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ admins table created');

        await client.query(`
            CREATE TABLE IF NOT EXISTS gallery_entries (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                image TEXT NOT NULL,
                comment TEXT,
                is_approved BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ gallery_entries table created');

        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price FLOAT NOT NULL,
                image TEXT NOT NULL,
                category VARCHAR(100) NOT NULL,
                description TEXT,
                in_stock BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ products table created');

        await client.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER,
                email VARCHAR(255),
                shipping_address TEXT,
                payment_method VARCHAR(100),
                total_price FLOAT NOT NULL,
                status VARCHAR(50) DEFAULT 'Pending',
                delivered_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ orders table created');

        await client.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                product_id INTEGER,
                name VARCHAR(255) NOT NULL,
                qty INTEGER NOT NULL,
                image TEXT NOT NULL,
                price FLOAT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ order_items table created');

        await client.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                image_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ posts table created');

        // 2. Seed admin
        console.log('\n--- Seeding admin ---');
        const adminCheck = await client.query('SELECT * FROM admins WHERE email = $1', ['poungracy@gmail.com']);
        if (adminCheck.rowCount === 0) {
            const hashedAdminPwd = await bcrypt.hash('Malarsilks@2026', 10);
            await client.query('INSERT INTO admins (email, password) VALUES ($1, $2)', ['poungracy@gmail.com', hashedAdminPwd]);
            console.log('✅ Admin seeded: poungracy@gmail.com / Malarsilks@2026');
        } else {
            console.log('ℹ️  Admin already exists');
        }

        // 3. Seed test user
        console.log('\n--- Seeding test user ---');
        const userCheck = await client.query('SELECT * FROM users WHERE email = $1', ['user@example.com']);
        if (userCheck.rowCount === 0) {
            const hashedUserPwd = await bcrypt.hash('user123', 10);
            await client.query(
                'INSERT INTO users (name, email, password, role, city) VALUES ($1, $2, $3, $4, $5)',
                ['Test User', 'user@example.com', hashedUserPwd, 'user', 'Bangalore']
            );
            console.log('✅ Test user seeded: user@example.com / user123');
        } else {
            console.log('ℹ️  Test user already exists');
        }

        // 4. Verify
        console.log('\n--- Verification ---');
        const tables = await client.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' ORDER BY table_name;
        `);
        console.log('Tables in database:', tables.rows.map(r => r.table_name).join(', '));

        client.release();
        await pool.end();
        console.log('\n🎉 Neon database setup complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Setup Error:', error);
        process.exit(1);
    }
};

setup();
