import React, { useEffect } from 'react';
import { runInstrumentTour } from '../data/instrument-steps';
import { runLibraryTour } from '../data/library-steps';
import { runStudioTour } from '../data/studio-steps';
import { waitForElement } from '../utils/createTour';
import 'driver.js/dist/driver.css';

type OnboardingDriverProps = {
  children: React.ReactNode;
  tourKey: string;
  tourPageSelector: string;
};

const tourFunctions: Record<string, (onDestroy?: () => void) => void> = {
  instruments: runInstrumentTour,
  library: runLibraryTour,
  studio: runStudioTour,
};

export default function OnboardingDriver({
  children,
  tourKey,
  tourPageSelector,
}: OnboardingDriverProps) {
  useEffect(() => {
    const key = `${tourKey}_tour_seen`;
    const seen = localStorage.getItem(key);
    const tourFn = tourFunctions[tourKey];

    if (!seen && tourFn) {
      let cancelled = false;

      const startTour = async (): Promise<void> => {
        await waitForElement(tourPageSelector);
        if (cancelled) return;
        tourFn();
        localStorage.setItem(key, 'true');
      };

      startTour();

      return () => {
        cancelled = true;
      };
    }

    return undefined;
  }, [tourKey, tourPageSelector]);

  return children;
}

export { runInstrumentTour, runLibraryTour, runStudioTour };
