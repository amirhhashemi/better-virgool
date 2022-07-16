import create from "zustand";
import { persist } from "zustand/middleware";

interface EditorStore {
  contentHtml: string;
  titleHtml: string;
  setTitleHtml: (title: string) => void;
  setContentHtml: (content: string) => void;
  clear: () => void;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      titleHtml: "",
      contentHtml: "",
      setContentHtml: (contentHtml) => set({ contentHtml }),
      setTitleHtml: (titleHtml) => set({ titleHtml }),
      clear: () => set({ contentHtml: "", titleHtml: "" }),
    }),
    {
      name: "editor",
    }
  )
);
