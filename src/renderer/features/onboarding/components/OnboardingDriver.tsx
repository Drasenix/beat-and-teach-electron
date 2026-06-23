import React, { useEffect } from 'react';
import { runInstrumentTour } from '../data/instrument-steps';
import { runPatternTour } from '../data/pattern-steps';
import { runLibraryTour } from '../data/library-steps';
import { runStudioTour } from '../data/studio-steps';
import 'driver.js/dist/driver.css';

type OnboardingDriverProps = {
  children: React.ReactNode;
  tourKey: string;
};

const tourFunctions: Record<string, (onDestroy?: () => void) => void> = {
  instruments: runInstrumentTour,
  patterns: runPatternTour,
  library: runLibraryTour,
  studio: runStudioTour,
};

export default function OnboardingDriver({
  children,
  tourKey,
}: OnboardingDriverProps) {
  useEffect(() => {
    const key = `${tourKey}_tour_seen`;
    const seen = localStorage.getItem(key);

    const tourFn = tourFunctions[tourKey];

    if (!seen && tourFn) {
      const timer = setTimeout(() => {
        tourFn();
        localStorage.setItem(key, 'true');
      }, 500);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [tourKey]);

  return children;
}

export { runInstrumentTour, runPatternTour, runLibraryTour, runStudioTour };
