import Topbar from '@/components/Topbar';
import { useChatStore } from '@/store/useChatStore';
import { useUser } from '@clerk/clerk-react';
import { useEffect, useRef } from 'react';
import UsersList from './components/UsersList';
import ChatHeader from './components/ChatHeader';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import MessageInput from './components/MessageInput';

const ChatPage = () => {
  const { user, isLoaded } = useUser();
  const { messages, selectedUser, fetchMessages, fetchUsers } = useChatStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  useEffect(() => {
    if (!isLoaded || !user) return;
    fetchUsers();
  }, [isLoaded, user, fetchUsers]);

  useEffect(() => {
    if (!selectedUser) return;
    fetchMessages(selectedUser.clerkId);
  }, [selectedUser, fetchMessages]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      isAtBottomRef.current =
        el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isAtBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages]);

  return (
    <main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden flex flex-col">
      <Topbar />

      <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] flex-1 min-h-0">
        <UsersList />

        <div className="flex flex-col h-full min-h-0">
          {selectedUser ? (
            <>
              <ChatHeader />

              <div className="flex-1 overflow-y-auto">
                <div
                  ref={scrollContainerRef}
                  className="p-4 space-y-4 flex flex-col"
                >
                  {messages.map((message) => {
                    const isMine = message.senderId === user?.id;
                    return (
                      <div
                        key={message._id}
                        className={`flex gap-3 ${
                          isMine ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <Avatar className="size-8">
                          <AvatarImage
                            src={
                              isMine ? user?.imageUrl : selectedUser.imageUrl
                            }
                          />
                        </Avatar>

                        <div
                          className={`rounded-lg p-3 max-w-[70%] ${
                            isMine
                              ? 'bg-green-500 text-black'
                              : 'bg-zinc-800 text-white'
                          }`}
                        >
                          <p className="text-sm break-words">
                            {message.content}
                          </p>
                          <span className="text-xs opacity-70 block mt-1">
                            {new Date(message.createdAt).toLocaleTimeString(
                              [],
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <div ref={bottomRef} />
                </div>
              </div>

              <MessageInput />
            </>
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </div>
    </main>
  );
};

export default ChatPage;

const NoConversationPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6">
    <img src="./logo.png" alt="Beatly" className="size-16 animate-bounce" />
    <div className="text-center">
      <h3 className="text-zinc-300 text-lg font-medium mb-1">
        No conversation selected
      </h3>
      <p className="text-zinc-500 text-sm">Choose a friend to start chatting</p>
    </div>
  </div>
);
