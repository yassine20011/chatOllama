import { prisma } from "../../prisma/client";
import axios from "axios";

export const createConversation = async (userId: string) => {
  const conversation = await prisma.conversation.create({
    data: {
      userId: userId,
      title: "New Conversation",
    },
  });
  return conversation;
};

export const deleteConversation = async (conversationId: string) => {
  await prisma.conversation.delete({
    where: {
      id: conversationId,
    },
  });
};
