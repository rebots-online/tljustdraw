import { ReactNode } from 'react';

export interface AppLayoutProps {
  librarySlot: ReactNode;
  canvasSlot: ReactNode;
  agentSlot: ReactNode;
}

const AppLayout = ({ librarySlot, canvasSlot, agentSlot }: AppLayoutProps): JSX.Element => (
  <div className="app-shell">
    <aside className="panel library-panel" aria-label="Library manager">
      {librarySlot}
    </aside>
    <section className="canvas-panel" aria-label="Canvas workspace">
      {canvasSlot}
    </section>
    <aside className="panel agent-panel" aria-label="Agent console">
      {agentSlot}
    </aside>
  </div>
);

export default AppLayout;
