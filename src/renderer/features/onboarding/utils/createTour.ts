import { driver, Driver, DriveStep } from 'driver.js';

export type TourStep = DriveStep;

export type TourOptions = {
  onNextClick?: (driverInstance: Driver) => void;
  onPrevClick?: (driverInstance: Driver) => void;
};

export function createTour(
  steps: TourStep[],
  options?: TourOptions,
): (onDestroy?: () => void) => void {
  let driverInstance: Driver | null = null;

  return (onDestroy?: () => void) => {
    if (driverInstance) {
      driverInstance.destroy();
    }

    driverInstance = driver({
      animate: true,
      showProgress: true,
      steps,
      onNextClick: options?.onNextClick
        ? () => {
            options.onNextClick!(driverInstance!);
          }
        : undefined,
      onPrevClick: options?.onPrevClick
        ? () => {
            options.onPrevClick!(driverInstance!);
          }
        : undefined,
      onDestroyed: () => {
        onDestroy?.();
      },
    });

    driverInstance.drive();
  };
}

export function waitForElement(selector: string): Promise<void> {
  return new Promise<void>((resolve) => {
    if (document.querySelector(selector)) {
      resolve();
      return;
    }
    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}
