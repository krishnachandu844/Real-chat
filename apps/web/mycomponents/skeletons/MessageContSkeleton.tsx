export const MessageContSkeleton = () => {
  return (
    <div className='flex-1 flex flex-col bg-slate-900'>
      <div className='container mx-auto p-4 rounded w-3/4 h-screen'>
        {/* Chat Header Skeleton */}
        <div className='p-4 border-b border-slate-700 bg-slate-800/50 animate-pulse'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='h-10 w-10 bg-slate-700 rounded-full' />
              <div className='space-y-2'>
                <div className='h-4 w-24 bg-slate-700 rounded' />
                <div className='h-3 w-16 bg-slate-700 rounded' />
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='h-8 w-8 bg-slate-700 rounded-lg' />
              <div className='h-8 w-8 bg-slate-700 rounded-lg' />
              <div className='h-8 w-8 bg-slate-700 rounded-lg' />
            </div>
          </div>
        </div>

        {/* Chat Ground Skeleton */}
        <div className='h-[80%] flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800/50 animate-pulse'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                  i % 2 === 0 ? "" : "flex-row-reverse space-x-reverse"
                }`}
              >
                {i % 2 === 0 && (
                  <div className='h-8 w-8 bg-slate-700 rounded-full' />
                )}
                <div className='px-4 py-2 rounded-2xl bg-slate-700'>
                  <div className='h-4 w-32 bg-slate-600 rounded mb-2' />
                  <div className='h-4 w-20 bg-slate-600 rounded' />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input Skeleton */}
        <div className='p-4 border-t border-slate-700 bg-slate-800/50 animate-pulse'>
          <div className='flex items-center space-x-2'>
            <div className='h-10 w-10 bg-slate-700 rounded-lg' />
            <div className='flex-1 h-10 bg-slate-700 rounded-lg' />
            <div className='h-10 w-10 bg-slate-700 rounded-lg' />
          </div>
        </div>
      </div>
    </div>
  );
};
