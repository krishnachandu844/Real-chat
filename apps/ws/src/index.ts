import { WebSocket, WebSocketServer } from "ws";
import { db } from "@repo/db/client";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

interface rooms {
  socket: WebSocket;
  roomId: string;
  userId: string;
}

interface onlineUsersType {
  userId: string;
}

let rooms: rooms[] = [];
let onlineUsers: onlineUsersType[] = [];

function broadcastOnlineUsers() {
  const users = onlineUsers.map((user) => user.userId);
  const uniqueUsers = [...new Set(users)];
  const payload = JSON.stringify({ type: "online-users", uniqueUsers });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

wss.on("connection", async function connection(ws, req) {
  let currentUserId: string = "";
  // Authentication using jwt and extracting userId
  try {
    const url = req.url;
    const queryParams = new URLSearchParams(url?.split("?")[1]);
    const token = queryParams.get("token");
    if (!token) {
      ws.close();
      console.log("invalid user");
      return;
    }
    //Decoding JWT
    let decoded = jwt.verify(token, "1231321");
    if (typeof decoded !== "object") {
      ws.close();
      return;
    }
    currentUserId = decoded.userId;
    onlineUsers.push({ userId: currentUserId });
    rooms.push({ socket: ws, roomId: "", userId: decoded.userId });
  } catch (error) {
    console.log(error);
  }

  ws.on("message", async function (data) {
    try {
      const parsedData = JSON.parse(data.toString());
      switch (parsedData.type) {
        //Status-update
        case "status-update":
          broadcastOnlineUsers();
          break;

        //Room Join
        case "join":
          const room = rooms.find((x) => x.socket === ws);
          if (room) {
            room.roomId = parsedData.roomId;
          }

          break;

        //Chat
        case "chat":
          {
            const { roomId, message, receiverId } = parsedData;
            const targetrooms = rooms.filter(
              (room) => room.roomId === roomId && room.socket != ws
            );
            targetrooms.map((room) => {
              room.socket.send(
                JSON.stringify({
                  type: "message",
                  message,
                  roomId,
                  senderId: currentUserId,
                  receiverId,
                })
              );
            });
            try {
              // const savedMessage = await db.chat.create({
              //   data: {
              //     message,
              //     senderId: currentUserId,
              //     receiverId,
              //     roomId,
              //     Status: "Sent", // start as Sent
              //   },
              // });
            } catch (error) {
              console.error("Error saving message:", error);
            }
          }
          break;

        // Request Video call
        case "Request-for-video-call":
          {
            const { receiverId } = parsedData;
            console.log(receiverId);
            const room = rooms.find((x) => x.userId == receiverId);
            console.log(room);
            room?.socket.send(
              JSON.stringify({
                type: "Request-for-video-call",
                receiverId,
              })
            );
            console.log("request sent");
          }
          break;

        // Sending offer
        case "offer":
          {
            const { receiverId, offer } = parsedData;
            const room = rooms.find((x) => x.userId == receiverId);
            room?.socket.send(
              JSON.stringify({
                type: "offer",
                offer,
              })
            );
            console.log(room);
            console.log("sent");
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  });

  // Websocket closed
  ws.on("close", async () => {
    onlineUsers = onlineUsers.filter((user) => user.userId !== currentUserId);
    broadcastOnlineUsers();
  });
});
