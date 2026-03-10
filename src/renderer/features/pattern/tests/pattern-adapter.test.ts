import { PatternDB } from '../../../../shared/models/pattern-db';
import { adaptPattern, adaptPatterns } from '../adapters/pattern-adapter';
import { Pattern } from '../models/pattern-model';

describe('adaptPattern', () => {
  it('should adapt a single pattern correctly', () => {
    // Given
    const tested: PatternDB = {
      id: 1,
      slug: 'drum-and-bass',
      name: 'drum and bass',
      sentence: 'P Ts K P Ts K P',
    };
    // When
    const result: Pattern = adaptPattern(tested);
    // Then
    const expected: Pattern = {
      id: 1,
      slug: 'drum-and-bass',
      name: 'drum and bass',
      sentence: 'P Ts K P Ts K P',
    };
    expect(result).toEqual(expected);
  });
});

describe('adaptPatterns', () => {
  it('should adapt patterns correctly', () => {
    // Given
    const pattern1: PatternDB = {
      id: 1,
      slug: 'drum-and-bass',
      name: 'drum and bass',
      sentence: 'P Ts K P Ts K P',
    };
    const pattern2: PatternDB = {
      id: 2,
      slug: 'dubstep',
      name: 'dubstep',
      sentence: 'P (Ts P) Ts P K (Ts P) Ts P K Ts',
    };
    const tested: PatternDB[] = [pattern1, pattern2];
    // When
    const result: Pattern[] = adaptPatterns(tested);
    // Then
    const pattern1Expected: Pattern = {
      id: 1,
      slug: 'drum-and-bass',
      name: 'drum and bass',
      sentence: 'P Ts K P Ts K P',
    };
    const pattern2Expected: Pattern = {
      id: 2,
      slug: 'dubstep',
      name: 'dubstep',
      sentence: 'P (Ts P) Ts P K (Ts P) Ts P K Ts',
    };
    const expected: Pattern[] = [pattern1Expected, pattern2Expected];
    expect(result).toEqual(expected);
  });
});
