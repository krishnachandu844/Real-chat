import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/useChatStore";

import { MoreVertical, Phone, Video } from "lucide-react";

const ChatHeader = () => {
  const selectedUser = useChatStore((state) => state.selectedUser);
  if (!selectedUser) {
    return;
  }
  return (
    <div className='p-4 border-b border-slate-700 bg-slate-800/50'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div className='relative'>
            <Avatar className='h-10 w-10'>
              <AvatarFallback className='bg-gradient-to-r from-blue-500 to-cyan-500 text-white'>
                {selectedUser?.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${
                selectedUser.Status === "online"
                  ? "bg-green-500"
                  : selectedUser.Status === "away"
                    ? "bg-yellow-500"
                    : selectedUser.Status === "busy"
                      ? "bg-red-500"
                      : "bg-gray-500"
              }`}
            />
          </div>
          <div>
            <h3 className='text-white font-medium'>{selectedUser.username}</h3>
            <p className='text-slate-400 text-sm capitalize'>
              {selectedUser.Status}
            </p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='ghost'
            size='sm'
            className='text-slate-400 hover:text-white hover:bg-slate-700'
          >
            <Phone className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='text-slate-400 hover:text-white hover:bg-slate-700'
          >
            <Video className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            // onClick={onShowProfile}
            className='text-slate-400 hover:text-white hover:bg-slate-700'
          >
            <MoreVertical className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
