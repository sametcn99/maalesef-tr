"use client";

import { create } from "zustand";
import type { Application, Job } from "@/types";

interface ProfileUiStoreState {
  selectedApplication: Application | null;
  isFeedbackModalOpen: boolean;
  isSettingsDialogOpen: boolean;
  accountDeleted: boolean;
  resendMessage: string | null;
  resendError: string | null;
  resendCooldown: number;
  resendLoading: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  changeLoading: boolean;
  changeError: string | null;
  changeSuccess: string | null;
  isDeleteDialogOpen: boolean;
  deletePassword: string;
  deleteLoading: boolean;
  deleteError: string | null;
  jobToDelete: Job | null;
  isDeletingJob: boolean;
  jobDeleteError: string | null;
  openFeedbackModal: (application: Application) => void;
  closeFeedbackModal: () => void;
  setSettingsDialogOpen: (open: boolean) => void;
  setAccountDeleted: (value: boolean) => void;
  setResendMessage: (value: string | null) => void;
  setResendError: (value: string | null) => void;
  setResendCooldown: (value: number) => void;
  tickResendCooldown: () => void;
  setResendLoading: (value: boolean) => void;
  setChangePasswordField: (
    field: "currentPassword" | "newPassword" | "confirmPassword",
    value: string,
  ) => void;
  setChangeLoading: (value: boolean) => void;
  setChangeError: (value: string | null) => void;
  setChangeSuccess: (value: string | null) => void;
  resetChangePasswordState: () => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setDeletePassword: (value: string) => void;
  setDeleteLoading: (value: boolean) => void;
  setDeleteError: (value: string | null) => void;
  resetDeleteState: () => void;
  setJobToDelete: (job: Job | null) => void;
  setIsDeletingJob: (value: boolean) => void;
  setJobDeleteError: (value: string | null) => void;
  resetJobDeleteState: () => void;
  resetAll: () => void;
}

const initialState = {
  selectedApplication: null,
  isFeedbackModalOpen: false,
  isSettingsDialogOpen: false,
  accountDeleted: false,
  resendMessage: null,
  resendError: null,
  resendCooldown: 0,
  resendLoading: false,
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  changeLoading: false,
  changeError: null,
  changeSuccess: null,
  isDeleteDialogOpen: false,
  deletePassword: "",
  deleteLoading: false,
  deleteError: null,
  jobToDelete: null,
  isDeletingJob: false,
  jobDeleteError: null,
};

export const useProfileUiStore = create<ProfileUiStoreState>((set) => ({
  ...initialState,

  openFeedbackModal: (application) => {
    set({
      selectedApplication: application,
      isFeedbackModalOpen: true,
    });
  },

  closeFeedbackModal: () => {
    set({
      selectedApplication: null,
      isFeedbackModalOpen: false,
    });
  },

  setSettingsDialogOpen: (open) => {
    set({ isSettingsDialogOpen: open });
  },

  setAccountDeleted: (value) => {
    set({ accountDeleted: value });
  },

  setResendMessage: (value) => {
    set({ resendMessage: value });
  },

  setResendError: (value) => {
    set({ resendError: value });
  },

  setResendCooldown: (value) => {
    set({ resendCooldown: Math.max(value, 0) });
  },

  tickResendCooldown: () => {
    set((state) => ({ resendCooldown: Math.max(state.resendCooldown - 1, 0) }));
  },

  setResendLoading: (value) => {
    set({ resendLoading: value });
  },

  setChangePasswordField: (field, value) => {
    set({ [field]: value } as Pick<
      ProfileUiStoreState,
      "currentPassword" | "newPassword" | "confirmPassword"
    >);
  },

  setChangeLoading: (value) => {
    set({ changeLoading: value });
  },

  setChangeError: (value) => {
    set({ changeError: value });
  },

  setChangeSuccess: (value) => {
    set({ changeSuccess: value });
  },

  resetChangePasswordState: () => {
    set({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      changeLoading: false,
      changeError: null,
      changeSuccess: null,
    });
  },

  setDeleteDialogOpen: (open) => {
    set((state) => ({
      isDeleteDialogOpen: open,
      deletePassword: open ? state.deletePassword : "",
      deleteError: open ? state.deleteError : null,
      deleteLoading: open ? state.deleteLoading : false,
    }));
  },

  setDeletePassword: (value) => {
    set({ deletePassword: value });
  },

  setDeleteLoading: (value) => {
    set({ deleteLoading: value });
  },

  setDeleteError: (value) => {
    set({ deleteError: value });
  },

  resetDeleteState: () => {
    set({
      isDeleteDialogOpen: false,
      deletePassword: "",
      deleteLoading: false,
      deleteError: null,
    });
  },

  setJobToDelete: (job) => {
    set({
      jobToDelete: job,
      isDeletingJob: false,
      jobDeleteError: null,
    });
  },

  setIsDeletingJob: (value) => {
    set({ isDeletingJob: value });
  },

  setJobDeleteError: (value) => {
    set({ jobDeleteError: value });
  },

  resetJobDeleteState: () => {
    set({
      jobToDelete: null,
      isDeletingJob: false,
      jobDeleteError: null,
    });
  },

  resetAll: () => {
    set(initialState);
  },
}));
