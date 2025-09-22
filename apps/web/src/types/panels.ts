export type LibrarySourceType = 'builtin' | 'user';

export interface LibraryEntry {
  id: string;
  name: string;
  description: string;
  license: string;
  sourceType: LibrarySourceType;
  itemCount: number;
  enabled: boolean;
  attributionUrl?: string;
}

export type LibraryToggleHandler = (libraryId: string) => void;

export type AgentProvider = 'google' | 'openrouter' | 'ollama';

export interface AgentProfile {
  id: string;
  name: string;
  provider: AgentProvider;
  model: string;
  description: string;
  status: 'online' | 'offline' | 'beta';
  temperature: number;
}

export type AgentAuthor = 'user' | 'agent' | 'system';

export interface AgentMessage {
  id: string;
  agentId: string;
  author: AgentAuthor;
  content: string;
  timestamp: string;
}

export interface AgentSession {
  activeAgentId: string;
  transcript: AgentMessage[];
  composerValue: string;
  setComposerValue: (value: string) => void;
  sendUserMessage: () => void;
  sendCanvasAction: (description: string) => void;
}
