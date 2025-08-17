import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type decodedToken = {
  userId: string;
  username: string;
};

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ message: "Unauthorized - No Token Provided" });
      return;
    }
    const decoded = jwt.verify(token, "1231321");
    if (!decoded) {
      res.status(401).json({ message: "Unauthorized - Invalid Token" });
      return;
    }
    const user = decoded as decodedToken;
    req.userId = user.userId;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
