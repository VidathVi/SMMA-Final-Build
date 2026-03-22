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
    
    // Create users table with Google OAuth fields
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        google_id VARCHAR(255) UNIQUE,
        avatar_url TEXT,
        auth_provider VARCHAR(50) DEFAULT 'local',
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Users table created or exists.");

    // Add new columns if they don't exist (for existing databases)
    const alterQueries = [
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'local'",
      "ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL",
    ];

    for (const query of alterQueries) {
      try {
        await client.query(query);
      } catch (e) {
        // Ignore errors for columns that already exist
      }
    }

    console.log("User table columns updated.");

    // Create social_connections table
    await client.query(`
      CREATE TABLE IF NOT EXISTS social_connections (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        platform_username VARCHAR(255),
        profile_url TEXT,
        connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, platform)
      );
    `);

    console.log("Social connections table created or exists.");

    // Create social_tokens table for OAuth tokens
    await client.query(`
      CREATE TABLE IF NOT EXISTS social_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        token_expiry TIMESTAMP,
        platform_user_id VARCHAR(255),
        platform_username VARCHAR(255),
        scopes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, platform)
      );
    `);

    console.log("Social tokens table created or exists.");

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
        "INSERT INTO users (username, password_hash, role, auth_provider) VALUES ($1, $2, $3, $4)",
        ["admin", hash, "admin", "local"]
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
