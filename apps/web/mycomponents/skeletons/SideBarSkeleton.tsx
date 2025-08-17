import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Settings, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SidebarSkeleton() {
  return (
    <div className='w-80 bg-slate-800 border-r border-slate-700 flex flex-col h-screen'>
      {/* Header */}
      <div className='p-4 border-b border-slate-700'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg'>
              <MessageCircle className='h-6 w-6 text-white' />
            </div>
            <h1 className='text-xl font-bold text-white'>ChatPro</h1>
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='ghost'
              size='sm'
              className='text-slate-400 hover:text-white hover:bg-slate-700'
            >
              <Settings className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='text-slate-400 hover:text-red-400 hover:bg-slate-700'
            >
              <LogOut className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Search Skeleton */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600 h-4 w-4' />
          <Skeleton className='h-9 w-full rounded-md bg-slate-700/50' />
        </div>
      </div>

      {/* Conversations Skeleton */}
      <div className='flex-1 overflow-y-auto p-2 space-y-2'>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className='flex items-center space-x-3 p-3 rounded-lg bg-slate-700/40 animate-pulse'
          >
            <Skeleton className='h-12 w-12 rounded-full bg-slate-600' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-4 w-3/4 bg-slate-600' />
              <Skeleton className='h-3 w-1/2 bg-slate-700' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
