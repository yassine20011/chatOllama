import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
const port = 3000;

const whitelist = ["http://localhost:3000"];

app.use(cors({ origin: whitelist }));
app.use(routes);

app.get("/", (req, res) => {
  res.send("Hello Npc's World!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
