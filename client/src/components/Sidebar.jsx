import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Sparkles, 
  Server,
  Building2,
  ChevronRight
} from 'lucide-react';

function Sidebar({ currentView, setCurrentView, serverStatus }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, badge: null },
    { id: 'jobs', label: 'Tin Tuyển Dụng', icon: Briefcase, badge: 'Jobs' },
    { id: 'applications', label: 'Hồ Sơ Ứng Viên', icon: Users, badge: 'HR' },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800/80 flex flex-col justify-between shrink-0 min-h-screen sticky top-0 z-40 backdrop-blur-xl">
      <div>
        {/* Brand Logo */}
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight leading-none">
              Recruitment ATS
            </h1>
            <span className="text-[11px] text-indigo-400 font-medium">Decoupled AI System</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-3 py-6 flex flex-col gap-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Menu Điều Hướng
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isActive 
                      ? 'bg-indigo-700/60 text-indigo-100' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 m-3 rounded-2xl border">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-indigo-400" />
            Backend API
          </span>
          <span className={`w-2 h-2 rounded-full ${
            serverStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
          }`} />
        </div>
        <div className="text-[11px] text-slate-500 font-mono truncate">
          http://localhost:5000
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
