import { create } from 'zustand';

export type ChatDockMode = 'horizontal' | 'vertical' | 'floating';

type PanelId = 'library' | 'agents' | 'models';

export interface FloatingPanelState {
  id: PanelId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
}

interface WorkspaceLayoutState {
  panels: Record<PanelId, FloatingPanelState>;
  chatDockMode: ChatDockMode;
  settingsOpen: boolean;
  shareMenuOpen: boolean;
  setChatDockMode: (mode: ChatDockMode) => void;
  updatePanel: (id: PanelId, partial: Partial<FloatingPanelState>) => void;
  togglePanel: (id: PanelId, visible?: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setShareMenuOpen: (open: boolean) => void;
}

const DEFAULT_PANEL_STATE: Record<PanelId, FloatingPanelState> = {
  library: {
    id: 'library',
    title: 'Libraries',
    x: 32,
    y: 120,
    width: 320,
    height: 420,
    visible: true,
  },
  agents: {
    id: 'agents',
    title: 'Agents',
    x: 380,
    y: 120,
    width: 360,
    height: 480,
    visible: true,
  },
  models: {
    id: 'models',
    title: 'Models',
    x: 760,
    y: 120,
    width: 280,
    height: 260,
    visible: false,
  },
};

export const useWorkspaceLayoutStore = create<WorkspaceLayoutState>((set) => ({
  panels: DEFAULT_PANEL_STATE,
  chatDockMode: 'horizontal',
  settingsOpen: false,
  shareMenuOpen: false,
  setChatDockMode: (mode) => set({ chatDockMode: mode }),
  updatePanel: (id, partial) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [id]: {
          ...state.panels[id],
          ...partial,
        },
      },
    })),
  togglePanel: (id, visible) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [id]: {
          ...state.panels[id],
          visible: visible ?? !state.panels[id]?.visible,
        },
      },
    })),
  setSettingsOpen: (open) => set({ settingsOpen: open }),
  setShareMenuOpen: (open) => set({ shareMenuOpen: open }),
}));
