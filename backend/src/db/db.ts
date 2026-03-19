import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "orean360",
  password: "orean360",
  port: 5432,
});

pool.connect()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
  if (err instanceof Error) {
    console.log("Database connection error:", err.message);
  } else {
    console.log("Database connection error:", err);
  }
});

export default pool;