import express, { NextFunction, Request, Response, Router } from "express";
import { getCurrentUser, createNewUser, getUserByEmail, deleteUser } from "./auth.service";
import auth from "./auth";
import { jwtDecode } from "jwt-decode";

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

router.get(
  "/me",
  auth.required as any,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers["x-access-token"] as string;
      const decoded = jwtDecode<{ id: string }>(token);
      const user = await getCurrentUser(decoded.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
);


router.delete(
  "/delete",
  auth.required as any,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers["x-access-token"] as string;
      const decoded = jwtDecode<{ id: string }>(token);
      await deleteUser(decoded.id);
      res.status(200).json("message: User deleted");
    } catch (err) {
      next(err);
    }
  }
);

export default router;
