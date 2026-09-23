import React from 'react';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  LogOut, 
  Key
} from 'lucide-react';
import employeesIcon from '../assets/icons/employees.png';
import recruitmentIcon from '../assets/icons/recruitment.png';
import settingsIcon from '../assets/icons/settings.png';

export default function HomeAppLauncher({ 
  currentUser, 
  onSelectApp, 
  theme = 'dark', 
  onToggleTheme,
  onLogout,
  onOpenChangePassword
}) {
  const isAdmin = currentUser?.role === 'ADMIN';
  const isLight = theme === 'light';

  const cardStyle = isLight 
    ? 'bg-white border-slate-200 text-slate-900 shadow-md hover:border-purple-600 hover:shadow-lg' 
    : 'bg-[#161a2b] border-slate-700 text-white shadow-xl hover:border-purple-500 hover:shadow-purple-500/20';

  const apps = [
    {
      id: 'calendar',
      name: 'Lịch',
      renderIcon: () => (
        <div className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border flex flex-col items-center justify-center transition-all duration-200 group-hover:scale-105 ${cardStyle}`}>
          <span className={`text-2xl sm:text-3xl font-black tracking-tighter ${isLight ? 'text-slate-900' : 'text-white'}`}>
            31
          </span>
        </div>
      )
    },
    {
      id: 'employees',
      name: 'Nhân viên',
      renderIcon: () => (
        <div className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border flex items-center justify-center transition-all duration-200 group-hover:scale-105 p-4 ${cardStyle}`}>
          <img 
            src={employeesIcon} 
            alt="Nhân viên" 
            className={`w-10 h-10 sm:w-11 sm:h-11 object-contain transition-transform duration-200 ${isLight ? '' : 'filter brightness-0 invert'}`} 
          />
        </div>
      )
    },
    {
      id: 'recruitment',
      name: 'Tuyển dụng',
      renderIcon: () => (
        <div className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border flex items-center justify-center transition-all duration-200 group-hover:scale-105 p-4 ${cardStyle}`}>
          <img 
            src={recruitmentIcon} 
            alt="Tuyển dụng" 
            className={`w-10 h-10 sm:w-11 sm:h-11 object-contain transition-transform duration-200 ${isLight ? '' : 'filter brightness-0 invert'}`} 
          />
        </div>
      )
    },
    {
      id: 'settings',
      name: 'Cài đặt',
      renderIcon: () => (
        <div className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border flex items-center justify-center transition-all duration-200 group-hover:scale-105 p-4 ${cardStyle}`}>
          <img 
            src={settingsIcon} 
            alt="Cài đặt" 
            className={`w-10 h-10 sm:w-11 sm:h-11 object-contain transition-transform duration-200 ${isLight ? '' : 'filter brightness-0 invert'}`} 
          />
        </div>
      )
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col relative font-sans select-none transition-colors duration-200 ${
      isLight ? 'bg-[#f4f5f8] text-slate-900' : 'bg-[#0b0f19] text-slate-100'
    }`}>
      {/* Top bar */}
      <header className={`px-6 py-4 flex items-center justify-between border-b transition-colors duration-200 z-10 ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#131726] border-slate-800'
      }`}>
        {/* Left: Brand Logo & Company - Nhóm 20 */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-700 flex items-center justify-center shadow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className={`font-black text-base tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Nhóm <span className="text-purple-600">20</span>
            </span>
            <span className={`text-[10px] block -mt-0.5 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Hệ thống quản lý tuyển dụng
            </span>
          </div>
        </div>

        {/* Right action items */}
        <div className="flex items-center gap-3 text-xs">


          {/* Theme switch */}
          <button
            onClick={onToggleTheme}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isLight 
                ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' 
                : 'border-slate-700 bg-[#161a2b] hover:bg-slate-800 text-slate-300'
            }`}
            title="Đổi giao diện Sáng / Tối"
          >
            {isLight ? <Moon className="w-3.5 h-3.5 text-purple-600" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* Company Name & User Badge */}
          <div className={`flex items-center gap-2.5 pl-2 border-l ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <span className={`font-semibold hidden md:inline ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Nhóm 20
            </span>
            <div 
              onClick={onOpenChangePassword}
              title="Nhấn để đổi mật khẩu"
              className="w-7 h-7 rounded-xl bg-purple-700 flex items-center justify-center font-bold text-white text-xs shadow cursor-pointer hover:scale-105 transition-transform"
            >
              {currentUser?.name?.charAt(0) || 'N'}
            </div>
            <button
              onClick={onLogout}
              title="Đăng xuất"
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Center Main App Launcher Grid */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 z-10">
        <div className="w-full max-w-2xl text-center">
          {/* Hàng 4 Ứng dụng */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => onSelectApp(app.id)}
                className="group flex flex-col items-center gap-3 cursor-pointer p-2 outline-none focus:scale-105 transition-transform"
              >
                {/* App Icon */}
                {app.renderIcon()}

                {/* App Label */}
                <span className={`text-xs sm:text-sm font-semibold transition-colors ${
                  isLight 
                    ? 'text-slate-700 group-hover:text-slate-900' 
                    : 'text-slate-300 group-hover:text-white'
                }`}>
                  {app.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Subtle bottom tagline */}
      <footer className={`py-4 text-center text-[11px] z-10 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
        <span>Hệ thống Quản lý Tuyển dụng & Nhân sự • Nhóm 20</span>
      </footer>
    </div>
  );
}
