import express, { NextFunction, Request, Response, Router } from "express";
import auth from "@/auth/auth";
import { jwtDecode } from "jwt-decode";
import { createConversation, deleteConversation } from "./conversation.service";

const router = Router();
router.use(express.json());

router.get(
  "/create/conversation",
  auth.required as any,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers["x-access-token"] as string;
      const decoded = jwtDecode<{ id: string }>(token);
      const conversation = await createConversation(decoded.id);
      res.status(201).json(conversation);
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
