"use client";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, LogOut, MessageCircle, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/store/useChatStore";
import SidebarSkeleton from "./skeletons/SideBarSkeleton";
import { useSocketStore } from "@/store/useSocketStore";
import { useAuthStore } from "@/store/user";

export default function UsersList() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const { user } = useAuthStore();

  const getUsers = useChatStore((state) => state.getUsers);
  const usersList = useChatStore((state) => state.usersList);
  const isLoadingUsers = useChatStore((state) => state.isUsersLoading);

  const selectedUser = useChatStore((state) => state.selectedUser);
  const setSelectedUser = useChatStore((state) => state.setSelectedUser);

  const { disconnectSocket, onlineUsers } = useSocketStore();
  const { logout } = useAuthStore();

  const userRefs = useRef<Record<string, HTMLDivElement | null>>({});

  //Getting Users
  useEffect(() => {
    getUsers();
  }, []);

  //useRefs to click on firstuser
  useEffect(() => {
    if (usersList.length > 0) {
      const firstUserId = usersList[0].id;
      const firstUserEl = userRefs.current[firstUserId];

      if (firstUserEl) {
        firstUserEl.click(); // triggers your onClick
      }
    }
  }, [usersList]);

  const filteredUsers = useMemo(() => {
    return usersList.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, usersList]);

  if (isLoadingUsers) {
    return <SidebarSkeleton />;
  }

  return (
    <div className='w-80 bg-slate-800 border-r border-slate-700 flex flex-col'>
      {/* Header */}
      <div className='p-4 border-b border-slate-700'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg'>
              <MessageCircle className='h-6 w-6 text-white' />
            </div>
            <h1 className='text-xl font-bold text-white'>ChatPro</h1>
          </div>
          <div className='flex items-center space-x-4'>
            <HoverCard>
              <HoverCardTrigger>
                <User className='text-white' />
              </HoverCardTrigger>
              <HoverCardContent className='bg-slate-800'>
                <div className='flex gap-2 items-center'>
                  <Avatar className='h-10 w-10'>
                    {/* <AvatarImage src={user?.avatar || "/placeholder.svg"} /> */}
                    <AvatarFallback className='size-10 text-xl bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white'>
                      {user?.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <p className='text-white font-medium text-base'>
                    {user?.username}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>

            <Button
              variant='ghost'
              size='sm'
              onClick={() => {
                logout();
                disconnectSocket();
                window.location.href = "/login";
              }}
              className='text-white  hover:bg-slate-700 hover:text-white'
            >
              <LogOut className='h-4 w-4' />
            </Button>
          </div>
          {/* userDetails */}
        </div>

        {/* Search */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4' />
          <Input
            placeholder='Search conversations...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400'
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-2'>
          {filteredUsers.map((user, index) => (
            <div
              key={index}
              ref={(el) => {
                userRefs.current[user.id] = el;
              }}
              onClick={() => {
                setSelectedUser(user);
              }}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedUser?.username == user.username
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                  : "hover:bg-slate-700/50"
              }`}
            >
              <div className='relative'>
                <Avatar className='h-12 w-12'>
                  {/* <AvatarImage src={ || "/placeholder.svg"} /> */}
                  <AvatarFallback className='bg-gradient-to-r from-blue-500 to-cyan-500 text-white'>
                    {user.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* Status Badge */}
                {onlineUsers.includes(user.id) ? (
                  <span
                    className='absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-1 ring-zinc-900'
                  />
                ) : (
                  <span
                    className='absolute bottom-0 right-0 size-3 bg-red-500 
                  rounded-full ring-1 ring-zinc-600'
                  />
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between'>
                  <p className='text-white font-medium truncate'>
                    {user.username}
                  </p>
                  {/* {contact.lastMessageTime && (
                      <span className="text-slate-400 text-xs">{contact.lastMessageTime}</span>
                    )} */}
                </div>
                {/* <div className="flex items-center justify-between">
                    <p className="text-slate-400 text-sm truncate">{contact.lastMessage}</p>
                    {contact.unreadCount && contact.unreadCount > 0 && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                        {contact.unreadCount}
                      </Badge>
                    )}
                  </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
