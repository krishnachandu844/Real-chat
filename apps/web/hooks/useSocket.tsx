import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useSocketStore } from "@/store/useSocketStore";
import { useChatStore } from "@/store/useChatStore";
import { Chat } from "@/types";
import { useRouter } from "next/navigation";

const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const token = Cookies.get("jwt");
  const setOnlineUsers = useSocketStore((state) => state.setOnlineUsers);
  const { setMessages } = useChatStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      return;
    }
    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

    ws.onopen = () => {
      console.log("web socket connected");
    };
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type == "online-users") {
          setOnlineUsers(msg.uniqueUsers);
        }
        if (msg.type == "message") {
          const mes: Chat = {
            message: msg.message,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            roomId: msg.roomId,
            createdAt: new Date(),
          };
          setMessages(mes);
        }
        if (msg.type == "Request-for-video-call") {
          const { receiverId } = msg;
          router.push(`/video/${receiverId}`);
        }
      } catch (error) {}
    };
    ws.onerror = (err) => {
      console.log(err);
    };
    setSocket(ws);
  }, []);

  return {
    socket,
  };
};

export default useSocket;
