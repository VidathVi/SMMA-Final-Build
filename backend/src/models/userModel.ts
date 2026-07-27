import { prisma } from "../lib/prisma";

export interface User {
  id: string;
  name: string | null;
  email: string;
  password_hash: string | null;
  roleId: string | null;
  createdAt?: Date;
}

// create user
export const createUser = async (
  name: string,
  email: string,
  password_hash: string,
  roleId?: string,
): Promise<User> => {
  return prisma.user.create({
    data: {
      name,
      email,
      password_hash,
      roleId: roleId || undefined,
    },
  });
};

// get user by email
export const findUserByEmail = async (
  email: string,
): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

// get user by id
export const findUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

// get all users
export const getAllUsers = async (): Promise<User[]> => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      password_hash: true,
      roleId: true,
      createdAt: true,
      auth_provider: true,
      updatedAt: true,
      googleId: true,
      avatarUrl: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// update user role
export const updateUserRole = async (
  id: string,
  roleId: string,
): Promise<User | null> => {
  return prisma.user.update({
    where: { id },
    data: { roleId },
  });
};

// update user profile (name, password)
export const updateUserProfile = async (
  id: string,
  name: string,
  password_hash?: string,
): Promise<User | null> => {
  return prisma.user.update({
    where: { id },
    data: {
      name,
      ...(password_hash ? { password_hash } : {}),
    },
  });
};

// delete user
export const deleteUserById = async (id: string): Promise<boolean> => {
  try {
    await prisma.user.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
};
