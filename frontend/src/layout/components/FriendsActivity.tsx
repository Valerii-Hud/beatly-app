import { useChatStore } from '@/store/useChatStore';
import type { User } from '@/types';
import { useUser } from '@clerk/clerk-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Music, Users } from 'lucide-react';
import { useEffect } from 'react';
import LoginPrompt from './LoginPrompt';

const FriendsActivity = () => {
  const { users, fetchUsers, onlineUsers, userActivities } = useChatStore();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  return (
    <View
      user={user}
      users={users}
      onlineUsers={onlineUsers}
      userActivities={userActivities}
    />
  );
};

const View = ({
  user,
  users,
  onlineUsers,
  userActivities,
}: {
  user: User | any;
  users: User[];
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
}) => {
  return (
    <div className="h-full bg-zinc-900 rounded-lg flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Users className="size-5 shrink-0" />
          <h2 className="font-semibold">What they're listening to</h2>
        </div>
      </div>
      {!user ? <LoginPrompt /> : null}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {users.map((user: User) => {
            const activity = userActivities.get(user.clerkId);
            const isPlaying = activity && activity !== 'Idle';
            return (
              <div
                key={user._id}
                className="cursor-pointer hover:bg-zinc-800/50 p-3 rounded-md transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="size-10 border border-zinc-800">
                      <AvatarImage src={user.imageUrl} alt={user.fullName} />
                      <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 
                        ${
                          onlineUsers.has(user.clerkId)
                            ? 'bg-green-500'
                            : 'bg-zinc-500'
                        }`}
                      aria-hidden="true"
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0 ">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-white">
                        {user.fullName}
                      </span>
                      {isPlaying && (
                        <Music className="size-3.5 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    {isPlaying ? (
                      <div className="mt-1">
                        <div className="mt-1 text-sm text-white font-medium truncate">
                          {activity.replace('Playing ', '').split(' by ')[0]}
                        </div>
                        <div className="text-xs text-zinc-400 truncate">
                          {activity.split(' by ')[1]}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1 text-xs text-zinc-400">Idle</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FriendsActivity;
