import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserStoreActions = {
  user: {
    id: string;
    picture?: string;
    given_name: string;
    email: string;
    isOnBoarded: boolean;
    slots: {
      name: string;
      hours: number;
    }[];
    desiredSleepHours: number;
    mongoId: string;
  } | null;
  setUser: (user: UserStoreActions["user"]) => void;
};

export const useUserStore = create<UserStoreActions>()(
  persist(
    (set) => ({
      user: {
        email: "",
        id: "",
        picture: "",
        given_name: "",
        isOnBoarded: false,
        slots: [],
        desiredSleepHours: 7,
        mongoId: "",
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);