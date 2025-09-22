import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import { createLogger } from '@shared-utils';
import { useCallback, useEffect, useRef } from 'react';

import type { CanvasAPI, ExcalidrawSnapshot } from '../../types/canvas';

const logger = createLogger({ name: '@tljustdraw/web/canvas-shell' });

export interface CanvasShellProps {
  onAppReady?: (app: CanvasAPI) => void;
  onSnapshot?: (snapshot: ExcalidrawSnapshot) => void;
}

const CanvasShell = ({ onAppReady, onSnapshot }: CanvasShellProps): JSX.Element => {
  const apiRef = useRef<CanvasAPI | null>(null);

  useEffect(() => {
    logger.info('Canvas shell mounted');
    return () => {
      logger.info('Canvas shell unmounted');
    };
  }, []);

  const handleApiRef = useCallback(
    (api: CanvasAPI | null) => {
      if (api) {
        apiRef.current = api;
        logger.info('Excalidraw API ready');
        if (typeof window !== 'undefined') {
          window.requestAnimationFrame(() => {
            apiRef.current?.refresh();
          });
        }
        onAppReady?.(api);
      } else if (apiRef.current) {
        logger.info('Excalidraw API disconnected');
        apiRef.current = null;
      }
    },
    [onAppReady]
  );

  const handleChange = useCallback(
    (
      elements: ExcalidrawSnapshot['elements'],
      appState: ExcalidrawSnapshot['appState'],
      files: ExcalidrawSnapshot['files']
    ) => {
      if (!onSnapshot) {
        return;
      }
      onSnapshot({ elements, appState, files });
    },
    [onSnapshot]
  );

  return (
    <div className="canvas-shell">
      <Excalidraw ref={handleApiRef} onChange={handleChange} />
    </div>
  );
};

export default CanvasShell;
