import type { Song } from '@/types';
import { create } from 'zustand';
import { useChatStore } from './useChatStore';

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    const song = songs[startIndex];
    if (songs.length === 0) return;

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit('update_activity', {
        uid: socket.auth.uid,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }
    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return;

    const socket = useChatStore.getState().socket;

    if (socket.auth) {
      socket.emit('update_activity', {
        uid: socket.auth.uid,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    const songIndex = get().queue?.findIndex((s) => s._id === song._id) ?? -1;

    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },

  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;

    const currentSong = get().currentSong;
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit('update_activity', {
        uid: socket.auth.uid,
        activity:
          willStartPlaying && currentSong
            ? `Playing ${currentSong.title} by ${currentSong.artist}`
            : 'Idle',
      });
    }

    set({ isPlaying: willStartPlaying });
  },

  playNext: () => {
    const { queue, currentIndex } = get();
    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      const socket = useChatStore.getState().socket;
      const nextSong = queue[nextIndex];
      if (socket.auth) {
        socket.emit('update_activity', {
          uid: socket.auth.uid,
          activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
        });
      }
      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: false,
      });
    } else {
      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit('update_activity', {
          uid: socket.auth.uid,
          activity: 'Idle',
        });
      }
      set({ isPlaying: false });
    }
  },

  playPrevious: () => {
    const { queue, currentIndex } = get();
    const previousIndex = currentIndex - 1;

    if (previousIndex >= 0) {
      const socket = useChatStore.getState().socket;
      const previousSong = queue[previousIndex];
      if (socket.auth) {
        socket.emit('update_activity', {
          uid: socket.auth.uid,
          activity: `Playing ${previousSong.title} by ${previousSong.artist}`,
        });
        set({
          currentSong: previousSong,
          currentIndex: previousIndex,
          isPlaying: false,
        });
      }
    } else {
      set({ isPlaying: false });
      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit('update_activity', {
          uid: socket.auth.uid,
          activity: 'Idle',
        });
      }
    }
  },
}));
