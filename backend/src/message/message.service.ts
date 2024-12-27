import { prisma } from "../../prisma/client";

export const createMessage = async (
  conversationId: string,
  userInput: string,
  modelResponse: string
) => {
  const message = await prisma.message.create({
    data: {
      conversationId: conversationId,
      userInput: userInput,
      modelResponse: modelResponse,
    },
  });
  return message;
};

export const getMessages = async (conversationId: string) => {
  const messages = await prisma.message.findMany({
    where: {
      conversationId: conversationId,
    },
  });
  return messages;
};
