import React, { useEffect } from 'react';
import { runInstrumentTour, markTourSeen } from '../data/instrument-steps';

type OnboardingDriverProps = {
  children: React.ReactNode;
  tourKey: string;
};

export default function OnboardingDriver({
  children,
  tourKey,
}: OnboardingDriverProps) {
  useEffect(() => {
    const key = `${tourKey}_tour_seen`;
    const seen = localStorage.getItem(key);

    if (!seen) {
      const timer = setTimeout(() => {
        runInstrumentTour();
        markTourSeen();
      }, 500);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [tourKey]);

  return children;
}

export { runInstrumentTour, markTourSeen };
