import { usePatternsContext } from '../contexts/PatternsContext';
import {
  savePattern,
  updatePattern,
  deletePattern,
} from '../facade/pattern-facade';
import { PatternFormValues } from '../types/pattern-types';

const usePatterns = () => {
  const { patterns, setPatterns, error } = usePatternsContext();

  const addPattern = async (pattern: PatternFormValues): Promise<void> => {
    const saved = await savePattern(pattern);
    setPatterns((prev) => [...prev, saved]);
  };

  const editPattern = async (
    id: number,
    pattern: Partial<PatternFormValues>,
  ): Promise<void> => {
    const updated = await updatePattern(id, pattern);
    setPatterns((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const removePattern = async (id: number): Promise<void> => {
    await deletePattern(id);
    setPatterns((prev) => prev.filter((p) => p.id !== id));
  };

  return { patterns, addPattern, editPattern, removePattern, error };
};

export default usePatterns;
