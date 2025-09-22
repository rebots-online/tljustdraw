import FloatingPanel from './FloatingPanel';

interface FloatingPanelLayerProps {
  panels: Array<{
    id: 'library' | 'agents' | 'models';
    content: React.ReactNode;
    footer?: React.ReactNode;
    headerContent?: React.ReactNode;
    resizable?: boolean;
  }>;
}

const FloatingPanelLayer = ({ panels }: FloatingPanelLayerProps): JSX.Element => (
  <div className="floating-panel-layer" role="region" aria-label="Workspace tool panels">
    {panels.map((panel) => (
      <FloatingPanel
        key={panel.id}
        panelId={panel.id}
        footer={panel.footer}
        headerContent={panel.headerContent}
        resizable={panel.resizable}
      >
        {panel.content}
      </FloatingPanel>
    ))}
  </div>
);

export default FloatingPanelLayer;
