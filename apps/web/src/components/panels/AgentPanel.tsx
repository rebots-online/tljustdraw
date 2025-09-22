import { FormEvent, useState } from 'react';

import PanelHeader from './PanelHeader';
import { AgentProfile, AgentSession } from '../../types/panels';

interface AgentPanelProps {
  agents: AgentProfile[];
  activeAgentId: string;
  onSelect: (agentId: string) => void;
  session: AgentSession;
}

const AgentPanel = ({ agents, activeAgentId, onSelect, session }: AgentPanelProps): JSX.Element => {
  const { transcript, composerValue, setComposerValue, sendUserMessage, sendCanvasAction } =
    session;
  const [canvasAction, setCanvasAction] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendUserMessage();
  };

  const handleCanvasAction = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = canvasAction.trim();
    if (trimmed) {
      sendCanvasAction(trimmed);
      setCanvasAction('');
    }
  };

  return (
    <div className="panel-content">
      <PanelHeader title="Agents" subtitle="Invite a co-pilot to assist on the board" />

      <div className="agent-roster" role="tablist" aria-label="Available agents">
        {agents.map((agent) => (
          <button
            key={agent.id}
            type="button"
            role="tab"
            aria-selected={agent.id === activeAgentId}
            className={`agent-pill ${agent.id === activeAgentId ? 'agent-pill--active' : ''}`}
            onClick={() => onSelect(agent.id)}
          >
            <span className="agent-pill__name">{agent.name}</span>
            <span className="agent-pill__meta">{agent.model}</span>
            <span className={`agent-pill__status agent-pill__status--${agent.status}`}>
              {agent.status === 'online' ? 'Online' : agent.status === 'beta' ? 'Beta' : 'Offline'}
            </span>
          </button>
        ))}
      </div>

      <section className="agent-transcript" aria-label="Agent conversation">
        <ul>
          {transcript.map((message) => (
            <li key={message.id} className={`agent-message agent-message--${message.author}`}>
              <div className="agent-message__meta">
                <span className="agent-message__author">{message.author}</span>
                <time dateTime={message.timestamp}>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>
              <p>{message.content}</p>
            </li>
          ))}
        </ul>
      </section>

      <form className="agent-composer" onSubmit={handleSubmit}>
        <label htmlFor="agent-message">Message the agent</label>
        <textarea
          id="agent-message"
          name="agent-message"
          value={composerValue}
          onChange={(event) => setComposerValue(event.target.value)}
          rows={3}
          placeholder="Ask for help summarizing, clustering, or drawing"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>

      <form className="agent-canvas-action" onSubmit={handleCanvasAction}>
        <label htmlFor="agent-canvas-action">Ask the agent to draw</label>
        <input
          id="agent-canvas-action"
          name="agent-canvas-action"
          type="text"
          placeholder="e.g., Sketch a mind map for the sprint goals"
          value={canvasAction}
          onChange={(event) => setCanvasAction(event.target.value)}
        />
        <button type="submit" className="send-button">
          Send canvas action
        </button>
      </form>
    </div>
  );
};

export default AgentPanel;
