import { useEffect, useState } from 'react';
import getPatterns from '../facade/pattern-facade';
import { Pattern } from '../models/pattern-model';

const usePatterns = () => {
  const [patterns, setPatterns] = useState<Pattern[]>([]);

  useEffect(() => {
    const fetchPattern = async () => {
      const allPatterns: Pattern[] = await getPatterns();
      setPatterns(allPatterns);
    };

    fetchPattern();
  }, []);

  return { patterns };
};

export default usePatterns;
