import React, { createContext, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

interface DemoRecordingContextValue {
  isRecordingMode: boolean;
  hidePreviewChips: boolean;
}

const DemoRecordingContext = createContext<DemoRecordingContextValue>({
  isRecordingMode: false,
  hidePreviewChips: false,
});

export const DemoRecordingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchParams] = useSearchParams();
  const isRecordingMode = searchParams.get('recording') === '1';

  const value = useMemo(
    () => ({
      isRecordingMode,
      hidePreviewChips: isRecordingMode,
    }),
    [isRecordingMode],
  );

  return (
    <DemoRecordingContext.Provider value={value}>
      {children}
    </DemoRecordingContext.Provider>
  );
};

export function useDemoRecording(): DemoRecordingContextValue {
  return useContext(DemoRecordingContext);
}
