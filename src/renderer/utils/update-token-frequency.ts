import frequencyToNoteName from './frequency-to-note';

function applyFrequency(token: string, frequency: number | null): string {
  const stripped = token.replace(/@[^\s)]+/g, '');
  if (frequency === null) return stripped;
  const noteName = frequencyToNoteName(frequency);
  return `${stripped}@${noteName}`;
}

export default function updateTokenFrequency(
  sentence: string,
  flatTokenIndex: number,
  frequency: number | null,
): string {
  if (!sentence.trim()) return sentence;

  const regex = /\(([^)]*)\)|(\S+)/g;
  const parts: { start: number; end: number; replacement: string }[] = [];
  let flatIdx = 0;
  let execResult = regex.exec(sentence);

  while (execResult !== null) {
    if (execResult[1] !== undefined) {
      const groupTokens = execResult[1].trim().split(/\s+/);
      const localStart = flatIdx;
      const localEnd = flatIdx + groupTokens.length;

      if (flatTokenIndex >= localStart && flatTokenIndex < localEnd) {
        const innerIdx = flatTokenIndex - localStart;
        const newInner = groupTokens.map((t, i) =>
          i === innerIdx ? applyFrequency(t, frequency) : t,
        );
        parts.push({
          start: execResult.index,
          end: execResult.index + execResult[0].length,
          replacement: `(${newInner.join(' ')})`,
        });
      }
      flatIdx = localEnd;
    } else {
      if (flatIdx === flatTokenIndex) {
        parts.push({
          start: execResult.index,
          end: execResult.index + execResult[0].length,
          replacement: applyFrequency(execResult[0], frequency),
        });
      }
      flatIdx += 1;
    }
    execResult = regex.exec(sentence);
  }

  if (parts.length === 0) return sentence;

  let result = '';
  let lastEnd = 0;
  parts.forEach((p) => {
    result += sentence.substring(lastEnd, p.start) + p.replacement;
    lastEnd = p.end;
  });
  result += sentence.substring(lastEnd);
  return result;
}
