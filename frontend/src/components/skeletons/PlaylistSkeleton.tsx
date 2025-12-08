const PlaylistSkeleton = () => {
  const skeleton = Array.from({ length: 7 }).map((_, index) => (
    <View key={index} />
  ));
  return skeleton;
};

const View = () => {
  return (
    <div className="p-2 rounded-md flex items-center gap-3">
      <div className="w-12 h-12 bg-zinc-800 rounded-md flex-shrink-0 animate-pulse"></div>
      <div className="flex-1 min-w-0 hidden md:block space-y-2">
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4"></div>
        <div className="h-3 bg-zinc-800 rounded animate-pulse w-1/2"></div>
      </div>
    </div>
  );
};

export default PlaylistSkeleton;
