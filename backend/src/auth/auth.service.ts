import bcrypt from "bcrypt";
import { prisma } from "../../prisma/client";
import { User } from ".prisma/client";
import { NewUserType } from "@/types/newUser";
import { LoginInput } from "@/types/loginInput";

import generateToken from "./jwt.utils";

export const getCurrentUser = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      password: false,
      createdAt: true,
      updatedAt: true,
    },
  });
};


export const updateUser = async (id: string, data: Partial<User>) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    }
  });
};

export const deleteUser = async (id: string) => {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createNewUser = async (newUser: NewUserType) => {
  const hashedPassword = await bcrypt.hash(newUser.password, 10);

  try {
    const userExists = await getUserByEmail(newUser.email);

    if (userExists) {
      return { message: "User already exists" };
    }

    const user = await prisma.user.create({
      data: {
        email: newUser.email,
        password: hashedPassword,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });
    const token = generateToken({ id: user.id, email: user.email });
    const { password, ...userData } = user;

    return { userData, token };
  } catch (e) {
    throw new Error("Error creating user");
  }
};

export const loginUser = async (LoginInput: LoginInput) => {
  const user = await getUserByEmail(LoginInput.email);

  if (!user) {
    return { message: "User not found" };
  }

  const match = await bcrypt.compare(LoginInput.password, user.password);

  if (!match) {
    return { message: "Invalid password" };
  }
  
  const { password, ...userData } = user;
  const token = generateToken({ id: user.id, email: user.email });

  return { userData, token };
};