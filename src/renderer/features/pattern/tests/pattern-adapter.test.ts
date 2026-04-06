import { PatternDTO } from '../../../../shared/models/pattern-dto';
import { adaptPattern, adaptPatterns } from '../adapters/pattern-adapter';
import { Pattern } from '../models/pattern-model';

describe('adaptPattern', () => {
  it('should adapt a single pattern correctly', () => {
    // Given
    const tested: PatternDTO = {
      id: 1,
      slug: 'drum-and-bass',
      name: 'drum and bass',
      sentences: '["P Ts K P Ts K P"]',
      highlights: '[[null, null, null, null, null, null, null]]',
    };
    // When
    const result: Pattern = adaptPattern(tested);
    // Then
    const expected: Pattern = {
      id: 1,
      slug: 'drum-and-bass',
      name: 'drum and bass',
      sentences: ['P Ts K P Ts K P'],
      highlights: [[null, null, null, null, null, null, null]],
    };
    expect(result).toEqual(expected);
  });
});

describe('adaptPatterns', () => {
  it('should adapt patterns correctly', () => {
    // Given
    const pattern1: PatternDTO = {
      id: 1,
      slug: 'drum-and-bass',
      name: 'drum and bass',
      sentences: '["P Ts K P Ts K P"]',
      highlights: '[[null, null, null, null, null, null, null]]',
    };
    const pattern2: PatternDTO = {
      id: 2,
      slug: 'dubstep',
      name: 'dubstep',
      sentences: '["P (Ts P) Ts P K (Ts P) Ts P K Ts"]',
      highlights:
        '[[null, null, null, null, null, null, null, null, null, null]]',
    };
    const tested: PatternDTO[] = [pattern1, pattern2];
    // When
    const result: Pattern[] = adaptPatterns(tested);
    // Then
    const pattern1Expected: Pattern = {
      id: 1,
      slug: 'drum-and-bass',
      name: 'drum and bass',
      sentences: ['P Ts K P Ts K P'],
      highlights: [[null, null, null, null, null, null, null]],
    };
    const pattern2Expected: Pattern = {
      id: 2,
      slug: 'dubstep',
      name: 'dubstep',
      sentences: ['P (Ts P) Ts P K (Ts P) Ts P K Ts'],
      highlights: [
        [null, null, null, null, null, null, null, null, null, null],
      ],
    };
    const expected: Pattern[] = [pattern1Expected, pattern2Expected];
    expect(result).toEqual(expected);
  });
});
