import { FilePath } from '../../../../shared/types/file';
import { InstrumentName } from '../../../../shared/types/instrument';

export interface Instrument {
  id: number;
  slug: string;
  symbol: string;
  filepath: FilePath;
  name: InstrumentName;
}
