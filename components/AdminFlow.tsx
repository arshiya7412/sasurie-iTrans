import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Layout } from './Layout';
import { BUS_FLEET, STUDENTS_DB } from '../constants';
import { 
  Bus, Users, AlertTriangle, Map, Navigation, 
  BarChart, Bell, Settings, Search, X, CheckCircle, MessageCircle, Send
} from 'lucide-react';

interface AdminFlowProps {
  onLogout: () => void;
}

export const AdminFlow: React.FC<AdminFlowProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'BUSES' | 'STUDENTS' | 'DELAYED' | 'MAP_LIST' | 'QR' | 'FEEDBACK' | 'BROADCAST'>('HOME');
  const [selectedBus, setSelectedBus] = useState<string | null>(null);

  // --- SUB-COMPONENTS ---
  
  const StatCard = ({ label, value, icon, color, onClick }: any) => (
    <div onClick={onClick} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 active:scale-95 transition-transform cursor-pointer">
       <div className={`p-2 w-fit rounded-lg ${color} text-white mb-2`}>{icon}</div>
       <div>
         <p className="text-gray-500 text-xs font-semibold uppercase">{label}</p>
         <p className="text-2xl font-bold text-gray-800">{value}</p>
       </div>
    </div>
  );

  const ListItem = ({ title, subtitle, status, onClick, rightText, onMapClick }: any) => (
    <div onClick={onClick} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between active:bg-gray-50 cursor-pointer">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-10 rounded-full ${status === 'On Time' ? 'bg-green-500' : status === 'Delayed' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
        <div>
          <h4 className="font-bold text-gray-900">{title}</h4>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="text-right flex items-center gap-2">
        {rightText && <p className="text-sm font-semibold text-[#2E1A47]">{rightText}</p>}
        {onMapClick && (
           <button onClick={(e) => { e.stopPropagation(); onMapClick(); }} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100">
             <Navigation size={16} />
           </button>
        )}
        {status && !onMapClick && (
          <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
            status === 'On Time' ? 'bg-green-100 text-green-700' : 
            status === 'Delayed' ? 'bg-red-100 text-red-700' : 
            'bg-gray-100 text-gray-600'
          }`}>
            {status}
          </span>
        )}
      </div>
    </div>
  );

  // --- SCREENS ---

  const Dashboard = () => {
    const totalStudents = STUDENTS_DB.length;
    const delayedBuses = BUS_FLEET.filter(b => b.status === 'Delayed').length;
    
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Welcome Banner */}
        <div className="bg-[#4A148C] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1">Admin Dashboard</h2>
            <p className="text-white/70 text-sm">Overview of campus transport fleet.</p>
          </div>
          <div className="absolute right-[-20px] top-[-20px] bg-[#FFC107] w-24 h-24 rounded-full opacity-20 blur-xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            label="Total Buses" 
            value={BUS_FLEET.length} 
            icon={<Bus size={20} />} 
            color="bg-blue-600"
            onClick={() => setActiveTab('BUSES')}
          />
          <StatCard 
            label="Delayed" 
            value={delayedBuses} 
            icon={<AlertTriangle size={20} />} 
            color="bg-red-500"
            onClick={() => setActiveTab('DELAYED')}
          />
          <StatCard 
            label="Feedback" 
            value="View" 
            icon={<MessageCircle size={20} />} 
            color="bg-[#FFC107] text-black"
            onClick={() => setActiveTab('FEEDBACK')}
          />
          <StatCard 
            label="Live Map" 
            value="Track" 
            icon={<Map size={20} />} 
            color="bg-green-600"
            onClick={() => setActiveTab('MAP_LIST')}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-4 rounded-xl border border-gray-100">
           <h3 className="font-bold text-gray-800 mb-4">Quick Management</h3>
           <div className="space-y-3">
             <button onClick={() => setActiveTab('QR')} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
               <div className="flex items-center gap-3">
                 <div className="bg-[#2E1A47] text-white p-2 rounded-lg"><Settings size={18} /></div>
                 <span className="font-medium text-sm text-gray-800">Generate Bus QR</span>
               </div>
               <span className="text-gray-400">→</span>
             </button>
             <button onClick={() => setActiveTab('BROADCAST')} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
               <div className="flex items-center gap-3">
                 <div className="bg-[#2E1A47] text-white p-2 rounded-lg"><Bell size={18} /></div>
                 <span className="font-medium text-sm text-gray-800">Broadcast Notification</span>
               </div>
               <span className="text-gray-400">→</span>
             </button>
           </div>
        </div>
      </div>
    );
  };

  const BusList = ({ filterDelayed = false }) => {
    const buses = filterDelayed ? BUS_FLEET.filter(b => b.status === 'Delayed') : BUS_FLEET;

    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input type="text" placeholder="Search by Route No..." className="w-full pl-10 pr-4 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-[#4A148C] text-gray-900" />
        </div>
        
        {buses.map((bus) => (
          <ListItem 
            key={bus.routeNo}
            title={`Route ${bus.routeNo}`}
            subtitle={bus.routeName}
            status={bus.status}
            rightText={`${bus.totalStudents} Students`}
            onClick={() => {
              // Just detailed view logic here if needed
            }}
          />
        ))}

        {buses.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p>No buses found matching criteria.</p>
          </div>
        )}
      </div>
    );
  };

  const MapList = () => {
    return (
      <div className="space-y-4 animate-fadeIn">
        <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">Track Fleet on Google Maps</h3>
        {BUS_FLEET.map((bus) => (
          <ListItem 
            key={bus.routeNo}
            title={`Route ${bus.routeNo}`}
            subtitle={bus.routeName}
            rightText="Live"
            onMapClick={() => {
               const url = `https://www.google.com/maps/search/?api=1&query=${bus.currentLocation.lat},${bus.currentLocation.lng}`;
               window.open(url, '_blank');
            }}
            onClick={() => {
                const url = `https://www.google.com/maps/search/?api=1&query=${bus.currentLocation.lat},${bus.currentLocation.lng}`;
                window.open(url, '_blank');
            }}
          />
        ))}
      </div>
    );
  };

  const FeedbackList = () => {
     const [complaints, setComplaints] = useState<any[]>([]);

     useEffect(() => {
        const stored = localStorage.getItem('sasurie_complaints');
        if (stored) {
            setComplaints(JSON.parse(stored));
        }
     }, []);

     if (complaints.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <MessageCircle size={48} className="mb-2 opacity-50" />
                <p>No complaints received yet.</p>
            </div>
        )
     }

     return (
         <div className="space-y-4 animate-fadeIn">
            {complaints.map((c: any) => (
                <div key={c.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between mb-2">
                        <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-bold">{c.category}</span>
                        <span className="text-xs text-gray-400">{c.time}</span>
                    </div>
                    <p className="text-gray-800 font-medium text-sm mb-2">{c.desc}</p>
                    <p className="text-xs text-gray-500 text-right">- {c.studentName}</p>
                </div>
            ))}
         </div>
     )
  }

  const StudentList = () => {
    return (
      <div className="space-y-4 animate-fadeIn">
         <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
           <div className="text-center flex-1 border-r border-gray-100">
             <p className="text-xs text-gray-500">Present</p>
             <p className="text-xl font-bold text-green-600">84%</p>
           </div>
           <div className="text-center flex-1">
             <p className="text-xs text-gray-500">Absent</p>
             <p className="text-xl font-bold text-red-500">16%</p>
           </div>
         </div>

         {STUDENTS_DB.map((student, i) => (
           <ListItem 
             key={i}
             title={student.name}
             subtitle={`${student.regNo} • ${student.stoppingName}`}
             rightText={`Bus ${student.busRouteNo}`}
             onClick={() => {}}
           />
         ))}
      </div>
    );
  };

  const QRGenerator = () => {
    const [selectedRoute, setSelectedRoute] = useState(BUS_FLEET[0].routeNo);
    const [qrValue, setQrValue] = useState('');

    const generate = () => {
      // Format: sasurie-bus-{routeNo}-{timestamp}
      const val = `sasurie-bus-${selectedRoute}-${Date.now()}`;
      setQrValue(val);
      localStorage.setItem('active_qr_code', val);
    };

    return (
      <div className="h-full flex flex-col justify-center animate-fadeIn">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-center">
           <div className="w-16 h-16 bg-[#FFC107]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#4A148C]">
             <Settings size={32} />
           </div>
           <h2 className="text-xl font-bold mb-2 text-gray-900">Generate Attendance QR</h2>
           <p className="text-sm text-gray-500 mb-6">Select a bus route to generate the daily entry code.</p>
           
           <select 
             className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-[#4A148C] outline-none text-gray-900"
             value={selectedRoute}
             onChange={(e) => { setSelectedRoute(e.target.value); setQrValue(''); }}
           >
             {BUS_FLEET.map(b => (
               <option key={b.routeNo} value={b.routeNo}>Bus {b.routeNo} - {b.routeName}</option>
             ))}
           </select>

           {!qrValue ? (
             <button 
               onClick={generate}
               className="w-full py-3 bg-[#4A148C] text-white rounded-xl font-bold shadow-lg hover:bg-[#380e6d] transition-colors"
             >
               Generate Code
             </button>
           ) : (
             <div className="mt-4 flex flex-col items-center">
                <div className="p-4 border-2 border-dashed border-[#FFC107] rounded-xl bg-white">
                   <QRCodeSVG value={qrValue} size={200} />
                </div>
                <p className="mt-4 font-mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded break-all">{qrValue}</p>
                <p className="text-sm text-green-600 font-bold mt-2 flex items-center gap-1">
                   <CheckCircle size={14} /> Active for scanning
                </p>
                <button onClick={() => setQrValue('')} className="mt-4 text-[#4A148C] text-sm underline">Reset</button>
             </div>
           )}
        </div>
      </div>
    );
  };

  const BroadcastScreen = () => {
    const [targetRoute, setTargetRoute] = useState('ALL');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const handleSend = () => {
      if (!message.trim()) return;

      const newNotif = {
        id: Date.now().toString(),
        title: targetRoute === 'ALL' ? 'General Announcement' : `Update for Route ${targetRoute}`,
        message: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'info'
      };

      // Simulating backend by using LocalStorage to pass data to Student view
      const current = JSON.parse(localStorage.getItem('sasurie_notifications') || '[]');
      localStorage.setItem('sasurie_notifications', JSON.stringify([newNotif, ...current]));

      setSent(true);
      setMessage('');
      setTimeout(() => setSent(false), 3000);
    };

    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full animate-fadeIn">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Broadcast Notification</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Target Audience</label>
            <select 
               value={targetRoute}
               onChange={(e) => setTargetRoute(e.target.value)}
               className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4A148C] text-gray-900"
            >
              <option value="ALL">All Students (General)</option>
              {BUS_FLEET.map(b => (
                <option key={b.routeNo} value={b.routeNo}>Bus {b.routeNo} Only</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Message Description</label>
            <textarea 
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-32 outline-none focus:ring-2 focus:ring-[#4A148C] text-gray-900" 
               placeholder="Type your alert here (e.g., Bus delay, Route change)..."
            ></textarea>
          </div>
          
          <button 
            onClick={handleSend}
            className="w-full bg-[#2E1A47] text-white py-3 rounded-xl font-bold shadow-lg hover:bg-[#4527a0] flex items-center justify-center gap-2"
          >
            <Send size={18} /> Send Alert
          </button>

          {sent && (
            <div className="p-3 bg-green-100 text-green-700 rounded-xl text-sm font-bold text-center animate-pulse">
              Notification Broadcasted Successfully!
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <Layout 
      variant="admin"
      title={
        activeTab === 'HOME' ? 'Dashboard' : 
        activeTab === 'BUSES' ? 'Fleet Management' :
        activeTab === 'STUDENTS' ? 'Student Records' :
        activeTab === 'DELAYED' ? 'Delayed Buses' :
        activeTab === 'MAP_LIST' ? 'Live Tracking' : 
        activeTab === 'FEEDBACK' ? 'Student Feedback' : 
        activeTab === 'QR' ? 'QR Generator' : 'Broadcast'
      }
      showBack={activeTab !== 'HOME'}
      onBack={() => { setActiveTab('HOME'); setSelectedBus(null); }}
      actions={
        <button onClick={onLogout} className="bg-white/10 p-2 rounded-full hover:bg-white/20 text-white flex items-center gap-1">
            <span className="text-xs font-bold px-1">Logout</span>
            <LogOutIcon />
        </button>
      }
    >
      {activeTab === 'HOME' && <Dashboard />}
      {activeTab === 'BUSES' && <BusList />}
      {activeTab === 'DELAYED' && <BusList filterDelayed={true} />}
      {activeTab === 'STUDENTS' && <StudentList />}
      {activeTab === 'MAP_LIST' && <MapList />}
      {activeTab === 'FEEDBACK' && <FeedbackList />}
      {activeTab === 'QR' && <QRGenerator />}
      {activeTab === 'BROADCAST' && <BroadcastScreen />}
    </Layout>
  );
};

const LogOutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);