// "use client";
import ChatHeader from "./ChatHeader";
import ChatGround from "./ChatGround";
import { useChatStore } from "@/store/useChatStore";
import { MessageContSkeleton } from "./skeletons/MessageContSkeleton";
import { useAuthStore } from "@/store/user";
import { useEffect } from "react";
import useSocket from "@/hooks/useSocket";

const ChatPlayground = () => {
  const { user, getUser } = useAuthStore();
  const { socket } = useSocket();
  const selectedUser = useChatStore((state) => state.selectedUser);

  //Get User
  useEffect(() => {
    getUser();
  }, []);

  if (!selectedUser) {
    return <MessageContSkeleton />;
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900">
      <div className="container mx-auto p-4 rounded w-3/4 h-screen">
        {/* chat-header */}
        <ChatHeader />

        {/* chat-ground */}
        {user && socket && <ChatGround user={user} socket={socket} />}
      </div>
    </div>
  );
};
export default ChatPlayground;
