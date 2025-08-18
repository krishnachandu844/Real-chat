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
        case "status-update":
          broadcastOnlineUsers();
          break;
        case "join":
          const room = rooms.find((x) => x.socket === ws);
          if (room) {
            room.roomId = parsedData.roomId;
          }

          break;
        case "chat":
          const { roomId, message, receiverId } = parsedData;
          const targetrooms = rooms.filter(
            (room) => room.roomId === roomId && room.socket != ws
          );
          targetrooms.map((room) => {
            room.socket.send(
              JSON.stringify({
                type: "message",
                message,
              })
            );
          });
          try {
            const savedMessage = await db.chat.create({
              data: {
                message,
                senderId: currentUserId,
                receiverId,
                roomId,
                Status: "Sent", // start as Sent
              },
            });
            console.log(`sent message to ${currentUserId} to ${receiverId}`);
          } catch (error) {
            console.error("Error saving message:", error);
          }
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

// message Events
// ws.on("message", async function message(data) {
//   try {
//     const parsedData = JSON.parse(data.toString());
//     switch (parsedData.type) {
//       case "statusUpdate":
//         try {
//           await db.user.update({
//             where: { id: currentUserId },
//             data: { Status: "online" },
//           });
//         } catch (error) {
//           console.log(error);
//         }
//         //broadCast status
//         broadcastStatus(currentUserId, "online");
//       case "join":
//         const room = rooms.find((x) => x.socket === ws);
//         if (room) {
//           room.roomId = parsedData.roomId;
//         }
//         rooms;

//         break;
//       case "chat":
//         const { roomId, message, receiverId } = parsedData;
//         const targetrooms = rooms.filter(
//           (room) => room.roomId === roomId && room.socket != ws
//         );
//         if (targetrooms.length > 0) {
//           targetrooms.map((room) => {
//             room.socket.send(
//               JSON.stringify({
//                 message,
//               })
//             );
//           });
//           try {
//             await db.chat.create({
//               data: {
//                 message,
//                 senderId: currentUserId,
//                 receiverId,
//                 roomId,
//                 Status: "Seen",
//               },
//             });
//           } catch (error) {
//             console.log(error);
//           }
//           return;
//         }
//         //if receiver is offliner
//         try {
//           await db.chat.create({
//             data: {
//               message,
//               senderId: currentUserId,
//               receiverId,
//               roomId,
//               Status: "Sent",
//             },
//           });
//         } catch (error) {}
//         break;
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });
