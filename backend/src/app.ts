import { prisma } from "../prisma/client";
import express, { Request, Response } from "express";
import cors from "cors";
const app = express();
const port = 3000;

const whitelist = ["http://localhost:3000"];

app.use(
  cors({
    origin: whitelist,
  })
);

app.get("/", (req, res) => {
  res.send("Hello Npc's World!");
});

app.get("/users", (req, res) => {
  res.json(prisma.user.findMany());
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
