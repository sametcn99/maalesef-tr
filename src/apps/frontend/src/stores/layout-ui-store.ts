"use client";

import { create } from "zustand";

interface LayoutUiStoreState {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
}

export const useLayoutUiStore = create<LayoutUiStoreState>((set) => ({
  isMobileMenuOpen: false,

  setMobileMenuOpen: (open) => {
    set({ isMobileMenuOpen: open });
  },

  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },
}));
