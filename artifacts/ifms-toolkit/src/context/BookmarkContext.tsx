import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface Bookmark {
  id: string;
  createdAt: string;
  source: "workflow" | "wam" | "print";
  itemKey: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  note: string;
}

interface BookmarkContextType {
  bookmarks: Bookmark[];
  isBookmarked: (itemKey: string) => boolean;
  toggle: (item: Omit<Bookmark, "id" | "createdAt" | "note">) => void;
  updateNote: (id: string, note: string) => void;
  remove: (id: string) => void;
  clearAll: () => void;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
}

const KEY = "ifms_bookmarks";

function load(): Bookmark[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}
function save(bms: Bookmark[]) {
  localStorage.setItem(KEY, JSON.stringify(bms));
}

const BookmarkContext = createContext<BookmarkContextType | null>(null);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(load);
  const [panelOpen, setPanelOpen] = useState(false);

  const isBookmarked = useCallback(
    (itemKey: string) => bookmarks.some(b => b.itemKey === itemKey),
    [bookmarks]
  );

  const toggle = useCallback((item: Omit<Bookmark, "id" | "createdAt" | "note">) => {
    setBookmarks(prev => {
      const existing = prev.find(b => b.itemKey === item.itemKey);
      let next: Bookmark[];
      if (existing) {
        next = prev.filter(b => b.itemKey !== item.itemKey);
      } else {
        const newBm: Bookmark = {
          ...item,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          createdAt: new Date().toISOString(),
          note: "",
        };
        next = [...prev, newBm];
      }
      save(next);
      return next;
    });
  }, []);

  const updateNote = useCallback((id: string, note: string) => {
    setBookmarks(prev => {
      const next = prev.map(b => b.id === id ? { ...b, note } : b);
      save(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setBookmarks(prev => {
      const next = prev.filter(b => b.id !== id);
      save(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    save([]);
    setBookmarks([]);
  }, []);

  return (
    <BookmarkContext.Provider value={{ bookmarks, isBookmarked, toggle, updateNote, remove, clearAll, panelOpen, setPanelOpen }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error("useBookmarks must be used inside BookmarkProvider");
  return ctx;
}
