import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import Desktop from './components/Desktop/Desktop';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='h-screen w-screen bg-[#666666] overflow-hidden'>
        <Desktop />
      </div>
    </QueryClientProvider>
  );
};

export default App;
