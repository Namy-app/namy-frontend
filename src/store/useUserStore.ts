import { create } from "zustand";

interface UserState {
  userId: string;
  getUserId: () => string;
  setUserId: (id: string) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  userId: "",
  getUserId: () => get().userId,
  setUserId: (id: string) => set(() => ({ userId: id })),
  reset: () => set(() => ({ userId: "" })),
}));
