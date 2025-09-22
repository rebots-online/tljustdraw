import { createLogger } from '@shared-utils';
import { useEffect, useRef } from 'react';

import { useModelContext } from '../context/ModelProvider';
import { AgentSession } from '../types/panels';
import type { CanvasAPI, ExcalidrawSnapshot } from '../types/canvas';

const logger = createLogger({ name: '@tljustdraw/web/useAgentCollaborator' });

interface AgentCollaboratorOptions {
  session: AgentSession;
  app: CanvasAPI | null;
  latestSnapshot?: ExcalidrawSnapshot;
}

export const useAgentCollaborator = ({
  session,
  app,
  latestSnapshot,
}: AgentCollaboratorOptions): void => {
  const { activeModelId } = useModelContext();
  const snapshotRef = useRef<ExcalidrawSnapshot>();
  snapshotRef.current = latestSnapshot ?? snapshotRef.current;

  useEffect(() => {
    if (!app) {
      return;
    }
    logger.info('Agent collaborator connected to Excalidraw', {
      model: activeModelId,
      transcriptLength: session.transcript.length,
    });

    return () => {
      logger.info('Agent collaborator disconnected from Excalidraw');
    };
  }, [activeModelId, app, session.transcript.length]);

  useEffect(() => {
    if (!app || !snapshotRef.current) {
      return;
    }
    logger.debug('Canvas snapshot updated for agent collaborator', {
      model: activeModelId,
    });
  }, [activeModelId, app, latestSnapshot]);
};
