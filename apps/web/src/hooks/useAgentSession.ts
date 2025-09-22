import { createLogger } from '@shared-utils';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useModelContext } from '../context/ModelProvider';
import { getAgentById } from '../state/agents';
import { AgentMessage, AgentSession } from '../types/panels';

const logger = createLogger({ name: '@tljustdraw/web/useAgentSession' });

const createMessageId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useAgentSession = (activeAgentId: string): AgentSession => {
  const [transcript, setTranscript] = useState<AgentMessage[]>([]);
  const [composerValue, setComposerValue] = useState('');
  const { activeModelId } = useModelContext();

  const activeAgent = useMemo(() => getAgentById(activeAgentId), [activeAgentId]);

  useEffect(() => {
    if (!activeAgent) {
      setTranscript([]);
      setComposerValue('');
      logger.warn('Attempted to hydrate agent session with unknown agent id', { activeAgentId });
      return;
    }

    const introMessage: AgentMessage = {
      id: createMessageId(),
      agentId: activeAgentId,
      author: 'system',
      content: `Connected to ${activeAgent.name} (${activeAgent.model}).`,
      timestamp: new Date().toISOString(),
    };

    setTranscript([introMessage]);
    setComposerValue('');
    logger.info('Hydrated agent session', { agentId: activeAgentId });
  }, [activeAgent, activeAgentId]);

  const sendUserMessage = useCallback(() => {
    const trimmed = composerValue.trim();
    if (!trimmed || !activeAgent) {
      if (!trimmed) {
        logger.debug('Ignoring empty agent composer submission');
      }
      return;
    }

    const timestamp = new Date().toISOString();
    const userMessage: AgentMessage = {
      id: createMessageId(),
      agentId: activeAgentId,
      author: 'user',
      content: trimmed,
      timestamp,
    };

    const agentEcho: AgentMessage = {
      id: createMessageId(),
      agentId: activeAgentId,
      author: 'agent',
      content: `${activeAgent.name} (${activeModelId}) acknowledges: “${trimmed}”. (Profile model: ${activeAgent.model}, temp=${activeAgent.temperature})`,
      timestamp: new Date().toISOString(),
    };

    setTranscript((previous) => [...previous, userMessage, agentEcho]);
    setComposerValue('');
    logger.info('Appended agent conversation exchange', {
      agentId: activeAgentId,
      userMessageLength: trimmed.length,
    });
  }, [activeAgent, activeAgentId, activeModelId, composerValue]);

  const sendCanvasAction = useCallback(
    (description: string) => {
      if (!activeAgent) {
        logger.warn('Cannot perform canvas action without active agent');
        return;
      }

      const timestamp = new Date().toISOString();
      const systemMessage: AgentMessage = {
        id: createMessageId(),
        agentId: activeAgentId,
        author: 'system',
        content: `${activeAgent.name} (${activeModelId}) suggests canvas update: ${description}`,
        timestamp,
      };
      setTranscript((previous) => [...previous, systemMessage]);
      logger.info('Agent issued canvas action', { agentId: activeAgentId, description });
    },
    [activeAgent, activeAgentId, activeModelId]
  );

  return {
    activeAgentId,
    transcript,
    composerValue,
    setComposerValue,
    sendUserMessage,
    sendCanvasAction,
  };
};
