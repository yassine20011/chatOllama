import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  email: string;
}

export const generateToken = (payload: TokenPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "default", {
    expiresIn: "60m",
    algorithm: "HS256",
  });
};

export default generateToken;
