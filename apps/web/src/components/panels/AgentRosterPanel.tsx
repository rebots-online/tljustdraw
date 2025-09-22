import { AgentProfile } from '../../types/panels';

interface AgentRosterPanelProps {
  agents: AgentProfile[];
  activeAgentId: string;
  onSelect: (agentId: string) => void;
}

const AgentRosterPanel = ({
  agents,
  activeAgentId,
  onSelect,
}: AgentRosterPanelProps): JSX.Element => (
  <div className="agent-roster-panel" role="tablist" aria-label="Workspace agents">
    {agents.map((agent) => (
      <button
        key={agent.id}
        type="button"
        role="tab"
        aria-selected={agent.id === activeAgentId}
        className={`agent-roster-panel__item ${agent.id === activeAgentId ? 'agent-roster-panel__item--active' : ''}`}
        onClick={() => onSelect(agent.id)}
      >
        <span className="agent-roster-panel__name">{agent.name}</span>
        <span className="agent-roster-panel__model">{agent.model}</span>
        <span className={`agent-roster-panel__status agent-roster-panel__status--${agent.status}`}>
          {agent.status}
        </span>
      </button>
    ))}
  </div>
);

export default AgentRosterPanel;
