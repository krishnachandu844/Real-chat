// import UsersList from "@/mycomponents/UsersList";
import Cookies from "js-cookie";
import { Chat, User, UserType } from "@/types";
import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

const token = Cookies.get("token");

type userChatStoreTypes = {
  messages: Chat[];
  usersList: UserType[];
  selectedUser: UserType | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => void;
  getMessages: (roomId: string) => void;
  setSelectedUser: (user: UserType | null) => void;
  setMessages: (mes: Chat) => void;
};

export const useChatStore = create<userChatStoreTypes>((set, get) => ({
  messages: [],
  usersList: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  //Getting Users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/users");
      if (response.status == 200) {
        set({ usersList: response.data.users, isUsersLoading: false });
      }
    } catch (error) {
      console.log(error);
      set({ isUsersLoading: false });
    }
  },

  //getting Messages
  getMessages: async (roomId) => {
    const response = await axiosInstance.get(`/messages/${roomId}`);
    if (response.status == 200) {
      console.log(response.data.messages);
      // setMessages(data.messages);
      set({ messages: response.data.messages });
    }
  },
  //Setting Specific User
  setSelectedUser: (user) => set({ selectedUser: user }),
  setMessages: (mes: Chat) => set({ messages: [...get().messages, mes] }),
}));
