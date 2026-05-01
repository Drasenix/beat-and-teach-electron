import { createContext, useContext, ReactNode } from 'react';
import useGuideModal from '../hooks/useGuideModal';

const GuideModalContext = createContext<ReturnType<
  typeof useGuideModal
> | null>(null);

export default function GuideModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const modal = useGuideModal();
  return (
    <GuideModalContext.Provider value={modal}>
      {children}
    </GuideModalContext.Provider>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export function useGuideModalContext() {
  const ctx = useContext(GuideModalContext);
  if (!ctx)
    throw new Error(
      'useGuideModalContext must be used within GuideModalProvider',
    );
  return ctx;
}
