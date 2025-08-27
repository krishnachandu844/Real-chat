import { create } from "zustand";

type UseSocketStoreTypes = {
  onlineUsers: string[];
  setOnlineUsers: (userIds: string[]) => void;
};

export const useSocketStore = create<UseSocketStoreTypes>((set, get) => ({
  onlineUsers: [],
  setOnlineUsers: (userIds: string[]) => {
    set({ onlineUsers: userIds });
  },
}));
