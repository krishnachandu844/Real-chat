import { create } from "zustand";

import Cookies from "js-cookie";
const token = Cookies.get("jwt");

type UseSocketStoreTypes = {
  onlineUsers: string[];
  socket: null | WebSocket;
  connectSocket: () => void;
  disconnectSocket: () => void;
  setOnlineUsers: (userIds: string[]) => void;
};

export const useSocketStore = create<UseSocketStoreTypes>((set, get) => ({
  onlineUsers: [],
  socket: null,
  connectSocket: () => {
    const socket = get().socket;
    if (socket) {
      console.log("Socket already connected");
      return;
    }
    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
    ws.onopen = () => {
      set({ socket: ws });
      console.log("WebSocket connection established");
    };
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.close();
      set({ socket: null });
    }
  },
  setOnlineUsers: (userIds: string[]) => {
    set({ onlineUsers: userIds });
  },
}));
