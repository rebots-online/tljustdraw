import { createContext, useContext, useMemo } from 'react';

import { useModelCatalog } from '../hooks/useModelCatalog';
import { OpenRouterModel } from '../state/models';

interface ModelContextValue {
  models: OpenRouterModel[];
  activeModelId: string;
  setActiveModelId: (modelId: string) => void;
  loading: boolean;
  error?: string;
}

const ModelContext = createContext<ModelContextValue | undefined>(undefined);

export const ModelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const catalog = useModelCatalog();
  const value = useMemo<ModelContextValue>(
    () => ({
      models: catalog.models,
      activeModelId: catalog.activeModelId,
      setActiveModelId: catalog.setActiveModelId,
      loading: catalog.loading,
      error: catalog.error,
    }),
    [
      catalog.models,
      catalog.activeModelId,
      catalog.setActiveModelId,
      catalog.loading,
      catalog.error,
    ]
  );

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
};

export const useModelContext = (): ModelContextValue => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModelContext must be used within a ModelProvider');
  }
  return context;
};
