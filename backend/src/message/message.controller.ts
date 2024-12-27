import express, { NextFunction, Request, Response, Router } from "express";
import auth from "@/auth/auth";
import { jwtDecode } from "jwt-decode";
import { createMessage, getMessages } from "./message.service";

const router = Router();
router.use(express.json());

router.post(
  "/create/message",
  auth.required as any,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body;

      if (!data.conversationId || !data.userInput || !data.modelResponse) {
        res
          .status(400)
          .json({
            message: "ConversationId, userInput and modelResponse are required",
          });
        return;
      }
      const message = await createMessage(
        data.conversationId,
        data.userInput,
        data.modelResponse
      );
      res.status(201).json(message);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/get/messages/:conversationId",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const conversationId = req.params.conversationId;
      const messages = await getMessages(conversationId);
      res.status(200).json(messages);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
