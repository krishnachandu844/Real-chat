"use client";

import UsersList from "@/mycomponents/UsersList";

import ChatPlayground from "@/mycomponents/ChatPlayground";
import { useChatStore } from "@/store/useChatStore";

export default function Home() {
  const { usersList } = useChatStore();
  return (
    <div className='flex'>
      {/* Userslist */}
      {usersList && <UsersList />}

      {/* chat-playground */}
      <ChatPlayground />
    </div>
  );
}
