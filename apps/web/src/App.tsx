import { serializeAsJSON } from '@excalidraw/excalidraw';
import { createLogger } from '@shared-utils';
import { useCallback, useEffect, useMemo, useState } from 'react';

import CanvasShell from './components/canvas/CanvasShell';
import WorkspaceLayout from './components/layout/WorkspaceLayout';
import AgentPanel from './components/panels/AgentPanel';
import AgentRosterPanel from './components/panels/AgentRosterPanel';
import LibraryPanel from './components/panels/LibraryPanel';
import ModelSelector from './components/panels/ModelSelector';
import { ModelProvider } from './context/ModelProvider';
import { useAgentCollaborator } from './hooks/useAgentCollaborator';
import { useAgentSession } from './hooks/useAgentSession';
import { AGENT_PROFILES } from './state/agents';
import { LIBRARIES, toggleLibrary } from './state/libraries';
import { LibraryEntry } from './types/panels';
import type { CanvasAPI, ExcalidrawElement, ExcalidrawSnapshot } from './types/canvas';

const logger = createLogger({ name: '@tljustdraw/web/app' });

const AppContent = (): JSX.Element => {
  const [libraries, setLibraries] = useState<LibraryEntry[]>(LIBRARIES);
  const [activeAgentId, setActiveAgentId] = useState<string>(AGENT_PROFILES[0]?.id ?? '');
  const [canvasApi, setCanvasApi] = useState<CanvasAPI | null>(null);
  const [latestSnapshot, setLatestSnapshot] = useState<ExcalidrawSnapshot>();

  const agentSession = useAgentSession(activeAgentId);
  useAgentCollaborator({ session: agentSession, app: canvasApi, latestSnapshot });

  const initialLibraryCount = LIBRARIES.length;
  const totalAgentCount = AGENT_PROFILES.length;

  useEffect(() => {
    logger.info('tl;justdraw! workspace mounted', {
      libraryCount: initialLibraryCount,
      agentCount: totalAgentCount,
    });
  }, [initialLibraryCount, totalAgentCount]);

  const handleToggleLibrary = useCallback((libraryId: string) => {
    setLibraries((previous) => {
      const nextState = toggleLibrary(previous, libraryId);
      const toggled = nextState.find((library) => library.id === libraryId);
      logger.info('Library toggled', {
        libraryId,
        enabled: toggled?.enabled ?? false,
      });
      return nextState;
    });
  }, []);

  const handleSelectAgent = useCallback((agentId: string) => {
    setActiveAgentId(agentId);
    logger.info('Active agent selected', { agentId });
  }, []);

  useEffect(() => {
    if (!activeAgentId) {
      logger.warn('No active agent configured');
    }
  }, [activeAgentId]);

  const handleShareLink = useCallback(() => {
    const url = window.location.href;
    if (navigator.share) {
      void navigator.share({ title: 'Barnstormer workspace', url }).catch((error) => {
        logger.warn('Navigator share failed', { error });
      });
    } else if (navigator.clipboard) {
      void navigator.clipboard.writeText(url).then(() => {
        logger.info('Workspace link copied to clipboard');
      });
    }
  }, []);

  const handleInvite = useCallback(() => {
    logger.info('Invite flow triggered');
    window.alert('Invite collaborators by sharing this link or enabling live sync.');
  }, []);

  const handleExportExcalidraw = useCallback(() => {
    if (!canvasApi) {
      logger.warn('Cannot export Excalidraw snapshot without API instance');
      return;
    }
    const elements = canvasApi.getSceneElements();
    const appState = canvasApi.getAppState();
    const files = canvasApi.getFiles();
    const payload = serializeAsJSON(elements, appState, files, 'local');
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `barnstormer-workspace-${Date.now()}.excalidraw`;
    anchor.click();
    URL.revokeObjectURL(url);
    logger.info('Workspace exported to Excalidraw JSON', {
      elementCount: elements.length,
      fileCount: Object.keys(files).length,
    });
  }, [canvasApi]);

  const handleImportExcalidraw = useCallback(
    async (file: File) => {
      if (!canvasApi) {
        logger.warn('Cannot import without Excalidraw API instance');
        return;
      }
      try {
        const text = await file.text();
        const payload = JSON.parse(text) as {
          type?: string;
          elements?: ExcalidrawElement[];
          appState?: Partial<ExcalidrawSnapshot['appState']> | null;
          files?: ExcalidrawSnapshot['files'];
        };
        if (payload.type && payload.type !== 'excalidraw') {
          window.alert('Unsupported file format. Please select a .excalidraw export.');
          return;
        }
        const elements = Array.isArray(payload.elements) ? payload.elements : [];
        const files = payload.files ?? {};
        if (Object.keys(files).length > 0) {
          canvasApi.addFiles(Object.values(files));
        }
        canvasApi.updateScene({
          elements,
          appState: payload.appState ?? undefined,
        });
        const textElements = elements.flatMap((element) => {
          if (element.type === 'text' && 'text' in element && typeof element.text === 'string') {
            const trimmed = element.text.trim();
            return trimmed ? [trimmed] : [];
          }
          return [];
        });
        if (textElements.length > 0) {
          logger.info('Imported Excalidraw text elements', { count: textElements.length });
        }
        logger.info('Imported Excalidraw scene', {
          elementCount: elements.length,
          fileCount: Object.keys(files).length,
        });
      } catch (error) {
        logger.error('Failed to import Excalidraw file', { error });
        window.alert('Import failed. Please confirm the file is a valid .excalidraw export.');
      }
    },
    [canvasApi]
  );

  const floatingPanels = useMemo(
    () => [
      {
        id: 'library' as const,
        content: <LibraryPanel libraries={libraries} onToggle={handleToggleLibrary} />,
        resizable: true,
      },
      {
        id: 'agents' as const,
        content: (
          <AgentRosterPanel
            agents={AGENT_PROFILES}
            activeAgentId={activeAgentId}
            onSelect={handleSelectAgent}
          />
        ),
      },
      {
        id: 'models' as const,
        content: <ModelSelector label="Active model" />,
      },
    ],
    [libraries, handleToggleLibrary, activeAgentId, handleSelectAgent]
  );

  return (
    <WorkspaceLayout
      canvasSlot={
        <CanvasShell
          onAppReady={(apiInstance) => setCanvasApi(apiInstance)}
          onSnapshot={(snapshot) => setLatestSnapshot(snapshot)}
        />
      }
      chatSlot={
        <AgentPanel
          agents={AGENT_PROFILES}
          activeAgentId={activeAgentId}
          onSelect={handleSelectAgent}
          session={agentSession}
        />
      }
      floatingPanels={floatingPanels}
      libraries={libraries}
      onToggleLibrary={handleToggleLibrary}
      agents={AGENT_PROFILES}
      activeAgentId={activeAgentId}
      onSelectAgent={handleSelectAgent}
      onShare={handleShareLink}
      onInvite={handleInvite}
      onExportExcalidraw={handleExportExcalidraw}
      onImportExcalidraw={handleImportExcalidraw}
    />
  );
};

const App = (): JSX.Element => (
  <ModelProvider>
    <AppContent />
  </ModelProvider>
);

export default App;
