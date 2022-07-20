import create from "zustand";
import _debounce from "lodash.debounce";

import { persist, StateStorage } from "zustand/middleware";

interface EditorStore {
  contentHtml: string;
  titleHtml: string;
  setTitleHtml: (title: string) => void;
  setContentHtml: (content: string) => void;
}

const LocalStorage: StateStorage = {
  getItem: async (name) => {
    return localStorage.getItem(name) || null;
  },
  setItem: _debounce(async (name, value) => {
    const parsed = JSON.parse(value);

    localStorage.setItem(
      name,
      JSON.stringify({ ...parsed, lastUpdate: new Date() })
    );
  }, 1500),
  removeItem: async (name) => {
    localStorage.removeItem(name);
  },
};

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      titleHtml: "",
      contentHtml: "",
      setContentHtml: (contentHtml) => set({ contentHtml }),
      setTitleHtml: (titleHtml) => set({ titleHtml }),
    }),
    {
      name: "editor",
      getStorage: () => LocalStorage,
    }
  )
);