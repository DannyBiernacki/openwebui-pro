import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WidgetType = 'prompt' | 'document' | 'model' | 'result';
export type WidgetPosition = { x: number; y: number };

interface Widget {
  id: string;
  type: WidgetType;
  position: WidgetPosition;
  size: { width: number; height: number };
  data: Record<string, any>;
}

interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  path: string;
}

interface CanvasState {
  // Widgets
  widgets: Widget[];
  addWidget: (widget: Omit<Widget, 'id'>) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, widget: Partial<Widget>) => void;
  moveWidget: (id: string, position: WidgetPosition) => void;

  // Connections
  connections: Connection[];
  addConnection: (connection: Omit<Connection, 'id'>) => void;
  removeConnection: (id: string) => void;
  updateConnection: (id: string, connection: Partial<Connection>) => void;

  // Canvas
  zoom: number;
  setZoom: (zoom: number) => void;
  pan: { x: number; y: number };
  setPan: (pan: { x: number; y: number }) => void;

  // Collaboration
  collaborators: string[];
  addCollaborator: (id: string) => void;
  removeCollaborator: (id: string) => void;
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set) => ({
      // Widgets
      widgets: [],
      addWidget: (widget) =>
        set((state) => ({
          widgets: [
            ...state.widgets,
            { ...widget, id: crypto.randomUUID() },
          ],
        })),
      removeWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
          connections: state.connections.filter(
            (c) => c.sourceId !== id && c.targetId !== id
          ),
        })),
      updateWidget: (id, widget) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, ...widget } : w
          ),
        })),
      moveWidget: (id, position) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, position } : w
          ),
        })),

      // Connections
      connections: [],
      addConnection: (connection) =>
        set((state) => ({
          connections: [
            ...state.connections,
            { ...connection, id: crypto.randomUUID() },
          ],
        })),
      removeConnection: (id) =>
        set((state) => ({
          connections: state.connections.filter((c) => c.id !== id),
        })),
      updateConnection: (id, connection) =>
        set((state) => ({
          connections: state.connections.map((c) =>
            c.id === id ? { ...c, ...connection } : c
          ),
        })),

      // Canvas
      zoom: 1,
      setZoom: (zoom) => set({ zoom }),
      pan: { x: 0, y: 0 },
      setPan: (pan) => set({ pan }),

      // Collaboration
      collaborators: [],
      addCollaborator: (id) =>
        set((state) => ({
          collaborators: [...state.collaborators, id],
        })),
      removeCollaborator: (id) =>
        set((state) => ({
          collaborators: state.collaborators.filter((c) => c !== id),
        })),
    }),
    {
      name: 'canvas-storage',
    }
  )
); 