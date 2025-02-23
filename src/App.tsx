import React, { useState } from 'react'
import MenuBar from './components/MenuBar/MenuBar'
import Window from './components/Window/Window'
import './App.css'

interface WindowState {
  id: string
  title: string
  isOpen: boolean
  position: {
    x: number
    y: number
  }
}

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: 'about',
      title: 'About This Portfolio',
      isOpen: true,
      position: { x: 40, y: 40 }
    }
  ])
  const [focusedWindowId, setFocusedWindowId] = useState<string>('about')

  const handleCloseWindow = (id: string): void => {
    setWindows(windows.map(win => 
      win.id === id ? { ...win, isOpen: false } : win
    ))
    if (focusedWindowId === id) {
      setFocusedWindowId('')
    }
  }

  const handleWindowFocus = (id: string): void => {
    setFocusedWindowId(id)
  }

  return (
    <div className="h-screen w-screen bg-[#666666] overflow-hidden">
      <MenuBar />
      
      {/* Desktop Area */}
      <div className="pt-5 px-2">
        {windows.map(window => window.isOpen && (
          <Window 
            key={window.id}
            title={window.title}
            position={window.position}
            onClose={() => handleCloseWindow(window.id)}
            isFocused={focusedWindowId === window.id}
            onFocus={() => handleWindowFocus(window.id)}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <img 
                  src="/icons/computer.png" 
                  alt="Computer Icon" 
                  className="w-16 h-16"
                />
                <div>
                  <h2 className="text-[13px] font-bold">Your Name's Portfolio</h2>
                  <p className="text-[11px]">System Software 7.5.3</p>
                </div>
              </div>
              <div className="border-t border-b border-black py-2">
                <p className="text-[11px]">Memory Built-in: 8,192K</p>
                <p className="text-[11px]">Total Memory: 8,192K</p>
              </div>
              <p className="text-[11px]">© Your Name 2024</p>
            </div>
          </Window>
        ))}
      </div>
    </div>
  )
}

export default App
