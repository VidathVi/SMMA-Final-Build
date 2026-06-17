const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "orean360",
  password: process.env.DB_PASSWORD || "orean360",
  port: process.env.DB_PORT || 5432,
});

pool.connect()
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.error("Database connection error:", err);
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
    // ─── Users Table ──────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ users table ready");

    // ─── Social Tokens Table ──────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS social_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        token_expires_at TIMESTAMP,
        platform_user_id VARCHAR(255),
        platform_username VARCHAR(255),
        scopes TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, platform)
      );
    `);
    console.log("✓ social_tokens table ready");

    // ─── Create index on social_tokens for fast user lookups ────────────
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_social_tokens_user_id
      ON social_tokens(user_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_social_tokens_platform
      ON social_tokens(platform);
    `);
    console.log("✓ social_tokens indexes ready");

    // ─── Media Assets Table ──────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_assets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        file_name VARCHAR(500) NOT NULL,
        original_name VARCHAR(500) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video', 'gif', 'document')),
        file_size BIGINT NOT NULL,
        file_url TEXT NOT NULL,
        thumbnail_url TEXT,
        width INTEGER,
        height INTEGER,
        duration_seconds DECIMAL(10,2),
        alt_text TEXT,
        tags TEXT,
        campaign_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ media_assets table ready");

    // ─── Create indexes on media_assets ─────────────────────────────────
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_media_assets_user_id
      ON media_assets(user_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_media_assets_media_type
      ON media_assets(media_type);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_media_assets_campaign_id
      ON media_assets(campaign_id);
    `);
    console.log("✓ media_assets indexes ready");

    // ─── Seed Default Admin ─────────────────────────────────────────────

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
      "SELECT * FROM users WHERE email = $1",
      ["admin@orean.com"]
    );

    if (adminCheck.rows.length === 0) {
      const hashed = await bcrypt.hash("admin123", 10);

      await client.query(
        "INSERT INTO users (username, password_hash, role, auth_provider) VALUES ($1, $2, $3, $4)",
        ["admin", hash, "admin", "local"]
        "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4)",
        ["Admin", "admin@orean.com", hashed, "admin"]
      );

      console.log("✓ Default admin created");

      console.log("Default admin created");
    } else {
      console.log("✓ Admin already exists");
      console.log("Admin already exists");
    }

    console.log("\n✅ Database seeding complete!");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();

module.exports = pool;