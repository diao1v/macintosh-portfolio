import React from 'react';
import Desktop from './components/Desktop/Desktop';

const App: React.FC = () => {
  return (
    <div className='h-screen w-screen bg-[#666666] overflow-hidden'>
      <Desktop />
    </div>
  );
};

export default App;
