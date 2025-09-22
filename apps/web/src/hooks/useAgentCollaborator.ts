import { createLogger } from '@shared-utils';
import { TLStoreSnapshot, TldrawApp } from '@tldraw/tldraw';
import { useEffect, useRef } from 'react';

import { useModelContext } from '../context/ModelProvider';
import { AgentSession } from '../types/panels';

const logger = createLogger({ name: '@tljustdraw/web/useAgentCollaborator' });

interface AgentCollaboratorOptions {
  session: AgentSession;
  app: TldrawApp | null;
  latestSnapshot?: TLStoreSnapshot;
}

export const useAgentCollaborator = ({
  session,
  app,
  latestSnapshot,
}: AgentCollaboratorOptions): void => {
  const { activeModelId } = useModelContext();
  const snapshotRef = useRef<TLStoreSnapshot>();
  snapshotRef.current = latestSnapshot ?? snapshotRef.current;

  useEffect(() => {
    if (!app) {
      return;
    }
    logger.info('Agent collaborator connected to TLDraw', {
      model: activeModelId,
      transcriptLength: session.transcript.length,
    });

    return () => {
      logger.info('Agent collaborator disconnected from TLDraw');
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
