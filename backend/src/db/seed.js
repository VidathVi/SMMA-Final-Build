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

    const adminCheck = await client.query(
      "SELECT * FROM users WHERE email = $1",
      ["admin@orean.com"]
    );

    if (adminCheck.rows.length === 0) {
      const hashed = await bcrypt.hash("admin123", 10);

      await client.query(
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