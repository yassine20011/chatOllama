import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

interface TokenPayload {
  id: string;
  email: string;
}

export const generateToken = (payload: TokenPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "defaultSecretIfnoEnvIsSet", {
    expiresIn: "60m",
    algorithm: "HS256",
  });
};

export default generateToken;
