import bcrypt from "bcrypt";
import { prisma } from "../../prisma/client";
import { User } from ".prisma/client";
import { NewUserType } from "../types/newUser";
import generateToken from "./jwt.utils";

export const getCurrentUser = async (id: string) => {
  return await prisma.user.findUnique({
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
    
    return { user, token };
  } catch (e) {
    throw new Error("Error creating user");
  }
};
