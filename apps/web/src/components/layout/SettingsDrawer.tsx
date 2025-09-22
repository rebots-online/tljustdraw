import { AgentProfile, LibraryEntry } from '../../types/panels';
import ModelSelector from '../panels/ModelSelector';

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  libraries: LibraryEntry[];
  onToggleLibrary: (libraryId: string) => void;
  agents: AgentProfile[];
  activeAgentId: string;
  onSelectAgent: (agentId: string) => void;
}

const SettingsDrawer = ({
  open,
  onClose,
  libraries,
  onToggleLibrary,
  agents,
  activeAgentId,
  onSelectAgent,
}: SettingsDrawerProps): JSX.Element => (
  <div
    id="workspace-settings"
    className={`settings-drawer ${open ? 'settings-drawer--open' : ''}`}
    role="dialog"
    aria-modal="true"
    aria-hidden={!open}
  >
    <div className="settings-drawer__header">
      <h2>Workspace Settings</h2>
      <button
        type="button"
        onClick={onClose}
        className="settings-drawer__close"
        aria-label="Close settings"
      >
        ✕
      </button>
    </div>

    <div className="settings-drawer__content">
      <section>
        <h3>Model Catalog</h3>
        <ModelSelector label="Active OpenRouter model" />
      </section>

      <section>
        <h3>Libraries</h3>
        <ul className="settings-drawer__list">
          {libraries.map((library) => (
            <li key={library.id}>
              <div>
                <p className="settings-drawer__item-title">{library.name}</p>
                <p className="settings-drawer__item-description">{library.description}</p>
              </div>
              <button type="button" onClick={() => onToggleLibrary(library.id)}>
                {library.enabled ? 'Disable' : 'Enable'}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Agents</h3>
        <ul
          className="settings-drawer__list settings-drawer__list--agents"
          role="radiogroup"
          aria-label="Select agent"
        >
          {agents.map((agent) => (
            <li key={agent.id}>
              <button
                type="button"
                role="radio"
                aria-checked={agent.id === activeAgentId}
                onClick={() => onSelectAgent(agent.id)}
              >
                <span className="settings-drawer__item-title">{agent.name}</span>
                <span className="settings-drawer__item-description">{agent.description}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  </div>
);

export default SettingsDrawer;
