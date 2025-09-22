import { useCallback, useMemo } from 'react';

import FloatingPanelLayer from './FloatingPanelLayer';
import SettingsDrawer from './SettingsDrawer';
import ShareMenu from './ShareMenu';
import { useWorkspaceLayoutStore } from '../../state/workspaceLayout';
import { AgentProfile, LibraryEntry } from '../../types/panels';
import CogIcon from '../icons/CogIcon';
import HamburgerIcon from '../icons/HamburgerIcon';
import ChatDock from '../panels/ChatDock';

interface WorkspaceLayoutProps {
  canvasSlot: React.ReactNode;
  chatSlot: React.ReactNode;
  floatingPanels: Array<{
    id: 'library' | 'agents' | 'models';
    content: React.ReactNode;
    footer?: React.ReactNode;
    headerContent?: React.ReactNode;
    resizable?: boolean;
  }>;
  libraries: LibraryEntry[];
  onToggleLibrary: (libraryId: string) => void;
  agents: AgentProfile[];
  activeAgentId: string;
  onSelectAgent: (agentId: string) => void;
  onShare: () => void;
  onInvite: () => void;
  onExportTldraw: () => void;
  onImportExcalidraw: (file: File) => void;
}

const WorkspaceLayout = ({
  canvasSlot,
  chatSlot,
  floatingPanels,
  libraries,
  onToggleLibrary,
  agents,
  activeAgentId,
  onSelectAgent,
  onShare,
  onInvite,
  onExportTldraw,
  onImportExcalidraw,
}: WorkspaceLayoutProps): JSX.Element => {
  const settingsOpen = useWorkspaceLayoutStore((state) => state.settingsOpen);
  const setSettingsOpen = useWorkspaceLayoutStore((state) => state.setSettingsOpen);
  const shareMenuOpen = useWorkspaceLayoutStore((state) => state.shareMenuOpen);
  const setShareMenuOpen = useWorkspaceLayoutStore((state) => state.setShareMenuOpen);

  const panelItems = useMemo(() => floatingPanels, [floatingPanels]);

  const handleShare = useCallback(() => {
    setShareMenuOpen(false);
    onShare();
  }, [onShare, setShareMenuOpen]);

  const handleInvite = useCallback(() => {
    setShareMenuOpen(false);
    onInvite();
  }, [onInvite, setShareMenuOpen]);

  const handleExport = useCallback(() => {
    setShareMenuOpen(false);
    onExportTldraw();
  }, [onExportTldraw, setShareMenuOpen]);

  const handleImport = useCallback(
    (file: File) => {
      setShareMenuOpen(false);
      onImportExcalidraw(file);
    },
    [onImportExcalidraw, setShareMenuOpen]
  );

  return (
    <div className="workspace-layout">
      <header className="workspace-chrome">
        <button
          type="button"
          className="workspace-chrome__button"
          onClick={() => setShareMenuOpen(!shareMenuOpen)}
          aria-expanded={shareMenuOpen}
          aria-controls="workspace-share-menu"
        >
          <HamburgerIcon />
        </button>
        <h1 className="workspace-chrome__title">Barnstormer</h1>
        <div className="workspace-chrome__actions">
          <button
            type="button"
            className="workspace-chrome__button"
            onClick={() => setSettingsOpen(!settingsOpen)}
            aria-expanded={settingsOpen}
            aria-controls="workspace-settings"
          >
            <CogIcon />
          </button>
        </div>
      </header>

      <div className="workspace-main">
        <div className="workspace-canvas" role="presentation">
          {canvasSlot}
          <FloatingPanelLayer panels={panelItems} />
          <ShareMenu
            id="workspace-share-menu"
            open={shareMenuOpen}
            onClose={() => setShareMenuOpen(false)}
            onShare={handleShare}
            onInvite={handleInvite}
            onExportTldraw={handleExport}
            onImportExcalidraw={handleImport}
          />
        </div>
        <ChatDock>{chatSlot}</ChatDock>
      </div>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        libraries={libraries}
        onToggleLibrary={onToggleLibrary}
        agents={agents}
        activeAgentId={activeAgentId}
        onSelectAgent={onSelectAgent}
      />
    </div>
  );
};

export default WorkspaceLayout;
