import { useEffect } from "react";
import { create } from "zustand";

interface PageHeaderState {
  title: string | null;
  description: string | null;
  setHeader: (title: string | null, description?: string | null) => void;
}

/** What the app topbar shows for the current page. */
export const usePageHeaderStore = create<PageHeaderState>()((set) => ({
  title: null,
  description: null,
  setHeader: (title, description = null) => set({ title, description }),
}));

/** Publishes the page's title/description to the app topbar. */
export function usePageHeader(title: string, description?: string) {
  const setHeader = usePageHeaderStore((state) => state.setHeader);
  useEffect(() => {
    setHeader(title, description ?? null);
    return () => setHeader(null);
  }, [title, description, setHeader]);
}
