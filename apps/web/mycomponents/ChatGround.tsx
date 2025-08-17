"use client";
import { Button } from "@/components/ui/button";
import { Send, Smile } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Chat, User } from "@/types";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/store/useChatStore";
import { formatMessageTime } from "@/lib/utils";
import { useSocketStore } from "@/store/useSocketStore";

interface ChatProps {
  user: User;
  socket: WebSocket;
}

const ChatGround = ({ user, socket }: ChatProps) => {
  const [message, setMessage] = useState("");

  // Zustand Vars
  const selectedUser = useChatStore((state) => state.selectedUser);
  const setSelectedUser = useChatStore((state) => state.setSelectedUser);

  const { getMessages, messages, setMessages } = useChatStore();
  const setOnlineUsers = useSocketStore((state) => state.setOnlineUsers);

  // roomId Creation
  const roomId = [user?.username, selectedUser?.username].sort().join("-");
  const token = Cookies.get("token");

  //getting messages
  useEffect(() => {
    getMessages(roomId);
    // return () => {
    //   setMessages("");
    // };
  }, [roomId]);

  //send messages
  const handleSendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && selectedUser) {
      socket.send(
        JSON.stringify({
          type: "chat",
          roomId,
          message,
          receiverId: selectedUser.id,
        })
      );
    }
    const mes: Chat = {
      message,
      senderId: user.id,
      receiverId: selectedUser?.id,
      roomId,
      createdAt: new Date(),
    };
    setMessages(mes);
    setMessage("");
  };

  //create room in db
  // const createRoom = async () => {
  //   const response = await fetch("http://localhost:5050/createroom", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({ slug: roomId }),
  //   });
  //   const data = await response.json();
  //   if (response.ok) {
  //     // console.log(data);
  //   }
  // };

  // status update
  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "status-update",
        })
      );
    }
    console.log("Status update called");
  }, [socket]);

  //joining room
  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "join",
          roomId,
        })
      );
    }
    console.log("joined socket");
    // createRoom();
  }, [selectedUser, user, socket]);

  // message events
  // useEffect(() => {
  //   if (!socket && !selectedUser) return;
  //   if (socket && socket.readyState === WebSocket.OPEN) {
  //     socket.onmessage = (e) => {
  //       const data = JSON.parse(e.data);
  //       if (data.type === "statusUpdate") {
  //         const { userId, status } = data;
  //         const prevUsers = useChatStore.getState().usersList;
  //         const updatedUsers = prevUsers.map((user) =>
  //           user.id === userId ? { ...user, Status: status } : user
  //         );
  //         // useChatStore.getState().setUsersList(updatedUsers);
  //       } else {
  //         const { message } = data;
  //         // setMessages((prev) => [
  //         //   ...prev,
  //         //   { receiverId: selectedUser?.id, message },
  //         // ]);
  //       }
  //     };
  //   }
  // }, []);

  useEffect(() => {
    if (!socket && !selectedUser) return;
    if (socket && socket.readyState == WebSocket.OPEN) {
      socket.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type == "online-users") {
          setOnlineUsers(msg.uniqueUsers);
        }
        if (msg.type == "message") {
          const mes: Chat = {
            message: msg.message,
            senderId: selectedUser?.id,
            receiverId: user?.id,
            roomId,
            createdAt: new Date(),
          };
          setMessages(mes);
        }
      };
    }
  }, [socket]);

  return (
    <>
      <div className='h-[80%] flex-1 overflow-y-auto p-4 space-y-4  bg-slate-800/50'>
        {messages &&
          messages.map((mes, index) => (
            <div
              key={index}
              className={`flex${mes.senderId === user.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-2 ${mes.senderId === user.id ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                {mes.senderId != user.id && (
                  <Avatar className='size-10'>
                    <AvatarFallback className='bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs'>
                      {mes.senderId != user.id &&
                        selectedUser?.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className='flex flex-col mb-1'>
                  <div
                    className={`flex flex-col px-4 py-2 rounded-2xl ${
                      mes.senderId == user.id
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-slate-700 text-white"
                    }`}
                  >
                    <p className='text-sm'>{mes.message}</p>
                  </div>
                  <p
                    className={`text-xs ml-2 mt-2 ${user ? "text-purple-100" : "text-slate-400"}`}
                  >
                    {formatMessageTime(mes.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* Chat-Input */}
      <div className='p-4 border-t border-slate-700 bg-slate-800/50'>
        <div className='flex items-center space-x-2'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='text-slate-400 hover:text-white hover:bg-slate-700'
          >
            <Smile className='h-5 w-5' />
          </Button>
          <Input
            placeholder='Type a message...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                handleSendMessage();
              }
            }}
            className='flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400'
          />
          <Button
            type='button'
            size='sm'
            className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            disabled={!message.trim()}
            onClick={() => {
              handleSendMessage();
            }}
          >
            <Send className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChatGround;
