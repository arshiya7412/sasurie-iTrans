import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './Layout';
import { GoogleGenAI } from "@google/genai";
import jsQR from 'jsqr';
import { STUDENTS_DB, BUS_FLEET, AI_SUGGESTIONS, MOCK_NOTIFICATIONS } from '../constants';
import { 
  Bus, MapPin, QrCode, MessageSquare, Bell, User, 
  AlertTriangle, CheckCircle, Navigation, Send, X, Camera, LogOut, ChevronRight, Clock, Calendar
} from 'lucide-react';

interface StudentFlowProps {
  studentId: string; // RegNo used to fetch details
  onLogout: () => void;
}

export const StudentFlow: React.FC<StudentFlowProps> = ({ studentId, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'TRACK' | 'SCAN' | 'CHAT' | 'PROFILE' | 'NOTIFS' | 'COMPLAINT'>('HOME');
  
  // Fetch actual student data
  const student = STUDENTS_DB.find(s => s.regNo === studentId) || STUDENTS_DB[0];
  
  // State for Bus Selection (Default to student's assigned bus)
  const [selectedRoute, setSelectedRoute] = useState(student.busRouteNo);
  
  // Get the currently selected bus details
  const selectedBus = BUS_FLEET.find(b => b.routeNo === selectedRoute) || BUS_FLEET[0];
  
  const [attendanceStatus, setAttendanceStatus] = useState<'PENDING' | 'PRESENT' | 'ABSENT'>('PENDING');

  // Load attendance state from local storage on mount
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(`attendance_${student.regNo}_${today}`);
    if (stored === 'PRESENT') {
      setAttendanceStatus('PRESENT');
    }
  }, [student.regNo]);

  // --- DASHBOARD ---
  const Dashboard = () => (
    <div className="space-y-5 animate-fadeIn pb-10">
      
      {/* 1. Mini Profile Card (Professional Look) */}
      <div 
        onClick={() => setActiveTab('PROFILE')}
        className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#2E1A47] flex items-center justify-between cursor-pointer active:bg-gray-50 transition-colors"
      >
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border border-gray-200">
               <User size={24} />
            </div>
            <div>
               <h2 className="text-lg font-bold text-[#2E1A47] leading-tight">{student.name}</h2>
               <p className="text-xs text-gray-500 font-medium">{student.regNo}</p>
            </div>
         </div>
         <ChevronRight size={20} className="text-gray-300" />
      </div>

      {/* 2. Bus Tracker Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-[#2E1A47] p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
             <Bus size={18} className="text-[#FFC107]" />
             <span className="font-bold text-sm tracking-wide">BUS STATUS</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${selectedBus.status === 'On Time' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
             {selectedBus.status}
          </span>
        </div>

        <div className="p-5">
           {/* Dropdown */}
           <div className="mb-4">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Select Route</label>
              <div className="relative">
                <select 
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#FFC107] focus:border-[#FFC107] block p-3 pr-8 font-semibold appearance-none"
                >
                  {BUS_FLEET.map(b => (
                    <option key={b.routeNo} value={b.routeNo}>
                      Route {b.routeNo} : {b.routeName}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-3.5 text-gray-400 rotate-90 pointer-events-none" size={16} />
              </div>
           </div>

           {/* Info Grid */}
           <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-gray-50 p-3 rounded-lg">
                 <p className="text-[10px] text-gray-400 font-bold uppercase">Driver</p>
                 <p className="text-sm font-bold text-gray-800">{selectedBus.driverName}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                 <p className="text-[10px] text-gray-400 font-bold uppercase">Delay</p>
                 <p className={`text-sm font-bold ${selectedBus.delayMin ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedBus.delayMin ? `+${selectedBus.delayMin} min` : 'None'}
                 </p>
              </div>
           </div>

           {/* Track Button */}
           <button 
             onClick={() => setActiveTab('TRACK')} 
             className="w-full bg-[#FFC107] text-[#2E1A47] py-3.5 rounded-lg font-bold shadow-md hover:bg-[#ffca28] transition-colors flex items-center justify-center gap-2"
           >
             <Navigation size={18} fill="currentColor" /> TRACK LIVE LOCATION
           </button>
        </div>
      </div>

      {/* 3. Quick Actions Grid */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Menu</h3>
        <div className="grid grid-cols-2 gap-3">
          <FeatureBtn 
            icon={<QrCode size={24} />} 
            label="Scan QR" 
            onClick={() => setActiveTab('SCAN')} 
            color="text-[#2E1A47]"
          />
          <FeatureBtn 
            icon={<User size={24} />} 
            label="Profile" 
            onClick={() => setActiveTab('PROFILE')} 
            color="text-[#2E1A47]"
          />
          <FeatureBtn 
            icon={<Bell size={24} />} 
            label="Alerts" 
            onClick={() => setActiveTab('NOTIFS')} 
            color="text-[#2E1A47]"
          />
          <FeatureBtn 
            icon={<MessageSquare size={24} />} 
            label="AI Chat" 
            onClick={() => setActiveTab('CHAT')} 
            color="text-[#2E1A47]"
          />
        </div>
      </div>
      
      {/* Attendance Status */}
      <div className={`p-4 rounded-xl flex items-center gap-3 ${attendanceStatus === 'PRESENT' ? 'bg-green-100 border border-green-200' : 'bg-gray-100 border border-gray-200'}`}>
          <div className={`p-2 rounded-full ${attendanceStatus === 'PRESENT' ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
            <CheckCircle size={20} />
          </div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Today's Attendance</p>
             <p className={`text-sm font-bold ${attendanceStatus === 'PRESENT' ? 'text-green-700' : 'text-gray-600'}`}>
               {attendanceStatus === 'PRESENT' ? 'Marked Present' : 'Not Scanned Yet'}
             </p>
          </div>
      </div>
    </div>
  );

  const FeatureBtn = ({ icon, label, onClick, color }: any) => (
    <button 
      onClick={onClick} 
      className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#FFC107] transition-all flex flex-col items-center justify-center gap-2 h-24"
    >
      <div className={`${color}`}>{icon}</div>
      <span className="font-bold text-gray-800 text-sm">{label}</span>
    </button>
  );

  // --- TRACKING SCREEN (With Blue Arrow) ---
  const TrackingScreen = () => {
    const handleOpenMap = () => {
      const { lat, lng } = selectedBus.currentLocation;
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(url, '_blank');
    };

    return (
      <div className="flex flex-col h-full relative">
         {/* Map Placeholder */}
         <div className="flex-1 bg-gray-200 rounded-2xl relative overflow-hidden border border-gray-300 shadow-inner group">
           <div className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500" style={{ backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/2275px-Google_Maps_Logo_2020.svg.png)', opacity: 0.6 }}></div>
           
           {/* The Big Blue Navigation Arrow Button */}
           <div className="absolute inset-0 flex items-center justify-center z-10">
              <button 
                onClick={handleOpenMap}
                className="w-20 h-20 bg-blue-600 rounded-full shadow-[0_0_0_8px_rgba(37,99,235,0.2)] flex items-center justify-center text-white animate-pulse-slow hover:scale-110 transition-transform"
              >
                <Navigation size={32} fill="white" className="ml-1" />
              </button>
           </div>
           
           <p className="absolute bottom-6 w-full text-center text-gray-600 font-bold text-sm bg-white/80 py-2 backdrop-blur-sm">
             Tap arrow to navigate
           </p>
         </div>
  
         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mt-4">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Route {selectedBus.routeNo}</h3>
                  <p className="text-sm text-gray-500 mb-2">{selectedBus.routeName}</p>
               </div>
               {/* Small Navigation Icon Button */}
               <button 
                   onClick={handleOpenMap}
                   className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors shadow-sm active:scale-95"
               >
                   <Navigation size={20} fill="currentColor" />
               </button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               Live updating enabled
            </div>
         </div>
      </div>
    );
  };

  // --- PROFILE SCREEN (With Logout) ---
  const ProfileScreen = () => (
    <div className="space-y-6 animate-fadeIn">
      {/* Profile Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center relative overflow-hidden">
         <div className="absolute top-0 w-full h-24 bg-[#2E1A47]"></div>
         <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#2E1A47] border-4 border-white shadow-md relative z-10 mb-3">
            <User size={40} />
         </div>
         <h2 className="text-2xl font-bold text-gray-900 relative z-10">{student.name}</h2>
         <p className="text-sm text-gray-500 font-medium relative z-10">{student.regNo}</p>
      </div>

      {/* Details List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
         <ProfileRow label="Date of Birth" value={student.dob} icon={<Calendar size={18} />} />
         <ProfileRow label="Bus Route" value={`Route ${student.busRouteNo}`} icon={<Bus size={18} />} />
         <ProfileRow label="Stopping Name" value={student.stoppingName} icon={<MapPin size={18} />} />
         <ProfileRow label="Status" value="Active Student" icon={<CheckCircle size={18} />} />
      </div>

      {/* Logout Button */}
      <button 
        onClick={onLogout} 
        className="w-full bg-red-50 text-red-600 py-4 rounded-xl font-bold shadow-sm border border-red-100 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors mt-4"
      >
        <LogOut size={20} /> LOGOUT
      </button>
    </div>
  );

  const ProfileRow = ({ label, value, icon }: any) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
       <div className="flex items-center gap-3">
          <div className="text-gray-400">{icon}</div>
          <span className="text-sm font-medium text-gray-600">{label}</span>
       </div>
       <span className="text-sm font-bold text-gray-900">{value}</span>
    </div>
  );

  // --- SCANNER ---
  const ScannerScreen = () => {
    const [scanState, setScanState] = useState<'IDLE' | 'SCANNING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationRef = useRef<number>(0);

    const startScan = async () => {
      setScanState('SCANNING');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true"); 
          await videoRef.current.play();
          requestAnimationFrame(tick);
        }
      } catch (err) {
        setScanState('ERROR');
      }
    };

    const stopScan = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

    const tick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const video = videoRef.current;
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
            if (code) {
              stopScan();
              validateCode(code.data);
              return; 
            }
          }
        }
      }
      animationRef.current = requestAnimationFrame(tick);
    };

    const validateCode = (code: string) => {
       if (code && code.startsWith('sasurie-bus')) {
         const today = new Date().toDateString();
         localStorage.setItem(`attendance_${student.regNo}_${today}`, 'PRESENT');
         setAttendanceStatus('PRESENT');
         setScanState('SUCCESS');
       } else {
         setScanState('ERROR');
       }
    };

    useEffect(() => { return () => stopScan(); }, []);

    return (
      <div className="h-full flex flex-col bg-black relative -m-5">
         {scanState !== 'SUCCESS' && scanState !== 'ERROR' && (
           <>
             <div className="absolute inset-0 bg-black flex items-center justify-center">
                <video ref={videoRef} className={`w-full h-full object-cover ${scanState === 'SCANNING' ? 'opacity-100' : 'opacity-50'}`} playsInline muted />
                <canvas ref={canvasRef} className="hidden" />
             </div>
             
             <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 pointer-events-none">
               <div className={`w-64 h-64 border-2 border-[#FFC107] rounded-2xl relative overflow-hidden transition-opacity ${scanState === 'SCANNING' ? 'opacity-100' : 'opacity-40'}`}>
                 {scanState === 'SCANNING' && (
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-[#FFC107] shadow-[0_0_15px_#FFC107] animate-[float_2s_linear_infinite]"></div>
                 )}
                 <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#FFC107]"></div>
                 <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#FFC107]"></div>
                 <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#FFC107]"></div>
                 <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#FFC107]"></div>
               </div>
               
               <div className="pointer-events-auto mt-12">
                 {scanState === 'IDLE' ? (
                    <button onClick={startScan} className="bg-[#FFC107] text-[#2E1A47] font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2">
                      <Camera size={20} /> TAP TO SCAN
                    </button>
                 ) : (
                    <button onClick={() => { stopScan(); setScanState('IDLE'); }} className="bg-white/20 text-white font-bold py-3 px-8 rounded-full backdrop-blur-md">
                      CANCEL
                    </button>
                 )}
               </div>
             </div>
           </>
         )}

         {scanState === 'SUCCESS' && (
           <div className="flex-1 bg-white flex flex-col items-center justify-center p-8 animate-fadeIn">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Marked Present</h2>
              <p className="text-gray-500 mt-2">Attendance recorded for today.</p>
              <button onClick={() => setActiveTab('HOME')} className="mt-8 bg-[#2E1A47] text-white px-8 py-3 rounded-lg font-bold shadow-md">
                DONE
              </button>
           </div>
         )}

         {scanState === 'ERROR' && (
           <div className="flex-1 bg-white flex flex-col items-center justify-center p-8 animate-fadeIn">
             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
                <X size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Scan Failed</h2>
              <div className="flex flex-col w-full gap-3 mt-8">
                <button onClick={() => setScanState('IDLE')} className="w-full bg-[#2E1A47] text-white py-3 rounded-lg font-bold">TRY AGAIN</button>
                 <button onClick={() => setActiveTab('HOME')} className="w-full text-gray-500 py-3">BACK</button>
              </div>
           </div>
         )}
      </div>
    );
  };

  // --- AI CHAT ---
  const ChatScreen = () => {
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
      { role: 'model', text: "Hello! I can help you with bus timings, routes, and attendance." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSend = async (text: string) => {
      const userText = text || input;
      if (!userText.trim()) return;
      setMessages(prev => [...prev, { role: 'user', text: userText }]);
      setInput('');
      setLoading(true);

      setTimeout(() => {
          let response = "I'm checking the live status...";
          if (userText.toLowerCase().includes('where')) response = `Bus ${selectedBus.routeNo} is currently near College Main Gate.`;
          else if (userText.toLowerCase().includes('late')) response = selectedBus.status === 'Delayed' ? `Yes, it is delayed by ${selectedBus.delayMin} mins.` : "No, it is running on time.";
          
          setMessages(prev => [...prev, { role: 'model', text: response }]);
          setLoading(false);
      }, 1000);
    };

    return (
      <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
           {messages.map((m, i) => (
             <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                 m.role === 'user' ? 'bg-[#2E1A47] text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-tl-none'
               }`}>
                 {m.text}
               </div>
             </div>
           ))}
           {loading && <div className="text-xs text-gray-400 ml-4 animate-pulse">Assistant is typing...</div>}
           <div ref={scrollRef} />
        </div>
        
        <div className="p-3 bg-white border-t border-gray-100">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3">
             {AI_SUGGESTIONS.map((s, i) => (
               <button key={i} onClick={() => handleSend(s)} className="whitespace-nowrap px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-700 hover:bg-gray-100">
                 {s}
               </button>
             ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask about your bus..." 
              className="flex-1 bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2E1A47]"
            />
            <button onClick={() => handleSend(input)} disabled={loading} className="p-2 bg-[#2E1A47] text-white rounded-lg">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- NOTIFICATIONS ---
  const NotificationsScreen = () => {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    useEffect(() => {
      const stored = JSON.parse(localStorage.getItem('sasurie_notifications') || '[]');
      if (stored.length > 0) setNotifications([...stored, ...MOCK_NOTIFICATIONS]);
    }, []);

    return (
      <div className="space-y-3 animate-fadeIn">
        {notifications.map((n, i) => (
          <div key={n.id || i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4">
              <div className={`mt-1 p-2 rounded-full ${n.type === 'delay' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                {n.type === 'delay' ? <AlertTriangle size={16} /> : <Bell size={16} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-gray-900">{n.title}</h4>
                  <span className="text-[10px] text-gray-400">{n.time}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{n.message}</p>
              </div>
          </div>
        ))}
        {notifications.length === 0 && <p className="text-center text-gray-400 mt-10">No new notifications</p>}
      </div>
    );
  };

  // --- COMPLAINTS ---
  const ComplaintScreen = () => {
    const [category, setCategory] = useState('Bus Delay');
    const [desc, setDesc] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
      if (!desc) return;
      const newComplaint = { id: Date.now(), studentName: student.name, category, desc, time: new Date().toLocaleString() };
      const existing = JSON.parse(localStorage.getItem('sasurie_complaints') || '[]');
      localStorage.setItem('sasurie_complaints', JSON.stringify([newComplaint, ...existing]));
      setSubmitted(true); setDesc('');
    };

    if (submitted) {
      return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center mt-10">
           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 mx-auto"><CheckCircle size={32} /></div>
           <h3 className="text-lg font-bold text-gray-900">Feedback Sent</h3>
           <p className="text-sm text-gray-500 mt-2">Thank you for helping us improve.</p>
           <button onClick={() => setSubmitted(false)} className="mt-6 text-[#2E1A47] text-sm font-semibold hover:underline">Submit Another</button>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
         <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Report an Issue</h2>
         <div className="space-y-5">
           <div>
             <label className="block text-xs font-semibold text-gray-500 mb-1.5">Category</label>
             <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-[#2E1A47]">
               <option>Bus Delay</option>
               <option>Driver Behavior</option>
               <option>Cleanliness</option>
               <option>Other</option>
             </select>
           </div>
           <div>
             <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description</label>
             <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg h-32 text-sm text-gray-900 focus:ring-1 focus:ring-[#2E1A47]" placeholder="Please describe the issue in detail..."></textarea>
           </div>
           <button onClick={handleSubmit} className="w-full bg-[#2E1A47] text-white py-3 rounded-lg font-bold shadow-sm hover:bg-[#3d235e]">SUBMIT REPORT</button>
         </div>
      </div>
    );
  };

  return (
    <Layout 
      variant="student"
      title={
        activeTab === 'HOME' ? 'Student Dashboard' : 
        activeTab === 'TRACK' ? 'Live Tracking' : 
        activeTab === 'SCAN' ? 'Attendance' : 
        activeTab === 'CHAT' ? 'Support' : 
        activeTab === 'NOTIFS' ? 'Notifications' : 
        activeTab === 'COMPLAINT' ? 'Feedback' : 'My Profile'
      }
      showBack={activeTab !== 'HOME'}
      onBack={() => setActiveTab('HOME')}
    >
      {activeTab === 'HOME' && <Dashboard />}
      {activeTab === 'SCAN' && <ScannerScreen />}
      {activeTab === 'TRACK' && <TrackingScreen />}
      {activeTab === 'CHAT' && <ChatScreen />}
      {activeTab === 'NOTIFS' && <NotificationsScreen />}
      {activeTab === 'COMPLAINT' && <ComplaintScreen />}
      {activeTab === 'PROFILE' && <ProfileScreen />}
    </Layout>
  );
};