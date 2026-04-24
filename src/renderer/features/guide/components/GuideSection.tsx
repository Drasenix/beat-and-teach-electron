import { Link } from 'react-router-dom';
import { GuideSection as GuideSectionType } from '../data/guide-content';

type GuideSectionProps = {
  section: GuideSectionType;
};

export default function GuideSection({ section }: GuideSectionProps) {
  return (
    <div className="workspace-section">
      <div className="section-header">
        <h2 id={section.id} className="section-title">
          {section.title}
        </h2>
      </div>
      <div className="workspace-section-content space-y-4">
        <p className="text-text-secondary">{section.content}</p>

        {section.codeBlocks && section.codeBlocks.length > 0 && (
          <div className="space-y-3">
            {section.codeBlocks.map((block) => (
              <div key={block.code} className="flex flex-col gap-1">
                <code className="text-primary font-mono bg-field px-4 py-3 rounded-lg">
                  {block.code}
                </code>
                <span className="text-xs text-text-secondary ml-2">
                  {block.description}
                </span>
              </div>
            ))}
          </div>
        )}

        {section.examples && section.examples.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <span className="text-xs text-text-secondary mr-2">Essayer :</span>
            {section.examples.map((example) => (
              <Link
                key={example.pattern}
                to={`/workspace?example=${encodeURIComponent(example.pattern)}`}
                className="btn-secondary"
              >
                {example.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
