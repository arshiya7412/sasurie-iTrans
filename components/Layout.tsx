import React from 'react';
import { ChevronLeft, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  variant?: 'welcome' | 'admin' | 'student';
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  variant = 'student',
  title,
  showBack,
  onBack,
  actions
}) => {
  // Welcome / Login Screen - MATCHED GRADIENT
  if (variant === 'welcome') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-[#450d88] via-[#6824a3] to-[#ffc526] flex flex-col relative overflow-hidden text-white font-sans">
        <div className="flex-1 flex flex-col relative z-10 w-full max-w-md mx-auto bg-transparent">
          {children}
        </div>
      </div>
    );
  }

  // Admin Interface Style
  if (variant === 'admin') {
    return (
      <div className="min-h-screen w-full bg-[#F3F4F6] flex flex-col max-w-md mx-auto shadow-xl border-x border-gray-200">
        <header className="bg-[#2E1A47] text-white px-5 py-4 shadow-md z-20 sticky top-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <button onClick={onBack} className="p-1 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                <ChevronLeft size={24} />
              </button>
            )}
            <h1 className="text-lg font-semibold tracking-wide">{title}</h1>
          </div>
          {actions}
        </header>
        
        <main className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-hide">
          {children}
        </main>
      </div>
    );
  }

  // Student Interface Style - YELLOW THEME RESTORED (Clean & Professional)
  return (
    <div className="min-h-screen w-full bg-[#F3F4F6] flex flex-col max-w-md mx-auto shadow-2xl relative border-x border-gray-200 font-sans">
       {/* Signature Yellow Header */}
       <header className="bg-[#FFC107] text-[#2E1A47] px-6 h-20 shadow-sm z-30 sticky top-0 flex items-center justify-between rounded-b-[0px]">
          <div className="flex items-center gap-3 flex-1 overflow-hidden pt-2">
            {showBack && (
              <button onClick={onBack} className="p-2 -ml-2 hover:bg-black/5 rounded-full transition-colors text-[#2E1A47]">
                <ChevronLeft size={24} strokeWidth={2.5} />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold tracking-tight">{title}</h1>
              {!showBack && <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">Student Portal</p>}
            </div>
          </div>
          <div className="flex-shrink-0 ml-2 pt-2">
            {actions}
          </div>
       </header>

       <main className="flex-1 overflow-y-auto p-5 scrollbar-hide bg-[#F3F4F6]">
        {children}
      </main>
    </div>
  );
};