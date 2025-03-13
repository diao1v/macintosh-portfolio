import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Desktop from './components/Desktop/Desktop';
import StartupScreen from './components/StartupScreen/StartupScreen';


const queryClient = new QueryClient();

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className='h-screen w-screen bg-[#8e8e8e] overflow-hidden'>
        {isLoading ? (
          <StartupScreen
            onLoadComplete={handleLoadComplete}
          />
        ) : (
          <Desktop />
        )}
      </div>
    </QueryClientProvider>
  );
};

export default App;
