import { AgentProfile } from '../types/panels';

export const AGENT_PROFILES: AgentProfile[] = [
  {
    id: 'gemini-pro-vision',
    name: 'Gemini Pro Vision',
    provider: 'google',
    model: 'gemini-1.5-pro',
    description: 'Google Gemini agent tuned for diagram synthesis and clustering.',
    status: 'online',
    temperature: 0.4,
  },
  {
    id: 'openrouter-gpt4.1',
    name: 'OpenRouter GPT-4.1',
    provider: 'openrouter',
    model: 'openrouter/gpt-4.1-mini',
    description: 'OpenRouter curated GPT-4.1 Mini for fast structuring of notes.',
    status: 'online',
    temperature: 0.5,
  },
  {
    id: 'ollama-llama3.1',
    name: 'Ollama Llama 3.1',
    provider: 'ollama',
    model: 'llama3.1:8b',
    description: 'Local Llama 3.1 via Ollama for offline brainstorming support.',
    status: 'beta',
    temperature: 0.7,
  },
];

export const getAgentById = (id: string): AgentProfile | undefined =>
  AGENT_PROFILES.find((agent) => agent.id === id);
