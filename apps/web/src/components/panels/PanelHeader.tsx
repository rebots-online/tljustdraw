import { ReactNode } from 'react';

interface PanelHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

const PanelHeader = ({ title, subtitle, action }: PanelHeaderProps): JSX.Element => (
  <header className="panel-header">
    <div className="panel-header__titles">
      <h2>{title}</h2>
      {subtitle ? <p className="panel-header__subtitle">{subtitle}</p> : null}
    </div>
    {action ? <div className="panel-header__action">{action}</div> : null}
  </header>
);

export default PanelHeader;
