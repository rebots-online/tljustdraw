import { createLogger } from '@shared-utils';
import { TLStoreSnapshot, Tldraw, TldrawApp } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { useEffect, useMemo } from 'react';

const logger = createLogger({ name: '@tljustdraw/web/canvas-shell' });

export interface CanvasShellProps {
  onAppReady?: (app: TldrawApp) => void;
  onSnapshot?: (snapshot: TLStoreSnapshot) => void;
}

const CanvasShell = ({ onAppReady, onSnapshot }: CanvasShellProps): JSX.Element => {
  useEffect(() => {
    logger.info('Canvas shell mounted');
  }, []);

  const handleMount = useMemo(
    () => (app: TldrawApp) => {
      logger.info('TLDraw app ready');
      onAppReady?.(app);
      if (onSnapshot) {
        const unsubscribe = app.store.listen(
          ({ source }) => {
            if (source === 'user') {
              onSnapshot(app.store.serialize());
            }
          },
          { source: 'user' }
        );
        return () => {
          logger.info('Unsubscribing from TLDraw store');
          unsubscribe();
        };
      }
      return () => undefined;
    },
    [onAppReady, onSnapshot]
  );

  return (
    <div className="canvas-shell">
      <Tldraw persistenceKey="tljustdraw-local" onMount={handleMount} />
    </div>
  );
};

export default CanvasShell;
