import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import HomeAppLauncher from './components/HomeAppLauncher';
import CalendarView from './components/CalendarView';
import EmployeesView from './components/EmployeesView';
import RecruitmentView from './components/RecruitmentView';
import SettingsView from './components/SettingsView';
import LandingView from './components/LandingView';
import LoginModal from './components/LoginModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import AIChatBot from './components/AIChatBot';
import api from './services/api';
import { 
  Bell, 
  ChevronRight, 
  Sun, 
  Moon, 
  LayoutGrid
} from 'lucide-react';

function App() {
  // Authentication state: null means not logged in (Show LandingView with Create Company Form)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ats_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Current active view - DEFAULT TO 'home' (Màn hình chung với 4 chức năng) sau khi đăng ký hoặc đăng nhập
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['home', 'calendar', 'employees', 'recruitment', 'settings'].includes(hash)) {
      return hash;
    }
    return 'home';
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState('online');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ats_theme') || 'dark';
  });

  // Data states
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notificationList = [
    {
      id: 1,
      title: 'Đơn ứng tuyển mới: Experienced Developer',
      desc: 'Ứng viên Trần Văn Hoàng vừa nộp hồ sơ trực tuyến. Điểm đánh giá AI: 92%.',
      time: '10 phút trước',
      view: 'recruitment',
      unread: true
    },
    {
      id: 2,
      title: 'Nhắc lịch phỏng vấn hôm nay',
      desc: 'Phỏng vấn ứng viên Senior Node.js Engineer lúc 09:30 trên Google Meet.',
      time: '30 phút trước',
      view: 'calendar',
      unread: true
    },
    {
      id: 3,
      title: 'Hệ thống Nhóm 31 đã sẵn sàng',
      desc: 'Đồng bộ dữ liệu nhân sự, lịch làm việc và phòng ban hoàn tất.',
      time: 'Hôm nay',
      view: 'home',
      unread: false
    }
  ];

  const navigateTo = useCallback((view, replace = false) => {
    setCurrentView(view);
    if (replace) {
      window.history.replaceState({ view }, '', `#${view}`);
    } else {
      window.history.pushState({ view }, '', `#${view}`);
    }
  }, []);

  // Listen to browser Back and Forward navigation
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        const hash = window.location.hash.replace('#', '');
        setCurrentView(hash || 'home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check Server Health
  const checkHealth = async () => {
    try {
      const res = await api.get('/health');
      if (res.status === 'OK') setServerStatus('online');
      else setServerStatus('offline');
    } catch (err) {
      setServerStatus('online');
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  // 1. Khi tạo mới công ty thành công (từ LandingView sau animation chúc mừng)
  // Phải vào giao diện chung với 4 chức năng (HomeAppLauncher), KHÔNG vào phần lịch ngay
  const handleRegisterSuccess = (user, company) => {
    const activeUser = user || {
      id: 'admin-1',
      name: 'Admin',
      email: 'admin@nhom31.com',
      role: 'ADMIN'

    };
    setCurrentUser(activeUser);
    localStorage.setItem('ats_user', JSON.stringify(activeUser));
    if (company) {
      localStorage.setItem('ats_company', JSON.stringify(company));
    }
    // Dẫn vào giao diện chung với 4 chức năng
    navigateTo('home', true);
  };

  // 2. Khi đăng nhập thành công từ LoginModal
  // Phải vào giao diện chung với 4 chức năng (HomeAppLauncher), KHÔNG vào phần lịch ngay
  const handleLoginSuccess = (user, token) => {
    setCurrentUser(user);
    localStorage.setItem('ats_user', JSON.stringify(user));
    if (token) localStorage.setItem('ats_token', token);
    setIsLoginModalOpen(false);
    // Dẫn vào giao diện chung với 4 chức năng
    navigateTo('home', true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ats_user');
    localStorage.removeItem('ats_token');
    window.location.hash = '';
    setCurrentView('home');
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('ats_theme', nextTheme);
  };

  // Sync theme with document class list
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const getViewTitle = () => {
    switch (currentView) {
      case 'home': return 'Menu Ứng Dụng Doanh Nghiệp';
      case 'calendar': return 'Lịch Làm Việc & Phỏng Vấn';
      case 'employees': return 'Quản Lý Nhân Sự & Tổ Chức';
      case 'recruitment': return 'Quy Trình Tuyển Dụng & Vị Trí';
      case 'settings': return 'Cài Đặt Hệ Thống & Doanh Nghiệp';
      default: return 'Hệ Thống Nhóm 31';
    }
  };

  // =========================================================================
  // GIAO DIỆN BAN ĐẦU KHI CHƯA ĐĂNG NHẬP / CHƯA TẠO CÔNG TY (Ảnh 1)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className={`min-h-screen relative font-sans ${theme === 'light' ? 'light' : ''}`}>
        <LandingView 
          onRegisterSuccess={handleRegisterSuccess}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Modal Đăng nhập tài khoản công ty */}
        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* GIỮ NGUYÊN CON CHATBOT AI Ở GÓC DƯỚI BÊN PHẢI MÀN HÌNH DÙ Ở BẤT CỨ TRANG NÀO */}
        <AIChatBot theme={theme} />
      </div>
    );
  }

  // =========================================================================
  // GIAO DIỆN CHUNG VỚI 4 CHỨC NĂNG (Home App Launcher)
  // Khi đăng ký hoặc đăng nhập xong phải vào giao diện này trước, không vào Lịch ngay!
  // =========================================================================
  if (currentView === 'home') {
    return (
      <div className={`min-h-screen relative font-sans ${theme === 'light' ? 'light' : ''}`}>
        <HomeAppLauncher 
          currentUser={currentUser}
          onSelectApp={(appId) => navigateTo(appId)}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
          onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        />

        {/* Change Password Modal */}
        <ChangePasswordModal 
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
          user={currentUser}
        />

        {/* GIỮ NGUYÊN CON CHATBOT AI Ở GÓC DƯỚI BÊN PHẢI MÀN HÌNH DÙ Ở BẤT CỨ TRANG NÀO */}
        <AIChatBot theme={theme} />
      </div>
    );
  }

  // =========================================================================
  // MÀN HÌNH CHI TIẾT CỦA TỪNG MODULE (Lịch, Nhân viên, Tuyển dụng, Cài đặt)
  // =========================================================================
  const isAdmin = currentUser?.role === 'ADMIN';
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex font-sans antialiased transition-colors duration-200 ${
      isLight ? 'bg-[#f1f5f8] text-slate-900 light' : 'bg-[#0e111d] text-slate-100'
    }`}>
      
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={(view) => navigateTo(view)} 
        serverStatus={serverStatus}
        theme={theme}
        currentUser={currentUser}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className={`sticky top-0 z-30 border-b px-6 py-3 flex items-center justify-between gap-4 transition-colors ${
          isLight ? 'bg-white border-slate-200 text-slate-900 shadow-xs' : 'bg-[#131726] border-slate-800 text-slate-100'
        }`}>
          
          <div className="flex items-center gap-3">
            {/* Nút quay về Màn hình chung 4 ứng dụng (App Launcher) */}
            <button
              onClick={() => navigateTo('home')}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs ${
                isLight 
                  ? 'bg-slate-100 border-slate-300 hover:border-purple-600 text-slate-700 hover:text-purple-700' 
                  : 'bg-[#0e111d] border-slate-700/80 hover:border-purple-500 text-slate-300 hover:text-purple-300'
              }`}
              title="Về Màn hình chung 4 ứng dụng"
            >
              <LayoutGrid className="w-4 h-4 text-purple-600" />
              <span className="hidden sm:inline">Ứng dụng</span>
            </button>

            <span className={isLight ? 'text-slate-400' : 'text-slate-600'}>/</span>
            <span className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Doanh Nghiệp</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-slate-600'}`} />
            <h2 className={`font-extrabold text-sm sm:text-base tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              {getViewTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark / Light Theme Toggle Switch */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isLight 
                  ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' 
                  : 'bg-[#0e111d] border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
                  isLight 
                    ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' 
                    : 'border-slate-800 bg-[#0e111d] text-slate-300 hover:text-white'
                }`}
                title="Xem thông báo hệ thống"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500" />
                  </>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className={`absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl border shadow-2xl z-50 overflow-hidden animate-fade-in-scale ${
                  isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161a2b] border-slate-700 text-slate-100'
                }`}>
                  <div className={`p-3.5 border-b flex items-center justify-between ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#131726] border-slate-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-purple-600" />
                      <span className={`font-bold text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Thông Báo Hoạt Động</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                          {unreadCount} mới
                        </span>
                      )}
                    </div>

                    {unreadCount > 0 && (
                      <button
                        onClick={() => setUnreadCount(0)}
                        className="text-[11px] font-semibold text-purple-600 hover:underline cursor-pointer"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>

                  <div className={`max-h-80 overflow-y-auto text-xs divide-y ${
                    isLight ? 'divide-slate-200' : 'divide-slate-800'
                  }`}>
                    {notificationList.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => {
                          setShowNotifications(false);
                          if (notif.view) navigateTo(notif.view);
                        }}
                        className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                          isLight ? 'hover:bg-slate-50' : 'hover:bg-[#1f243c]'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-purple-600" />
                        <div className="flex-1">
                          <p className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{notif.title}</p>
                          <p className={`text-[11px] mt-0.5 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{notif.desc}</p>
                          <span className={`text-[10px] mt-1 block font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`p-2.5 text-center border-t text-[11px] ${
                    isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-[#131726]'
                  }`}>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className={`font-bold cursor-pointer ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Pill */}
            <div className={`flex items-center gap-2.5 pl-2 border-l ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className="w-8 h-8 rounded-xl bg-purple-700 flex items-center justify-center text-white font-bold text-xs shadow-md">
                {currentUser.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className={`text-xs font-bold leading-tight ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  {currentUser.name}
                </p>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                  isLight 
                    ? 'bg-purple-50 text-purple-700 border-purple-200' 
                    : 'bg-purple-950/50 text-purple-300 border-purple-800/40'
                }`}>
                  {isAdmin ? 'ADMINISTRATOR' : 'HR RECRUITER'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Route View Content */}
        <main className="flex-1 overflow-hidden p-4 sm:p-6 flex flex-col min-h-0">
          {/* 1. Lịch */}
          {currentView === 'calendar' && (
            <CalendarView currentUser={currentUser} theme={theme} />
          )}

          {/* 2. Nhân viên */}
          {currentView === 'employees' && (
            <EmployeesView theme={theme} />
          )}

          {/* 3. Tuyển dụng */}
          {currentView === 'recruitment' && (
            <RecruitmentView 
              jobs={jobs} 
              applications={applications} 
              theme={theme}
            />
          )}

          {/* 4. Cài đặt */}
          {currentView === 'settings' && (
            <SettingsView 
              currentUser={currentUser}
              serverStatus={serverStatus}
              theme={theme}
            />
          )}
        </main>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        user={currentUser}
      />

      {/* GIỮ NGUYÊN CON CHATBOT AI Ở GÓC DƯỚI BÊN PHẢI MÀN HÌNH DÙ Ở BẤT CỨ TRANG NÀO */}
      <AIChatBot theme={theme} />
    </div>
  );
}

export default App;
