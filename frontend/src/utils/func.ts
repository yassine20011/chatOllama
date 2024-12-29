import axiosInstance from "@/conf/axois-instance";
import { generateTitle } from "./titleGenerator";

export const createConversation = async (conversation: string) => {
  const title = await generateTitle(conversation);
  try {
    if (title) {
      const req = await axiosInstance.post("/v1/create/conversation", {
        title: title.split("\n").join("").trim().replace(/"/g, ""),
      });

      if (req.status === 201) {
        return req.data;
      }
      return null;
    }
  } catch (error) {
    console.error(error);
  }
};

export const createConversationWithOutTitle = async () => {
  try {
    const req = await axiosInstance.post("/v1/create/conversation", {
      title: "Untitled",
    });

    if (req.status === 201) {
      return req.data;
    }
    return null;
  } catch (error) {
    console.error(error);
  }
};

export const createMessage = async (
  conversationId: string,
  userInput: string,
  modelResponse: string
) => {
  const req = await axiosInstance.post("/v1/create/message", {
    conversationId,
    userInput,
    modelResponse,
  });
  if (req.status === 201) {
    return req.data;
  }
  return null;
};

export const fetchMessages = async (conversationId: string) => {
  const req = await axiosInstance.get(`/v1/get/messages/${conversationId}`);
  console.log("messages", req.data);
  return req.data;
};

export const checkConversationExists = async (conversationId: string) => {
  const req = await axiosInstance.get(
    `/v1/check/conversation/${conversationId}`
  );
  if (req.status === 404) {
    throw new Error("Conversation not found");
  }
  return req.data;
};
