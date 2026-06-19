import pool from "../db/db";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at?: string;
}

// create user
export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: string,
): Promise<User> => {
  const result = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email, password, role],
  );

  return result.rows[0];
};

// get user by email
export const findUserByEmail = async (
  email: string,
): Promise<User | undefined> => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  return result.rows[0];
};

// get user by id
export const findUserById = async (id: number): Promise<User | undefined> => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

  return result.rows[0];
};

// get all users
export const getAllUsers = async (): Promise<User[]> => {
  const result = await pool.query(
    "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC",
  );

  return result.rows;
};

// update user role
export const updateUserRole = async (
  id: number,
  role: string,
): Promise<User | undefined> => {
  const result = await pool.query(
    "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role",
    [role, id],
  );

  return result.rows[0];
};

// update user profile (name, password)
export const updateUserProfile = async (
  id: number,
  name: string,
  password?: string,
): Promise<User | undefined> => {
  if (password) {
    const result = await pool.query(
      "UPDATE users SET name = $1, password = $2 WHERE id = $3 RETURNING id, name, email, role",
      [name, password, id],
    );
    return result.rows[0];
  }

  const result = await pool.query(
    "UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email, role",
    [name, id],
  );

  return result.rows[0];
};

// delete user
export const deleteUserById = async (id: number): Promise<boolean> => {
  const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
};
