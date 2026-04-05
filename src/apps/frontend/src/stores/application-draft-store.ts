"use client";

import { create } from "zustand";

interface ApplicationDraftStoreState {
  jobId: string | null;
  answers: Record<string, string>;
  cvFile: File | null;
  cvError: string | null;
  aiConsent: boolean;
  isInfoModalOpen: boolean;
  initializeDraft: (jobId: string) => void;
  setAnswer: (questionId: string, value: string) => void;
  setCvFile: (file: File | null) => void;
  setCvError: (error: string | null) => void;
  setAiConsent: (value: boolean) => void;
  setInfoModalOpen: (open: boolean) => void;
  reset: () => void;
}

const initialState = {
  jobId: null,
  answers: {},
  cvFile: null,
  cvError: null,
  aiConsent: false,
  isInfoModalOpen: false,
};

export const useApplicationDraftStore = create<ApplicationDraftStoreState>(
  (set, get) => ({
    ...initialState,

    initializeDraft: (jobId) => {
      if (get().jobId === jobId) {
        return;
      }

      set({
        ...initialState,
        jobId,
      });
    },

    setAnswer: (questionId, value) => {
      set((state) => ({
        answers: {
          ...state.answers,
          [questionId]: value,
        },
      }));
    },

    setCvFile: (file) => {
      set({
        cvFile: file,
        cvError: file ? null : get().cvError,
      });
    },

    setCvError: (error) => {
      set({ cvError: error });
    },

    setAiConsent: (value) => {
      set({ aiConsent: value });
    },

    setInfoModalOpen: (open) => {
      set({ isInfoModalOpen: open });
    },

    reset: () => {
      set(initialState);
    },
  }),
);
