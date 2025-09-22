import { PropsWithChildren, useCallback, useMemo, useRef } from 'react';

import { useWorkspaceLayoutStore } from '../../state/workspaceLayout';

interface FloatingPanelProps {
  panelId: 'library' | 'agents' | 'models';
  footer?: React.ReactNode;
  headerContent?: React.ReactNode;
  resizable?: boolean;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const FloatingPanel = ({
  panelId,
  children,
  footer,
  headerContent,
  resizable = false,
}: PropsWithChildren<FloatingPanelProps>): JSX.Element | null => {
  const panelState = useWorkspaceLayoutStore((state) => state.panels[panelId]);
  const updatePanel = useWorkspaceLayoutStore((state) => state.updatePanel);

  const dragDataRef = useRef<{
    pointerId: number;
    originX: number;
    originY: number;
    startX: number;
    startY: number;
  }>();
  const sizeDataRef = useRef<{
    pointerId: number;
    startWidth: number;
    startHeight: number;
    originX: number;
    originY: number;
  }>();

  const handleHeaderPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
      dragDataRef.current = {
        pointerId: event.pointerId,
        originX: event.clientX,
        originY: event.clientY,
        startX: panelState.x,
        startY: panelState.y,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
      const onPointerMove = (moveEvent: PointerEvent) => {
        if (!dragDataRef.current || dragDataRef.current.pointerId !== moveEvent.pointerId) {
          return;
        }
        const deltaX = moveEvent.clientX - dragDataRef.current.originX;
        const deltaY = moveEvent.clientY - dragDataRef.current.originY;
        const nextX = dragDataRef.current.startX + deltaX;
        const nextY = dragDataRef.current.startY + deltaY;
        const maxX = window.innerWidth - (bounds?.width ?? panelState.width) - 16;
        const maxY = window.innerHeight - 64;
        updatePanel(panelId, {
          x: clamp(nextX, 16, Math.max(maxX, 16)),
          y: clamp(nextY, 64, Math.max(maxY, 64)),
        });
      };
      const onPointerUp = (upEvent: PointerEvent) => {
        if (dragDataRef.current?.pointerId === upEvent.pointerId) {
          dragDataRef.current = undefined;
          event.currentTarget.releasePointerCapture(upEvent.pointerId);
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
        }
      };
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    },
    [panelId, panelState.width, panelState.x, panelState.y, updatePanel]
  );

  const handleResizePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!resizable) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      sizeDataRef.current = {
        pointerId: event.pointerId,
        startWidth: panelState.width,
        startHeight: panelState.height,
        originX: event.clientX,
        originY: event.clientY,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
      const onPointerMove = (moveEvent: PointerEvent) => {
        if (!sizeDataRef.current || sizeDataRef.current.pointerId !== moveEvent.pointerId) {
          return;
        }
        const deltaX = moveEvent.clientX - sizeDataRef.current.originX;
        const deltaY = moveEvent.clientY - sizeDataRef.current.originY;
        updatePanel(panelId, {
          width: Math.max(240, sizeDataRef.current.startWidth + deltaX),
          height: Math.max(240, sizeDataRef.current.startHeight + deltaY),
        });
      };
      const onPointerUp = (upEvent: PointerEvent) => {
        if (sizeDataRef.current?.pointerId === upEvent.pointerId) {
          sizeDataRef.current = undefined;
          event.currentTarget.releasePointerCapture(upEvent.pointerId);
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
        }
      };
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    },
    [panelId, panelState.height, panelState.width, resizable, updatePanel]
  );

  const style = useMemo<React.CSSProperties>(
    () => ({
      transform: `translate(${panelState.x}px, ${panelState.y}px)`,
      width: panelState.width,
      height: panelState.height,
    }),
    [panelState.height, panelState.width, panelState.x, panelState.y]
  );

  if (!panelState.visible) {
    return null;
  }

  return (
    <section className="floating-panel" style={style} aria-label={panelState.title}>
      <div
        className="floating-panel__header"
        role="toolbar"
        onPointerDown={handleHeaderPointerDown}
      >
        <h2>{panelState.title}</h2>
        {headerContent}
      </div>
      <div className="floating-panel__body">{children}</div>
      {footer ? <div className="floating-panel__footer">{footer}</div> : null}
      {resizable ? (
        <div
          className="floating-panel__resize-handle"
          onPointerDown={handleResizePointerDown}
          aria-label="Resize panel"
        />
      ) : null}
    </section>
  );
};

export default FloatingPanel;
