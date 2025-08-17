// "use client";
import ChatHeader from "./ChatHeader";
import ChatGround from "./ChatGround";
import { useChatStore } from "@/store/useChatStore";
import { MessageContSkeleton } from "./skeletons/MessageContSkeleton";
import { useAuthStore } from "@/store/user";
import { useEffect } from "react";
import { useSocketStore } from "@/store/useSocketStore";

const ChatPlayground = () => {
  const { user, getUser } = useAuthStore();
  const { socket, connectSocket } = useSocketStore();
  const selectedUser = useChatStore((state) => state.selectedUser);

  console.log(socket);

  //Get User
  useEffect(() => {
    getUser();
  }, []);

  // webSocket Conncetion
  useEffect(() => {
    connectSocket();
  }, [socket]);

  if (!selectedUser) {
    return <MessageContSkeleton />;
  }

  return (
    <div className='flex-1 flex flex-col bg-slate-900'>
      <div className='container mx-auto p-4 rounded w-3/4 h-screen'>
        {/* chat-header */}
        <ChatHeader />

        {/* chat-ground */}
        {user && socket && <ChatGround user={user} socket={socket} />}
      </div>
    </div>
  );
};
export default ChatPlayground;
