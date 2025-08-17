import { axiosInstance } from "@/lib/axios";
import { User, UserType } from "@/types";
import axios from "axios";
import Cookies from "js-cookie";
import { create } from "zustand";

type AuthStoreTypes = {
  isLoginIn: boolean;
  isLoading: boolean;
  user: User | null;

  login: (userDetails: {
    username: string;
    password: string;
  }) => Promise<boolean>;
  getUser: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStoreTypes>((set, get) => ({
  isLoginIn: false,
  isLoading: false,
  user: null,
  onlineUsers: [],
  socket: null,

  getUser: async () => {
    const response = await axiosInstance.get("/me");
    if (response.status == 200) {
      set({ user: response.data.user });
    }
  },

  login: async (userDetails) => {
    set({ isLoading: true }); // Start loading

    try {
      const response = await axiosInstance.post("/signin", userDetails);
      if (response.status == 200) {
        set({ isLoginIn: true, isLoading: false });
        return true;
      } else {
        set({ isLoginIn: false, isLoading: false });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      set({ isLoginIn: false, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post("/logout");
      if (response.status == 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  },
}));
