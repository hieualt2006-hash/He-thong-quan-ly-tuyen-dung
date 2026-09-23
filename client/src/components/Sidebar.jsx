import React from 'react';
import {
  Calendar,
  Sparkles,
  Key,
  LogOut,
  ChevronRight,
  ShieldCheck,
  LayoutGrid
} from 'lucide-react';
import employeesIcon from '../assets/icons/employees.png';
import recruitmentIcon from '../assets/icons/recruitment.png';
import settingsIcon from '../assets/icons/settings.png';

function Sidebar({
  currentView, 
  setCurrentView, 
  serverStatus, 
  theme = 'dark',
  currentUser, 
  onOpenChangePassword, 
  onLogout
}) {
  const isAdmin = currentUser?.role === 'ADMIN';

  const navItems = [
    { id: 'calendar',    label: 'Lịch',         icon: Calendar,        desc: 'Lịch làm việc & Phỏng vấn' },
    { id: 'employees',   label: 'Nhân viên',    iconImg: employeesIcon,   desc: 'Danh sách & Hồ sơ nhân sự' },
    { id: 'recruitment', label: 'Tuyển dụng',   iconImg: recruitmentIcon, desc: 'Vị trí công việc & Ứng viên' },
    { id: 'settings',    label: 'Cài đặt',      iconImg: settingsIcon,    desc: 'Hệ thống, phân quyền, email' },
  ];

  const isActive = (id) => currentView === id;
  const isLight = theme === 'light';

  return (
    <aside
      className={`w-64 shrink-0 min-h-screen sticky top-0 z-40 flex flex-col justify-between border-r transition-colors duration-200 ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800'
          : 'bg-[#131726] border-slate-800 text-slate-100'
      }`}
    >
      <div className="flex flex-col">
        {/* Brand Header & Quay lại Menu Ứng Dụng */}
        <div 
          onClick={() => setCurrentView('home')}
          title="Bấm để về Màn hình chung 4 ứng dụng"
          className={`px-5 py-4 border-b flex items-center gap-3 cursor-pointer transition-colors group ${
            isLight ? 'border-slate-200 hover:bg-slate-50' : 'border-slate-800 hover:bg-slate-800/40'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-purple-700 flex items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-black text-base tracking-tight transition-colors ${
                isLight ? 'text-slate-900 group-hover:text-purple-700' : 'text-white group-hover:text-purple-300'
              }`}>
                Nhóm <span className="text-purple-600">20</span>
              </span>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase border ${
                isLight 
                  ? 'bg-purple-100 text-purple-700 border-purple-200' 
                  : 'bg-purple-950/50 text-purple-300 border-purple-700/40'
              }`}>
                {isAdmin ? 'ADMIN' : 'HR'}
              </span>
            </div>
            <span className={`text-[10px] block truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Hệ thống quản lý tuyển dụng
            </span>
          </div>
        </div>

        {/* Nút Quay về màn hình chung 4 ứng dụng (Trang Chủ) */}
        <div className="px-3 pt-3">
          <button
            onClick={() => setCurrentView('home')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              currentView === 'home'
                ? isLight 
                  ? 'bg-purple-100 text-purple-800 border-purple-300 shadow-xs'
                  : 'bg-purple-900/50 text-purple-300 border-purple-600/70 shadow-md'
                : isLight
                  ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-purple-50 hover:text-purple-700'
                  : 'bg-[#0e111d] text-slate-300 border-slate-800 hover:border-purple-600/50 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-purple-600" />
            <span>Trang Chủ 4 Ứng Dụng</span>
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="p-3 flex flex-col gap-1.5 mt-2">
          <p className={`px-3 mb-1 text-[10px] font-black uppercase tracking-widest ${
            isLight ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Ứng Dụng Doanh Nghiệp
          </p>

          {navItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                  active 
                    ? isLight
                      ? 'bg-purple-50 text-purple-800 border-purple-200 font-bold shadow-xs'
                      : 'bg-purple-900/40 text-purple-300 border border-purple-700/60 font-bold shadow-md' 
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-transparent'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  active 
                    ? 'bg-purple-700 text-white' 
                    : isLight 
                      ? 'bg-slate-100 text-slate-600' 
                      : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.iconImg ? (
                    <img 
                      src={item.iconImg} 
                      alt={item.label} 
                      className="w-3.5 h-3.5 object-contain"
                      style={{
                        filter: active 
                          ? 'brightness(0) invert(1)' 
                          : isLight 
                            ? 'none' 
                            : 'brightness(0) invert(0.7)'
                      }}
                    />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`block text-xs truncate leading-tight font-bold ${
                    active 
                      ? isLight ? 'text-purple-900' : 'text-purple-200' 
                      : isLight ? 'text-slate-800' : 'text-slate-200'
                  }`}>
                    {item.label}
                  </span>
                  <span className={`block text-[10px] truncate mt-0.5 ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {item.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className={`p-3 border-t flex flex-col gap-2 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
        {currentUser && (
          <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e111d] border-slate-800'}`}>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-700 flex items-center justify-center text-white font-black text-xs shrink-0 shadow">
                {currentUser.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden flex-1 min-w-0">
                <p className={`text-xs font-bold truncate leading-tight ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  {currentUser.name}
                </p>
                <p className={`text-[10px] truncate font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {currentUser.email}
                </p>
              </div>
            </div>

            <div className={`flex gap-1.5 pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <button
                onClick={onOpenChangePassword}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  isLight 
                    ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700' 
                    : 'border-slate-700 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Key className="w-3 h-3 text-purple-600" />
                Đổi MK
              </button>
              <button
                onClick={onLogout}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold bg-rose-500/10 border border-rose-500/20 text-rose-600 hover:bg-rose-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                Đăng xuất
              </button>
            </div>
          </div>
        )}

        {/* Server status pill */}
        <div className={`px-3 py-1.5 rounded-lg border flex items-center justify-between text-[10px] ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e111d] border-slate-800/80'
        }`}>
          <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Hệ thống Nhóm 20</span>
          <span className="flex items-center gap-1 text-emerald-600 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
