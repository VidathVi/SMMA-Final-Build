const pool = require("../db/seed");

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

// create user
export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: string
): Promise<User> => {
  const result = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email, password, role]
  );

  return result.rows[0];
};

// get user by email
export const findUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0];
};