import { del, get, set } from "idb-keyval";
import _debounce from "lodash.debounce";
import { useEffect, useState } from "react";
import create from "zustand";
import { persist, StateStorage } from "zustand/middleware";

interface EditorStore {
  contentHtml: string;
  titleHtml: string;
  setTitleHtml: (title: string) => void;
  setContentHtml: (content: string) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const IDBStorage: StateStorage = {
  getItem: async (name) => {
    return (await get(name)) || null;
  },
  setItem: _debounce(async (name, value) => {
    const parsed = JSON.parse(value);
    const newValue = JSON.stringify({ ...parsed, lastUpdate: new Date() });
    await set(name, newValue);
  }, 1500),
  removeItem: async (name) => {
    await del(name);
  },
};

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      titleHtml: "",
      contentHtml: "",
      setContentHtml: (contentHtml) => set({ contentHtml }),
      setTitleHtml: (titleHtml) => set({ titleHtml }),
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },
    }),
    {
      name: "editor",
      getStorage: () => IDBStorage,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (s) => ({
        titleHtml: s.titleHtml,
        contentHtml: s.contentHtml,
      }),
    }
  )
);

export const useEditorHydration = () => {
  const [hydrated, setHydrated] = useState(useEditorStore.persist.hasHydrated);

  useEffect(() => {
    const unsubFinishHydration = useEditorStore.persist.onFinishHydration(() =>
      setHydrated(true)
    );

    setHydrated(useEditorStore.persist.hasHydrated());

    return () => {
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};
