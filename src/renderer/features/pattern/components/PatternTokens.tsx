import { PatternToken } from '../types/pattern-token';

type PatternTokensProps = {
  tokens: PatternToken[];
};

function TokenBadge({ token }: { token: PatternToken }) {
  const baseClass = 'font-mono font-bold px-2 py-1 rounded text-sm';
  const validClass = 'text-primary bg-background border border-border';
  const invalidClass = 'text-red-400 bg-background border border-red-400';

  return (
    <span className={`${baseClass} ${token.valid ? validClass : invalidClass}`}>
      {token.symbol}
    </span>
  );
}

export default function PatternTokens({ tokens }: PatternTokensProps) {
  if (tokens.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mt-4 p-4 bg-surface rounded-lg border border-border">
      <p className="section-title mb-3">Aperçu</p>
      <div className="flex flex-wrap gap-2">
        {tokens.map((token) => {
          if (token.isGroup && token.tokens) {
            return (
              <div
                key={token.id}
                className="flex items-center gap-1 border border-dashed border-border rounded-lg px-2 py-1"
              >
                {token.tokens.map((innerToken) => (
                  <TokenBadge key={innerToken.id} token={innerToken} />
                ))}
              </div>
            );
          }
          return <TokenBadge key={token.id} token={token} />;
        })}
      </div>
    </div>
  );
}
