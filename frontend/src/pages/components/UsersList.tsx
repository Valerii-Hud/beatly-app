import { memo } from 'react';
import UsersListSkeleton from '@/components/skeletons/UsersListSkeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChatStore } from '@/store/useChatStore';

const UsersList = () => {
  const users = useChatStore((s) => s.users);
  const selectedUser = useChatStore((s) => s.selectedUser);
  const isLoading = useChatStore((s) => s.isLoading);
  const setSelectedUser = useChatStore((s) => s.setSelectedUser);
  const onlineUsers = useChatStore((s) => s.onlineUsers);

  return (
    <aside className="border-r border-zinc-800 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-4">
          {!isLoading ? (
            users.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                  selectedUser?.clerkId === user.clerkId
                    ? 'bg-zinc-800'
                    : 'hover:bg-zinc-800/50'
                }`}
              >
                <div className="relative size-12">
                  <Avatar className="size-12">
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-zinc-900 ${
                      onlineUsers.has(user.clerkId)
                        ? 'bg-green-500'
                        : 'bg-zinc-500'
                    }`}
                  />
                </div>

                <span className="font-medium truncate hidden lg:block">
                  {user.fullName}
                </span>
              </div>
            ))
          ) : (
            <UsersListSkeleton />
          )}
        </div>
      </div>
    </aside>
  );
};

export default memo(UsersList);
