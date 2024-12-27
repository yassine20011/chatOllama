import { prisma } from "../../prisma/client";

export const createConversation = async (userId: string, title: string) => {
  const conversation = await prisma.conversation.create({
    data: {
      userId: userId,
      title: title,
    },
  });
  return conversation;
};

export const deleteConversation = async (conversationId: string) => {

  // delete all messages in the conversation
  await prisma.message.deleteMany({
    where: {
      conversationId: conversationId,
    },
  });

  // delete the conversation
  await prisma.conversation.delete({
    where: {
      id: conversationId,
    },
  });
};

export const checkConversationExists = async (conversationId: string) => {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
  });
  return conversation; // returns null if conversation does not exist
};

export const getConversations = async (userId: string) => {
  const conversations = await prisma.conversation.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return conversations;
};