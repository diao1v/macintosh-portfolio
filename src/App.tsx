import React from 'react';
import MenuBar from './components/MenuBar/MenuBar';
import Desktop from './components/Desktop/Desktop';
import useWindowStore from './store/useWindowStore';

const App: React.FC = () => {
  const { openWindow, focusWindow } = useWindowStore();

  const handleOpenAbout = () => {
    openWindow('about');
    focusWindow('about');
  };

  return (
    <div className='h-screen w-screen bg-[#666666] overflow-hidden'>
      <MenuBar onOpenAbout={handleOpenAbout} />
      <Desktop />
    </div>
  );
};

export default App;
