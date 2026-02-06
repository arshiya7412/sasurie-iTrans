import React, { useState } from 'react';
import { UserRole } from './types';
import { Layout } from './components/Layout';
import { StudentFlow } from './components/StudentFlow';
import { AdminFlow } from './components/AdminFlow';
import { Bus, GraduationCap, ShieldCheck, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.NONE);
  const [viewState, setViewState] = useState<'WELCOME' | 'IDENTIFY' | 'LOGIN_FORM'>('WELCOME');
  const [selectedRoleForLogin, setSelectedRoleForLogin] = useState<UserRole | null>(null);
  const [studentIdInput, setStudentIdInput] = useState('732423243010'); // Default demo ID

  // --- 0. LOGGED IN STATE (PRIORITY CHECK) ---
  if (role === UserRole.STUDENT) {
    return (
      <StudentFlow 
        studentId={studentIdInput} 
        onLogout={() => { setRole(UserRole.NONE); setViewState('WELCOME'); }} 
      />
    );
  }

  if (role === UserRole.ADMIN) {
    return (
      <AdminFlow 
        onLogout={() => { setRole(UserRole.NONE); setViewState('WELCOME'); }} 
      />
    );
  }

  // --- 1. WELCOME SCREEN (MATCHING IMAGE) ---
  if (viewState === 'WELCOME') {
    return (
      <Layout variant="welcome">
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10 w-full h-full pb-20">
          
          {/* 1. Title Section */}
          <h1 className="text-5xl font-black italic tracking-wide mb-2 drop-shadow-md text-white">
            Sasurie <span className="text-[#FFC107]">iTrans</span>
          </h1>
          <p className="text-[10px] font-bold tracking-[0.4em] text-[#FFC107] uppercase mb-16 opacity-90">
            Campus Hub Mobility
          </p>

          {/* 2. Bus Illustration (CSS Art) */}
          <div className="relative w-48 h-28 mb-10 mx-auto animate-float">
             {/* Body */}
             <div className="absolute inset-0 bg-[#FFC107] rounded-3xl z-10 shadow-lg border-b-4 border-[#F57F17]">
                {/* Window */}
                <div className="absolute top-4 left-4 right-4 h-10 bg-[#2E1A47] rounded-xl flex items-center justify-center px-1 overflow-hidden">
                   <div className="w-full h-[1px] bg-white/10"></div>
                </div>
                {/* Stripe */}
                <div className="absolute bottom-4 left-0 right-0 h-5 bg-[#2E1A47]"></div>
             </div>
             {/* Wheels */}
             <div className="absolute -bottom-3 left-8 w-8 h-8 bg-[#1a1a1a] rounded-full z-10 border-2 border-gray-600 shadow-sm">
                <div className="w-2.5 h-2.5 bg-gray-400 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
             </div>
             <div className="absolute -bottom-3 right-8 w-8 h-8 bg-[#1a1a1a] rounded-full z-10 border-2 border-gray-600 shadow-sm">
                 <div className="w-2.5 h-2.5 bg-gray-400 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
             </div>
          </div>

          {/* 3. Feature Icons */}
          <div className="flex justify-center gap-10 mb-12 w-full px-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm shadow-inner">
                <ShieldCheck size={16} className="text-[#FFC107] opacity-90" />
              </div>
              <span className="text-[8px] font-bold tracking-[0.2em] uppercase opacity-70">Securid</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm shadow-inner">
                <Clock size={16} className="text-[#FFC107] opacity-90" />
              </div>
              <span className="text-[8px] font-bold tracking-[0.2em] uppercase opacity-70">Precise</span>
            </div>
            <div className="flex flex-col items-center gap-2">
               <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm shadow-inner">
                 <Bus size={16} className="text-[#FFC107] opacity-90" />
               </div>
               <span className="text-[8px] font-bold tracking-[0.2em] uppercase opacity-70">Comfort</span>
            </div>
          </div>

          {/* 4. Initialize Button */}
          <button 
            onClick={() => setViewState('IDENTIFY')}
            className="w-full max-w-[280px] bg-[#FFC107] text-[#2E1A47] font-extrabold text-xs py-5 rounded-full shadow-xl tracking-[0.2em] flex items-center justify-center hover:bg-[#ffca28] hover:scale-105 transition-all"
          >
            INITIALIZE PORTAL &nbsp; ›
          </button>

        </div>
      </Layout>
    );
  }

  // --- 2. IDENTIFY PORTAL (LOGIN SELECTION) ---
  if (viewState === 'IDENTIFY') {
    return (
      <Layout variant="welcome">
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          <button onClick={() => setViewState('WELCOME')} className="absolute top-10 left-6 text-xs font-bold border border-[#FFC107] text-[#FFC107] px-3 py-1 rounded hover:bg-[#FFC107] hover:text-[#2E1A47] transition-colors">
            ← BACK
          </button>

          <div className="mb-10 text-center">
            <div className="text-[#FFC107] text-4xl mb-2">⚯</div>
            <h2 className="text-2xl font-bold text-white">Sasurie <span className="text-[#FFC107]">iTrans</span></h2>
            <p className="text-[10px] tracking-widest opacity-50 uppercase">Digital Gateway</p>
          </div>

          <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
            <h3 className="text-center font-bold uppercase tracking-widest text-sm mb-6 pb-2 border-b-2 border-[#FFC107] w-fit mx-auto">Identify Portal</h3>
            
            <div className="space-y-4">
              <button 
                onClick={() => { setSelectedRoleForLogin(UserRole.STUDENT); setViewState('LOGIN_FORM'); }}
                className="w-full py-6 rounded-2xl bg-[#4A148C]/50 border border-white/10 hover:bg-[#5B2D8B] hover:border-[#FFC107] transition-all group"
              >
                <GraduationCap className="mx-auto mb-2 text-[#FFC107] group-hover:scale-110 transition-transform" size={28} />
                <span className="text-xs font-bold tracking-widest uppercase">Student Entry</span>
              </button>

              <button 
                onClick={() => { setSelectedRoleForLogin(UserRole.ADMIN); setViewState('LOGIN_FORM'); }}
                className="w-full py-6 rounded-2xl bg-[#4A148C]/50 border border-white/10 hover:bg-[#5B2D8B] hover:border-[#FFC107] transition-all group"
              >
                <ShieldCheck className="mx-auto mb-2 text-[#FFC107] group-hover:scale-110 transition-transform" size={28} />
                <span className="text-xs font-bold tracking-widest uppercase">Admin Node</span>
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // --- 3. LOGIN FORM ---
  if (viewState === 'LOGIN_FORM' && selectedRoleForLogin) {
    const isStudent = selectedRoleForLogin === UserRole.STUDENT;

    return (
      <Layout variant="welcome">
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
           <button onClick={() => setViewState('IDENTIFY')} className="absolute top-10 left-6 text-xs font-bold border border-[#FFC107] text-[#FFC107] px-3 py-1 rounded hover:bg-[#FFC107] hover:text-[#2E1A47] transition-colors">
            ← BACK
          </button>

          <h2 className="text-xl font-bold uppercase tracking-widest mb-8">
            {isStudent ? 'Student Login' : 'Admin Login'}
          </h2>

          <div className="w-full max-w-sm space-y-5">
            {isStudent ? (
              <>
                <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/20">
                  <label className="text-[10px] uppercase text-[#FFC107] font-bold">Register Number</label>
                  <input 
                    type="text" 
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                    className="w-full bg-transparent text-white font-mono text-lg outline-none placeholder-white/30"
                    placeholder="7324..."
                  />
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/20">
                  <label className="text-[10px] uppercase text-[#FFC107] font-bold">Date of Birth</label>
                  <input 
                    type="text" 
                    className="w-full bg-transparent text-white font-mono text-lg outline-none placeholder-white/30"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
              </>
            ) : (
              <>
                 <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/20">
                  <label className="text-[10px] uppercase text-[#FFC107] font-bold">Admin ID</label>
                  <input 
                    type="text" 
                    defaultValue="ADMIN_01"
                    className="w-full bg-transparent text-white font-mono text-lg outline-none placeholder-white/30"
                  />
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/20">
                  <label className="text-[10px] uppercase text-[#FFC107] font-bold">Password</label>
                  <input 
                    type="password" 
                    defaultValue="password"
                    className="w-full bg-transparent text-white font-mono text-lg outline-none placeholder-white/30"
                  />
                </div>
              </>
            )}

            <button 
              onClick={() => setRole(selectedRoleForLogin)}
              className="w-full bg-[#FFC107] text-[#2E1A47] font-bold py-4 rounded-xl shadow-lg mt-4 hover:bg-white transition-colors"
            >
              SECURE LOGIN
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return <div>Error</div>;
};

export default App;