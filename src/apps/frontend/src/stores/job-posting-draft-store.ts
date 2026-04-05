"use client";

import { create } from "zustand";
import type { CreateJobPayload, Job, JobQuestion } from "@/types";
import { useJobPostingStore } from "./job-posting-store";

interface JobPostingDraftStoreState {
  title: string;
  company: string;
  location: string;
  shortDescription: string;
  fullDescription: string;
  requirements: string[];
  requirementInput: string;
  questions: JobQuestion[];
  qLabel: string;
  qType: JobQuestion["type"];
  qPlaceholder: string;
  qRequired: boolean;
  qOptionInput: string;
  qOptions: string[];
  isSubmitting: boolean;
  setBasicField: (
    field:
      | "title"
      | "company"
      | "location"
      | "shortDescription"
      | "fullDescription",
    value: string,
  ) => void;
  setRequirementInput: (value: string) => void;
  addRequirement: () => void;
  removeRequirement: (index: number) => void;
  setQuestionDraftField: (
    field: "qLabel" | "qType" | "qPlaceholder" | "qRequired" | "qOptionInput",
    value: string | boolean,
  ) => void;
  addQuestionOption: () => void;
  removeQuestionOption: (index: number) => void;
  addQuestion: () => void;
  removeQuestion: (index: number) => void;
  submitJob: () => Promise<Job>;
  reset: () => void;
}

const initialState = {
  title: "",
  company: "",
  location: "",
  shortDescription: "",
  fullDescription: "",
  requirements: [],
  requirementInput: "",
  questions: [],
  qLabel: "",
  qType: "text" as JobQuestion["type"],
  qPlaceholder: "",
  qRequired: true,
  qOptionInput: "",
  qOptions: [],
  isSubmitting: false,
};

function buildPayload(state: JobPostingDraftStoreState): CreateJobPayload {
  return {
    title: state.title.trim(),
    company: state.company.trim(),
    location: state.location.trim(),
    shortDescription: state.shortDescription.trim(),
    fullDescription: state.fullDescription.trim(),
    requirements: state.requirements,
    questions: state.questions,
  };
}

export const useJobPostingDraftStore = create<JobPostingDraftStoreState>(
  (set, get) => ({
    ...initialState,

    setBasicField: (field, value) => {
      set({ [field]: value } as Pick<
        JobPostingDraftStoreState,
        | "title"
        | "company"
        | "location"
        | "shortDescription"
        | "fullDescription"
      >);
    },

    setRequirementInput: (value) => {
      set({ requirementInput: value });
    },

    addRequirement: () => {
      const { requirementInput, requirements } = get();
      const value = requirementInput.trim();

      if (!value || requirements.includes(value)) {
        return;
      }

      set({
        requirements: [...requirements, value],
        requirementInput: "",
      });
    },

    removeRequirement: (index) => {
      set((state) => ({
        requirements: state.requirements.filter(
          (_, itemIndex) => itemIndex !== index,
        ),
      }));
    },

    setQuestionDraftField: (field, value) => {
      set({ [field]: value } as Pick<
        JobPostingDraftStoreState,
        "qLabel" | "qType" | "qPlaceholder" | "qRequired" | "qOptionInput"
      >);
    },

    addQuestionOption: () => {
      const { qOptionInput, qOptions } = get();
      const value = qOptionInput.trim();

      if (!value || qOptions.includes(value)) {
        return;
      }

      set({
        qOptions: [...qOptions, value],
        qOptionInput: "",
      });
    },

    removeQuestionOption: (index) => {
      set((state) => ({
        qOptions: state.qOptions.filter((_, itemIndex) => itemIndex !== index),
      }));
    },

    addQuestion: () => {
      const { qLabel, qType, qPlaceholder, qRequired, qOptions, questions } =
        get();

      if (!qLabel.trim()) {
        return;
      }

      if (qType === "select" && qOptions.length < 2) {
        return;
      }

      const question: JobQuestion = {
        id: `q${Date.now()}`,
        label: qLabel.trim(),
        type: qType,
        placeholder: qPlaceholder.trim() || undefined,
        options: qType === "select" ? qOptions : undefined,
        required: qRequired,
      };

      set((_state) => ({
        questions: [...questions, question],
        qLabel: "",
        qType: "text",
        qPlaceholder: "",
        qRequired: true,
        qOptionInput: "",
        qOptions: [],
      }));
    },

    removeQuestion: (index) => {
      set((state) => ({
        questions: state.questions.filter(
          (_, itemIndex) => itemIndex !== index,
        ),
      }));
    },

    submitJob: async () => {
      set({ isSubmitting: true });

      try {
        const createdJob = await useJobPostingStore
          .getState()
          .addJob(buildPayload(get()));

        set(initialState);
        return createdJob;
      } catch (error) {
        set({ isSubmitting: false });
        throw error;
      }
    },

    reset: () => {
      set(initialState);
    },
  }),
);
