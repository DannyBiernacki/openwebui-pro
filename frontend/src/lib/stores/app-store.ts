import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppMode = 'workspace' | 'canvas' | 'wizard';
export type Theme = 'light' | 'dark' | 'system';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Document {
  id: string;
  name: string;
  status: 'uploading' | 'uploaded' | 'error';
  type: 'pdf' | 'youtube' | 'web';
  url?: string;
}

interface DataSource {
  id: string;
  name: string;
  type: 'pdf' | 'youtube' | 'web';
  url: string;
  status: 'active' | 'inactive';
}

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Mode
  currentMode: AppMode;
  setCurrentMode: (mode: AppMode) => void;

  // Documents
  documents: Document[];
  addDocument: (document: Document) => void;
  removeDocument: (id: string) => void;
  updateDocument: (id: string, document: Partial<Document>) => void;

  // Data Sources
  dataSources: DataSource[];
  addDataSource: (source: DataSource) => void;
  removeDataSource: (id: string) => void;
  updateDataSource: (id: string, source: Partial<DataSource>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),

      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // Mode
      currentMode: 'workspace',
      setCurrentMode: (mode) => set({ currentMode: mode }),

      // Documents
      documents: [],
      addDocument: (document) =>
        set((state) => ({ documents: [...state.documents, document] })),
      removeDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
        })),
      updateDocument: (id, document) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, ...document } : doc
          ),
        })),

      // Data Sources
      dataSources: [],
      addDataSource: (source) =>
        set((state) => ({ dataSources: [...state.dataSources, source] })),
      removeDataSource: (id) =>
        set((state) => ({
          dataSources: state.dataSources.filter((source) => source.id !== id),
        })),
      updateDataSource: (id, source) =>
        set((state) => ({
          dataSources: state.dataSources.map((s) =>
            s.id === id ? { ...s, ...source } : s
          ),
        })),
    }),
    {
      name: 'app-storage',
    }
  )
); 