"use client";

import { create } from "zustand";

interface JobsFeedUiStoreState {
  searchInput: string;
  companyInput: string;
  locationInput: string;
  syncFromQuery: (values: {
    search: string;
    company: string;
    location: string;
  }) => void;
  setSearchInput: (value: string) => void;
  setCompanyInput: (value: string) => void;
  setLocationInput: (value: string) => void;
  reset: () => void;
}

const initialState = {
  searchInput: "",
  companyInput: "",
  locationInput: "",
};

export const useJobsFeedUiStore = create<JobsFeedUiStoreState>((set) => ({
  ...initialState,

  syncFromQuery: (values) => {
    set({
      searchInput: values.search,
      companyInput: values.company,
      locationInput: values.location,
    });
  },

  setSearchInput: (value) => {
    set({ searchInput: value });
  },

  setCompanyInput: (value) => {
    set({ companyInput: value });
  },

  setLocationInput: (value) => {
    set({ locationInput: value });
  },

  reset: () => {
    set(initialState);
  },
}));
