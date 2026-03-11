import { extractIpcError } from '../../../utils/util';
import { usePatternsContext } from '../contexts/PatternsContext';
import { savePattern } from '../facade/pattern-facade';
import { Pattern } from '../models/pattern-model';

const usePatterns = () => {
  const { patterns, setPatterns, saveError, setSaveError } =
    usePatternsContext();

  const addPattern = async (
    pattern: Omit<Pattern, 'id' | 'slug'>,
  ): Promise<boolean> => {
    try {
      const saved = await savePattern(pattern);
      setPatterns((prev) => [...prev, saved]);
      setSaveError(null);
      return true;
    } catch (error: any) {
      setSaveError(extractIpcError(error));
      return false;
    }
  };

  const resetSaveError = (): void => setSaveError(null);

  return { patterns, addPattern, saveError, resetSaveError };
};

export default usePatterns;
