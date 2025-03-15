import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Desktop from './components/Desktop/Desktop';
import StartupScreen from './components/Desktop/StartupScreen';
import { DialogProvider } from '@/contexts/DialogContext';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Your existing loading logic
  }, []);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <DialogProvider>
        <div className="h-screen w-screen bg-[#8e8e8e] overflow-hidden">
          {isLoading ? (
            <StartupScreen onLoadComplete={handleLoadComplete} />
          ) : (
            <Desktop />
          )}
        </div>
      </DialogProvider>
    </QueryClientProvider>
  );
};

export default App;
