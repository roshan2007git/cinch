import { create } from "zustand";

interface ModalStore {
  aiOpen: boolean;
  profileOpen: boolean;

  openAI: () => void;
  closeAI: () => void;

  openProfile: () => void;
  closeProfile: () => void;
}

export const useModalStore =
  create<ModalStore>((set) => ({
    aiOpen: false,

    profileOpen: false,

    openAI: () =>
      set({
        aiOpen: true,
      }),

    closeAI: () =>
      set({
        aiOpen: false,
      }),

    openProfile: () =>
      set({
        profileOpen: true,
      }),

    closeProfile: () =>
      set({
        profileOpen: false,
      }),
  }));