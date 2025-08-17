import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import { db } from "@repo/db/client";
import { authMiddleware } from "./middleware";
import { generatToken } from "./utils";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

//User Routes
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const isUserExists = await db.user.findFirst({
      where: {
        username,
      },
    });
    if (isUserExists) {
      res.status(404).json({ message: "User already Exists" });
      return;
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await db.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    res.status(200).json({ message: "User Created Successfully" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.user.findFirst({
      where: {
        username,
      },
    });
    if (!user) {
      res.status(404).json({ message: "User Doesn't Exists" });
      return;
    }
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      res.status(404).json({ message: "Password Incorrect" });
      return;
    }

    generatToken(user.id, user.username, res);
    res.status(200).json({ message: "Login Successfully" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/logout", async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/users", authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    if (userId && typeof userId == "string") {
      const users = await db.user.findMany({
        where: {
          id: {
            not: userId,
          },
        },
      });
      res.status(200).json({ users });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/me", authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await db.user.findFirst({
      where: {
        id: userId as string,
      },
      select: {
        id: true,
        username: true,
      },
    });
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
  }
});

//Chat Routes

//create room
app.post("/createroom", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { slug } = req.body;
  try {
    const isRoomExists = await db.room.findFirst({
      where: {
        slug,
      },
    });
    if (isRoomExists) {
      res.status(200).json({ message: "Room Already Exists" });
      return;
    }
    await db.room.create({
      data: {
        slug,
        userId: userId as string,
      },
    });
    res.status(200).json({ message: "Room Created Successfully" });
    return;
  } catch (error) {
    console.log(error);
  }
});

app.get("/messages/:roomId", authMiddleware, async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await db.chat.findMany({
      where: {
        roomId,
      },
    });
    res.json({ messages });
  } catch (error) {
    console.log(error);
  }
});

app.listen(5050, () => {
  console.log("Server Started");
});
