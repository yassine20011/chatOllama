import express, { NextFunction, Request, Response, Router } from "express";
import { getCurrentUser, createNewUser, getUserByEmail } from "./auth.service";
import auth from "./auth";

const router = Router();
router.use(express.json());

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body;

      if (!data.email || !data.password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      const newUser = await createNewUser(req.body);
      if (newUser.message) {
        res.status(400).json(newUser);
        return;
      }
      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
