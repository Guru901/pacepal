import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type VersionStoreActions = {
  selectedVersion: string;
  setSelectedVersion: (version: string) => void;
};

export const useVersionStore = create<VersionStoreActions>()(
  persist(
    (set) => ({
      selectedVersion: "v1",
      setSelectedVersion: (version: string) =>
        set({ selectedVersion: version }),
    }),
    {
      name: "version-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
