import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Sparkles, 
  Server,
  Building2, 
  Calendar, 
  BarChart3, 
  Sliders, 
  Kanban, 
  Layers, 
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Key,
  LogOut,
  Globe,
  ExternalLink
} from 'lucide-react';

function Sidebar({ 
  currentView, 
  setCurrentView, 
  serverStatus, 
  counts = {}, 
  theme = 'dark',
  currentUser,
  onOpenChangePassword,
  onLogout,
  onViewPublicPortal
}) {
  const isLight = theme === 'light';
  const isAdmin = currentUser?.role === 'ADMIN';

  // Base Organization items
  const orgItems = [
    { id: 'departments', label: 'Cơ Cấu Phòng Ban', icon: Building2, badge: '5 Depts' },
    { id: 'settings', label: 'Cài Đặt & Trọng Số', icon: Sliders, badge: null },
  ];

  // If Admin, add User Management
  if (isAdmin) {
    orgItems.unshift({ 
      id: 'users', 
      label: 'Quản Lý Tài Khoản', 
      icon: ShieldCheck, 
      badge: 'Admin' 
    });
  }

  const menuGroups = [
    {
      group: 'Tổng Quan',
      items: [
        { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, badge: null },
        { id: 'analytics', label: 'Báo Cáo & Analytics', icon: BarChart3, badge: 'Reports' },
      ]
    },
    {
      group: 'Tuyển Dụng & Ứng Viên',
      items: [
        { id: 'jobs', label: 'Tin Tuyển Dụng (Jobs)', icon: Briefcase, badge: counts.jobs ? `${counts.jobs}` : null },
        { id: 'pipeline', label: 'Bảng Theo Dõi Tuyển Dụng', icon: Kanban, badge: null },
        { id: 'applications', label: 'Hồ Sơ Ứng Viên', icon: Users, badge: counts.apps ? `${counts.apps}` : null },
        { id: 'interviews', label: 'Lịch Phỏng Vấn', icon: Calendar, badge: null },
      ]
    },
    {
      group: 'Tổ Chức & Cài Đặt',
      items: orgItems
    }
  ];

  return (
    <aside className={`w-64 border-r flex flex-col justify-between shrink-0 min-h-screen sticky top-0 z-40 backdrop-blur-2xl transition-colors duration-300 ${
      isLight 
        ? 'bg-white/95 border-slate-200 shadow-sm' 
        : 'bg-slate-900/95 border-slate-800/80'
    }`}>
      <div className="overflow-y-auto">
        {/* Brand Logo Header - OrangeHRM + Zoho style */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isLight ? 'border-slate-200' : 'border-slate-800/80'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-amber-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black shrink-0 hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className={`font-extrabold text-base tracking-tight leading-none ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  Smart<span className="text-orange-500">ATS</span>
                </h1>
                <span className="bg-orange-500/10 text-orange-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-orange-500/20 uppercase">
                  {isAdmin ? 'ADMIN' : 'HR'}
                </span>
              </div>
              <span className={`text-[10px] font-medium block mt-0.5 ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Hệ Thống Tuyển Dụng
              </span>
            </div>
          </div>
        </div>

        {/* View Public Portal Switch Button */}
        {onViewPublicPortal && (
          <div className="px-3 pt-3">
            <button
              onClick={onViewPublicPortal}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-slate-950/70 hover:bg-slate-800/70 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-orange-400" />
                <span>Trang Tuyển Dụng (User)</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        )}

        {/* Navigation Menu Groups */}
        <div className="px-3 py-3 flex flex-col gap-4">
          {menuGroups.map((grp, gIdx) => (
            <div key={gIdx}>
              <div className={`px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                isLight ? 'text-slate-400' : 'text-slate-400'
              }`}>
                <span>{grp.group}</span>
              </div>

              <div className="flex flex-col gap-0.5">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id || 
                    (currentView === 'job-detail' && item.id === 'jobs') ||
                    (currentView === 'application-detail' && (item.id === 'applications' || item.id === 'pipeline'));

                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-xs transition-all duration-200 group hover:translate-x-1 ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/25 font-bold'
                          : isLight 
                            ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 transition-colors shrink-0 ${
                          isActive 
                            ? 'text-white' 
                            : isLight 
                              ? 'text-slate-500 group-hover:text-orange-500' 
                              : 'text-slate-400 group-hover:text-orange-400'
                        }`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : item.badge === 'Admin'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                              : isLight 
                                ? 'bg-slate-200 text-slate-700 border border-slate-300' 
                                : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer User Info & Controls */}
      <div className="p-2.5 flex flex-col gap-2">
        {/* User Card */}
        {currentUser && (
          <div className={`p-3 rounded-2xl border flex flex-col gap-2 ${
            isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 text-white ${
                isAdmin 
                  ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/20' 
                  : 'bg-gradient-to-tr from-orange-500 to-amber-500 shadow-md shadow-orange-500/20'
              }`}>
                {currentUser.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden flex-1">
                <h4 className={`text-xs font-bold truncate leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {currentUser.name}
                </h4>
                <span className="text-[10px] text-slate-400 font-mono truncate block">
                  {currentUser.email}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/60">
              <button
                onClick={onOpenChangePassword}
                title="Đổi mật khẩu"
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-[10px] font-semibold border border-slate-750 transition-colors"
              >
                <Key className="w-3 h-3 text-orange-400" />
                <span>Đổi MK</span>
              </button>

              <button
                onClick={onLogout}
                title="Đăng xuất"
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 rounded-lg text-[10px] font-semibold border border-rose-500/30 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        )}

        {/* Server Status */}
        <div className={`px-3 py-2 rounded-xl border flex items-center justify-between text-xs ${
          isLight
            ? 'bg-slate-50 border-slate-200 text-slate-700'
            : 'bg-slate-950/50 border-slate-800/80 text-slate-400'
        }`}>
          <span className="font-semibold flex items-center gap-1.5 text-[10px]">
            <Server className="w-3 h-3 text-emerald-500" />
            Express + PostgreSQL (Neon)
          </span>
          <span className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
            serverStatus === 'online' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${serverStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {serverStatus === 'online' ? 'Online' : 'Checking'}
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
