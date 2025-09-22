import PanelHeader from './PanelHeader';
import { LibraryEntry, LibraryToggleHandler } from '../../types/panels';

interface LibraryPanelProps {
  libraries: LibraryEntry[];
  onToggle: LibraryToggleHandler;
}

const LibraryPanel = ({ libraries, onToggle }: LibraryPanelProps): JSX.Element => {
  const enabledCount = libraries.filter((library) => library.enabled).length;

  return (
    <div className="panel-content">
      <PanelHeader title="Libraries" subtitle={`${enabledCount} of ${libraries.length} enabled`} />
      <ul className="library-list">
        {libraries.map((library) => (
          <li
            key={library.id}
            className={`library-card ${library.enabled ? 'library-card--active' : ''}`}
          >
            <div className="library-card__header">
              <div>
                <h3>{library.name}</h3>
                <p className="library-card__description">{library.description}</p>
              </div>
              <button
                type="button"
                className="toggle-button"
                aria-pressed={library.enabled}
                aria-label={`${library.enabled ? 'Disable' : 'Enable'} ${library.name}`}
                onClick={() => onToggle(library.id)}
              >
                {library.enabled ? 'Disable' : 'Enable'}
              </button>
            </div>
            <dl className="library-card__meta">
              <div>
                <dt>Items</dt>
                <dd>{library.itemCount}</dd>
              </div>
              <div>
                <dt>License</dt>
                <dd>{library.license}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>{library.sourceType === 'builtin' ? 'Built-in' : 'User'}</dd>
              </div>
            </dl>
            {library.attributionUrl ? (
              <a
                className="library-card__link"
                href={library.attributionUrl}
                target="_blank"
                rel="noreferrer"
              >
                Attribution & details
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LibraryPanel;
