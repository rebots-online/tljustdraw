import clsx from 'clsx';
import { PropsWithChildren } from 'react';

import { ChatDockMode, useWorkspaceLayoutStore } from '../../state/workspaceLayout';

interface ChatDockProps {
  title?: string;
}

const CHAT_MODE_LABELS: Record<ChatDockMode, string> = {
  horizontal: 'Horizontal dock',
  vertical: 'Vertical dock',
  floating: 'Floating window',
};

const ChatDock = ({
  title = 'Agent Chat',
  children,
}: PropsWithChildren<ChatDockProps>): JSX.Element => {
  const mode = useWorkspaceLayoutStore((state) => state.chatDockMode);
  const setChatDockMode = useWorkspaceLayoutStore((state) => state.setChatDockMode);

  const renderModeSwitcher = () => (
    <div className="chat-dock__modes" role="radiogroup" aria-label="Chat layout mode">
      {(Object.keys(CHAT_MODE_LABELS) as ChatDockMode[]).map((modeKey) => (
        <button
          key={modeKey}
          type="button"
          role="radio"
          aria-checked={mode === modeKey}
          className={clsx('chat-dock__mode', mode === modeKey && 'chat-dock__mode--active')}
          onClick={() => setChatDockMode(modeKey)}
        >
          {CHAT_MODE_LABELS[modeKey]}
        </button>
      ))}
    </div>
  );

  if (mode === 'floating') {
    return (
      <div className="chat-dock chat-dock--floating" aria-label={`${title} (floating)`}>
        <header>
          <h2>{title}</h2>
          {renderModeSwitcher()}
        </header>
        <div className="chat-dock__content">{children}</div>
      </div>
    );
  }

  return (
    <aside
      className={clsx(
        'chat-dock',
        mode === 'horizontal' ? 'chat-dock--horizontal' : 'chat-dock--vertical'
      )}
      aria-label={`${title} (${mode})`}
    >
      <header>
        <h2>{title}</h2>
        {renderModeSwitcher()}
      </header>
      <div className="chat-dock__content">{children}</div>
    </aside>
  );
};

export default ChatDock;
