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

      console.log("Default admin created");
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    client.release();
  }
}

// runSeed();

module.exports = pool;