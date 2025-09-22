import { useMemo } from 'react';

import { useModelContext } from '../../context/ModelProvider';

interface ModelSelectorProps {
  label?: string;
  onChange?: (modelId: string) => void;
}

const ModelSelector = ({ label = 'Model', onChange }: ModelSelectorProps): JSX.Element => {
  const { models, activeModelId, setActiveModelId, loading, error } = useModelContext();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextId = event.target.value;
    setActiveModelId(nextId);
    onChange?.(nextId);
  };

  const status = useMemo(() => {
    if (loading) {
      return 'Loading OpenRouter models…';
    }
    if (error) {
      return `Using fallback catalog (${error})`;
    }
    return `${models.length} models available`;
  }, [error, loading, models.length]);

  return (
    <div className="model-selector">
      <label htmlFor="model-selector-input">{label}</label>
      <select
        id="model-selector-input"
        name="model-selector"
        value={activeModelId}
        onChange={handleChange}
        aria-describedby="model-selector-status"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      <p id="model-selector-status" className="model-selector__status" role="status">
        {status}
      </p>
    </div>
  );
};

export default ModelSelector;
