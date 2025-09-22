import { ChangeEvent, useRef } from 'react';

interface ShareMenuProps {
  open: boolean;
  onClose: () => void;
  onShare: () => void;
  onInvite: () => void;
  onExportTldraw: () => void;
  onImportExcalidraw: (file: File) => void;
  id?: string;
}

const ShareMenu = ({
  open,
  onClose,
  onShare,
  onInvite,
  onExportTldraw,
  onImportExcalidraw,
  id,
}: ShareMenuProps): JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportExcalidraw(file);
      event.target.value = '';
    }
  };

  return (
    <div
      id={id}
      className={`share-menu ${open ? 'share-menu--open' : ''}`}
      role="menu"
      aria-hidden={!open}
    >
      <button
        type="button"
        className="share-menu__close"
        onClick={onClose}
        aria-label="Close share menu"
      >
        ✕
      </button>
      <ul>
        <li>
          <button type="button" onClick={onShare} role="menuitem">
            Share link
          </button>
        </li>
        <li>
          <button type="button" onClick={onInvite} role="menuitem">
            Invite collaborator
          </button>
        </li>
        <li>
          <button type="button" onClick={onExportTldraw} role="menuitem">
            Export workspace (.tldraw)
          </button>
        </li>
        <li>
          <button type="button" onClick={handleImportClick} role="menuitem">
            Import Excalidraw
          </button>
        </li>
      </ul>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.excalidraw"
        className="share-menu__file-input"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ShareMenu;
