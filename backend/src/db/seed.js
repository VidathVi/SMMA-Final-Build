const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runSeed() {
  const client = await pool.connect();
  try {
    // ─── Users Table ──────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
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

      console.log("✓ Default admin created");
    } else {
      console.log("✓ Admin already exists");
    }

    console.log("\n✅ Database seeding complete!");
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
