import { createLogger } from '@shared-utils';
import { TLStoreSnapshot, TldrawApp } from '@tldraw/tldraw';
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

const logger = createLogger({ name: '@tljustdraw/web/app' });

const AppContent = (): JSX.Element => {
  const [libraries, setLibraries] = useState<LibraryEntry[]>(LIBRARIES);
  const [activeAgentId, setActiveAgentId] = useState<string>(AGENT_PROFILES[0]?.id ?? '');
  const [tldrawApp, setTldrawApp] = useState<TldrawApp | null>(null);
  const [latestSnapshot, setLatestSnapshot] = useState<TLStoreSnapshot>();

  const agentSession = useAgentSession(activeAgentId);
  useAgentCollaborator({ session: agentSession, app: tldrawApp, latestSnapshot });

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

  const handleExportTldraw = useCallback(() => {
    if (!tldrawApp) {
      logger.warn('Cannot export TLDraw snapshot without app instance');
      return;
    }
    const snapshot = JSON.stringify(tldrawApp.store.serialize(), null, 2);
    const blob = new Blob([snapshot], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `barnstormer-workspace-${Date.now()}.tldraw.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    logger.info('Workspace exported to TLDraw JSON');
  }, [tldrawApp]);

  const handleImportExcalidraw = useCallback(
    async (file: File) => {
      if (!tldrawApp) {
        logger.warn('Cannot import without TLDraw app');
        return;
      }
      const text = await file.text();
      const payload = JSON.parse(text) as { elements?: Array<{ text?: string }> };
      const elements = payload.elements ?? [];
      if (elements.length === 0) {
        window.alert('No elements detected in Excalidraw file.');
        return;
      }
      const notes = elements
        .map((element) => element.text?.trim())
        .filter((value): value is string => Boolean(value));
      if (notes.length === 0) {
        window.alert(
          'Only non-text Excalidraw elements were found. Import currently supports text elements.'
        );
        return;
      }
      const origin = tldrawApp.getCamera();
      notes.forEach((note, index) => {
        const shapeId = tldrawApp.createShapeId();
        type ShapeInput = Parameters<TldrawApp['createShapes']>[0][number];
        const stickyShape: ShapeInput = {
          id: shapeId,
          type: 'sticky',
          x: origin.x + 64 * index,
          y: origin.y + 64 * index,
          props: {
            text: note,
            color: 'yellow',
            size: 'm',
          },
        };
        tldrawApp.createShapes([stickyShape]);
      });
      logger.info('Imported Excalidraw text elements into TLDraw', { count: notes.length });
    },
    [tldrawApp]
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
          onAppReady={(appInstance) => setTldrawApp(appInstance)}
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
      onExportTldraw={handleExportTldraw}
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
