import express, { NextFunction, Request, Response, Router } from "express";
import auth from "@/auth/auth";
import { jwtDecode } from "jwt-decode";
import {
  createConversation,
  deleteConversation,
  checkConversationExists,
  getConversations,
} from "./conversation.service";

const router = Router();
router.use(express.json());

router.post(
  "/create/conversation",
  auth.required as any,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const data = req.body;
      if (!data.title) {
        res.status(400).json({ message: "Title is required" });
        return
      }

      const token = req.headers["x-access-token"] as string;
      const decoded = jwtDecode<{ id: string }>(token);
      const conversation = await createConversation(decoded.id, data.title);
      res.status(201).json(conversation);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/check/conversation/:conversationId",
  auth.required as any,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const conversationId = req.params.conversationId;
      const conversation = await checkConversationExists(conversationId);
      if (!conversation) {
        res.status(202).json({ error: "Conversation not found" });
      }
      res.status(200).json(conversation);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/delete/conversation/:conversationId",
  auth.required as any,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const conversationId = req.params.conversationId;
      await deleteConversation(conversationId);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);


router.get(
  "/get/conversations",
  auth.required as any,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers["x-access-token"] as string;
      const decoded = jwtDecode<{ id: string }>(token);
      const conversations = await getConversations(decoded.id);
      if (!conversations) {
        res.status(404).json({ error: "Conversations not found" });
      }
      res.status(200).json(conversations);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
);

export default router;