import { axiosInstance } from '@/lib/axios';
import type { Message, User } from '@/types';
import { create } from 'zustand';
import { io } from 'socket.io-client';
interface ChatStore {
  socket: any;
  error: string | null;
  isLoading: boolean;
  isConnected: boolean;
  selectedUser: User | null;
  users: User[];
  messages: Message[];
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  fetchUsers: () => Promise<void>;
  initSocket: (uid: string) => void;
  disconnectSocket: () => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
  fetchMessages: (uid: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}

const baseURL =
  import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '/';
const socketConfig = { autoConnect: false, withCredentials: true };
const socket = io(baseURL, socketConfig);

export const useChatStore = create<ChatStore>((set, get) => ({
  socket: socket,
  error: null,
  isLoading: false,
  isConnected: false,
  selectedUser: null,
  users: [],
  messages: [],
  onlineUsers: new Set(),
  userActivities: new Map(),
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/users');
      set({ users: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  initSocket: (uid) => {
    if (!get().isConnected) {
      socket.auth = { uid };
      socket.connect();
      socket.emit('user_connected', uid);
      set({ isConnected: true });
    }

    socket.off();

    socket.on('users_online', (users: string[]) => {
      set({ onlineUsers: new Set(users) });
    });

    socket.on('receive_message', (message: Message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    socket.on('activity_updated', ({ uid, activity }) => {
      set((state) => {
        const newActivities = new Map(state.userActivities);
        newActivities.set(uid, activity);
        return { userActivities: newActivities };
      });
    });
  },

  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false });
    }
  },

  sendMessage: async (receiverId, senderId, content) => {
    const socket = get().socket;

    if (!socket) return;

    socket.emit('send_message', { receiverId, senderId, content });
  },

  fetchMessages: async (uid) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axiosInstance.get(`/users/messages/${uid}`);
      set({ messages: res.data });
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedUser: (user) =>
    set({
      selectedUser: user,
      messages: [],
    }),
}));
