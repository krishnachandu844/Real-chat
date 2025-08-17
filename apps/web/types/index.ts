export interface UserType {
  id: string;
  username: string;
  password: string;
  avatar?: string;
  Status: string;
}

// @/types/index.ts
export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface Chat {
  id?: number;
  message: string;
  senderId?: string;
  receiverId?: string;
  roomId?: string;
  createdAt: Date;
}
