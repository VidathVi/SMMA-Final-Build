const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runSeed() {
  const client = await pool.connect();
  try {
    console.log("Setting up database schema...");
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Users table created or exists.");

    // Check if admin exists
    const adminCheck = await client.query(
      "SELECT * FROM users WHERE username = $1",
      ["admin"]
    );

    if (adminCheck.rows.length === 0) {
      console.log("No admin found. Creating default admin...");
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash("admin123", salt);

      await client.query(
        "INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)",
        ["admin", hash, "admin"]
      );
      console.log("Default admin created successfully! (admin / admin123)");
    } else {
      console.log("Admin user already exists. Skipping creation.");
    }
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    client.release();
    pool.end();
  }
}

runSeed();
