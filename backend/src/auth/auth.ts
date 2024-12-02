import { expressjwt as jwt } from "express-jwt";
import * as express from "express";

const getToken = (req: express.Request): string => {
  const token = req.headers["x-access-token"];
  if (token) {
    return token as string;
  }
  return "";
};

const auth = {
  required: jwt({
    secret: process.env.JWT_SECRET || "defaultSecretIfnoEnvIsSet",
    getToken: getToken,
    algorithms: ["HS256"],
  }),
  optional: jwt({
    secret: process.env.JWT_SECRET || "defaultSecretIfnoEnvIsSet",
    credentialsRequired: false,
    getToken: getToken,
    algorithms: ["HS256"],
  }),
};

export default auth;
