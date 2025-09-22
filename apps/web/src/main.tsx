import { createRoot } from 'react-dom/client';

import App from './App';
import './app.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element');
}

createRoot(rootElement).render(<App />);
