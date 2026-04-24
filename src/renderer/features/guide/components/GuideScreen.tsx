import GuideSection from './GuideSection';
import { guideContent } from '../data/guide-content';

export default function GuideScreen() {
  return (
    <div className="content-page">
      <div className="daw-layout">
        <div className="daw-main">
          <div className="flex flex-col gap-6">
            {guideContent.map((section) => (
              <GuideSection key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
