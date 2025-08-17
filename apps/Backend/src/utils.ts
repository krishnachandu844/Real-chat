import jwt from "jsonwebtoken";
import { Response } from "express";

export const generatToken = (
  userId: string,
  username: string,
  res: Response
) => {
  const token = jwt.sign({ userId, username }, "1231321", { expiresIn: "1d" });
  res.cookie("jwt", token);

  return token;
};
