import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface DemoTourContextValue {
  tourActive: boolean;
  startTour: () => void;
  stopTour: () => void;
}

const DemoTourContext = createContext<DemoTourContextValue>({
  tourActive: false,
  startTour: () => {},
  stopTour: () => {},
});

export const DemoTourProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tourActive, setTourActive] = useState(false);

  const startTour = useCallback(() => setTourActive(true), []);
  const stopTour = useCallback(() => setTourActive(false), []);

  const value = useMemo(
    () => ({ tourActive, startTour, stopTour }),
    [tourActive, startTour, stopTour],
  );

  return (
    <DemoTourContext.Provider value={value}>{children}</DemoTourContext.Provider>
  );
};

export function useDemoTour(): DemoTourContextValue {
  return useContext(DemoTourContext);
}
