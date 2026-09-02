import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import JobListView from './components/JobListView';
import PublicJobDetailView from './components/PublicJobDetailView';
import PipelineKanbanView from './components/PipelineKanbanView';
import ApplicationListView from './components/ApplicationListView';
import ApplicationDetailView from './components/ApplicationDetailView';
import InterviewScheduleView from './components/InterviewScheduleView';
import AnalyticsView from './components/AnalyticsView';
import DepartmentView from './components/DepartmentView';
import SettingsView from './components/SettingsView';
import UserManagementView from './components/UserManagementView';
import CandidatePortalView from './components/CandidatePortalView';
import LoginModal from './components/LoginModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import AIChatBot from './components/AIChatBot';
import api from './services/api';
import { 
  Search, 
  Bell, 
  Sparkles, 
  UserCheck, 
  ChevronRight, 
  Plus, 
  HelpCircle, 
  Sun, 
  Moon,
  Globe,
  Key,
  LogOut,
  ShieldCheck,
  Lock
} from 'lucide-react';

function App() {
  // Authentication state (Default is null -> Candidate Public View)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ats_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) return hash;
    const saved = localStorage.getItem('ats_user');
    return saved ? 'dashboard' : 'candidate-portal';
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const [serverStatus, setServerStatus] = useState('checking');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ats_theme') || 'dark';
  });
  
  // Data states
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  
  // Selected detail states
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notificationList = [
    {
      id: 1,
      title: 'Hồ sơ mới nộp & Đã chấm điểm AI',
      desc: 'Ứng viên vừa hoàn thành nộp CV. Điểm AI Match Score phân tích đạt kết quả cao.',
      time: 'Vừa xong',
      view: 'applications',
      unread: true
    },
    {
      id: 2,
      title: 'Nhắc lịch phỏng vấn hôm nay',
      desc: 'Có 1 buổi phỏng vấn kỹ thuật trực tuyến lúc 14:30. Vui lòng kiểm tra phòng họp.',
      time: '25 phút trước',
      view: 'interviews',
      unread: true
    },
    {
      id: 3,
      title: 'Khởi tạo hệ thống thành công',
      desc: 'Hệ thống Smart ATS Pro đã kết nối cơ sở dữ liệu SQLite và Google Gemini AI.',
      time: 'Hôm nay',
      view: 'dashboard',
      unread: false
    }
  ];

  // Helper for synchronized navigation with Browser History (Back/Forward buttons)
  const navigateTo = useCallback((view, extra = {}, replace = false) => {
    setCurrentView(view);
    if (extra.job !== undefined) setSelectedJob(extra.job);
    else if (view !== 'job-detail') setSelectedJob(null);

    if (extra.application !== undefined) setSelectedApplication(extra.application);
    else if (view !== 'application-detail') setSelectedApplication(null);

    const historyState = {
      view,
      job: extra.job || null,
      application: extra.application || null
    };

    if (replace) {
      window.history.replaceState(historyState, '', `#${view}`);
    } else {
      window.history.pushState(historyState, '', `#${view}`);
    }
  }, []);

  // Listen to browser Back and Forward navigation (popstate)
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
        setSelectedJob(event.state.job || null);
        setSelectedApplication(event.state.application || null);
      } else {
        const hash = window.location.hash.replace('#', '');
        const savedUser = localStorage.getItem('ats_user');
        const defaultView = savedUser ? 'dashboard' : 'candidate-portal';
        const targetView = hash || defaultView;
        setCurrentView(targetView);
        setSelectedJob(null);
        setSelectedApplication(null);
      }
    };

    // Ensure initial entry in browser history
    const initialHash = window.location.hash.replace('#', '');
    const savedUser = localStorage.getItem('ats_user');
    const initialView = initialHash || (savedUser ? 'dashboard' : 'candidate-portal');

    window.history.replaceState(
      { view: initialView, job: selectedJob, application: selectedApplication },
      '',
      `#${initialView}`
    );

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('ats_theme', nextTheme);
  };

  // Check Server Health
  const checkHealth = async () => {
    try {
      const res = await api.get('/health');
      if (res.status === 'OK') {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch (err) {
      setServerStatus('offline');
    }
  };

const DEFAULT_DEMO_JOBS = [
  {
    id: 'job-1',
    title: 'Senior Node.js Backend Engineer',
    department: 'Engineering',
    salaryRange: '$2,000 - $3,500',
    description: 'Chịu trách nhiệm thiết kế và phát triển RESTful API / Microservices hiệu năng cao, tối ưu cơ sở dữ liệu và tích hợp các module AI.',
    requirements: 'Node.js, Express, PostgreSQL, SQLite, Docker, Redis, REST API, Microservices',
    status: 'Đang tuyển',
    applications: []
  },
  {
    id: 'job-2',
    title: 'AI / Machine Learning Engineer',
    department: 'AI Lab',
    salaryRange: '$2,500 - $4,200',
    description: 'Nghiên cứu, phát triển và tối ưu các pipeline AI, tích hợp mô hình ngôn ngữ lớn (LLM - Gemini / GPT), phân tích CV và tự động sinh câu hỏi phỏng vấn.',
    requirements: 'Python, PyTorch, LangChain, Gemini API, NLP, Vector Database, RAG',
    status: 'Đang tuyển',
    applications: []
  },
  {
    id: 'job-3',
    title: 'Senior Frontend Developer (React / Vite)',
    department: 'Product & Design',
    salaryRange: '$1,800 - $3,000',
    description: 'Xây dựng giao diện Dashboard, Kanban Pipeline tương tác cao, thiết kế hệ thống Design System chuẩn UX/UI và tối ưu hoá tốc độ tải trang.',
    requirements: 'React, TypeScript, Tailwind CSS, Vite, Redux/Zustand, WebSocket, Responsive UI',
    status: 'Đang tuyển',
    applications: []
  },
  {
    id: 'job-4',
    title: 'Chuyên Viên Tuyển Dụng Cao Cấp (Senior HR Recruiter)',
    department: 'HR & Operations',
    salaryRange: '$1,200 - $2,200',
    description: 'Tìm kiếm và săn đón nhân tài công nghệ, sàng lọc hồ sơ, điều phối quy trình phỏng vấn và phát triển nguồn nhân lực chất lượng cao.',
    requirements: '3+ năm kinh nghiệm tuyển dụng IT/Tech, Kỹ năng phỏng vấn, Giao tiếp tiếng Anh tốt',
    status: 'Đang tuyển',
    applications: []
  }
];

const DEFAULT_DEMO_APPLICATIONS = [
  {
    id: 'app-demo-1',
    jobId: 'job-1',
    status: 'Applied',
    matchScore: 88,
    matchSummary: 'Ứng viên có kỹ năng Node.js, Express, SQLite và Docker rất phù hợp với vị trí Backend Engineer.',
    missingSkills: 'Redis, Kubernetes',
    candidate: {
      id: 'cand-1',
      fullName: 'Trần Văn Hoàng',
      email: 'hoang.tran@gmail.com',
      phone: '0987654321',
      rawCvText: 'Fullstack developer with 4 years experience in Node.js, Express, PostgreSQL, React and Docker.'
    },
    job: {
      id: 'job-1',
      title: 'Senior Node.js Backend Engineer',
      department: 'Engineering'
    }
  },
  {
    id: 'app-demo-2',
    jobId: 'job-2',
    status: 'Interview',
    matchScore: 94,
    matchSummary: 'Ứng viên có kinh nghiệm triển khai Gemini API và xây dựng hệ thống RAG thực tế.',
    missingSkills: 'PyTorch production deployment',
    candidate: {
      id: 'cand-2',
      fullName: 'Lê Minh Quân',
      email: 'quan.le@ai-lab.vn',
      phone: '0912345678',
      rawCvText: 'AI Researcher & Engineer specializing in LLMs, LangChain, RAG architecture and Vector DBs.'
    },
    job: {
      id: 'job-2',
      title: 'AI / Machine Learning Engineer',
      department: 'AI Lab'
    }
  }
];

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setJobs(res.data);
      } else {
        setJobs(DEFAULT_DEMO_JOBS);
      }
    } catch (err) {
      console.warn('Backend API offline or empty, using high-quality demo jobs fallback');
      setJobs(DEFAULT_DEMO_JOBS);
    }
  };

  // Fetch Applications
  const fetchApplications = async () => {
    try {
      const res = await api.get('/jobs');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const allApps = [];
        for (const j of res.data) {
          const jDetail = await api.get(`/jobs/${j.id}`);
          if (jDetail.success && jDetail.data?.applications) {
            jDetail.data.applications.forEach(app => {
              allApps.push({
                ...app,
                job: { title: j.title, department: j.department }
              });
            });
          }
        }
        setApplications(allApps.length > 0 ? allApps : DEFAULT_DEMO_APPLICATIONS);
      } else {
        setApplications(DEFAULT_DEMO_APPLICATIONS);
      }
    } catch (err) {
      console.warn('Backend API offline, using fallback applications');
      setApplications(DEFAULT_DEMO_APPLICATIONS);
    }
  };

  useEffect(() => {
    checkHealth();
    fetchJobs();
    fetchApplications();

    const timer = setInterval(checkHealth, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginSuccess = (user, token) => {
    setCurrentUser(user);
    localStorage.setItem('ats_user', JSON.stringify(user));
    if (token) localStorage.setItem('ats_token', token);
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ats_user');
    localStorage.removeItem('ats_token');
    navigateTo('candidate-portal');
  };

  const handleSelectJob = (job) => {
    navigateTo('job-detail', { job });
  };

  const handleSelectApplication = (app) => {
    navigateTo('application-detail', { application: app });
  };

  const handleApplicationSubmitted = () => {
    fetchJobs();
    fetchApplications();
    alert('🎉 Nộp hồ sơ ứng tuyển thành công! AI đã tiếp nhận và phân tích hồ sơ của bạn.');
  };

  const handleStatusUpdated = () => {
    fetchApplications();
    if (selectedApplication) {
      api.get(`/applications/${selectedApplication.id}`).then(res => {
        if (res.success && res.data) {
          setSelectedApplication(res.data);
        }
      }).catch(err => console.error(err));
    }
  };

  const getViewTitle = () => {
    switch(currentView) {
      case 'dashboard': return 'Tổng Quan Hệ Thống ATS';
      case 'analytics': return 'Báo Cáo & Phân Tích AI Match';
      case 'jobs': return 'Danh Sách Vị Trí Tuyển Dụng';
      case 'job-detail': return selectedJob ? `Chi Tiết Job: ${selectedJob.title}` : 'Chi Tiết Công Việc';
      case 'pipeline': return 'Bảng Theo Dõi Tuyển Dụng';
      case 'applications': return 'Danh Sách Hồ Sơ Ứng Viên';
      case 'application-detail': return selectedApplication ? `Đánh Giá AI: ${selectedApplication.candidate?.fullName}` : 'Chi Tiết Hồ Sơ';
      case 'interviews': return 'Quản Lý Lịch Phỏng Vấn & AI Bank';
      case 'departments': return 'Cơ Cấu Tổ Chức & Phòng Ban';
      case 'settings': return 'Cài Đặt Hệ Thống & Trọng Số AI';
      case 'users': return 'Quản Trị Người Dùng & Cấp Quyền';
      default: return 'Recruitment ATS Pro';
    }
  };

  // --- CANDIDATE PUBLIC VIEW (When not logged in or in candidate-portal mode) ---
  if (!currentUser || currentView === 'candidate-portal') {
    return (
      <div className="min-h-screen" style={{ background: 'var(--c-bg)', color: 'var(--c-text)' }}>
        {currentView === 'job-detail' && selectedJob ? (
          <div className="max-w-5xl mx-auto p-4 sm:p-8">
            <PublicJobDetailView 
              job={selectedJob} 
              onBack={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  navigateTo('candidate-portal');
                }
              }}
              onApplicationSubmitted={handleApplicationSubmitted}
            />
          </div>
        ) : (
          <CandidatePortalView 
            jobs={jobs}
            onSelectJob={handleSelectJob}
            onOpenApplyModal={(job) => {
              handleSelectJob(job);
            }}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {/* Login Modal */}
        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* AI Chatbot for Candidates */}
        <AIChatBot theme={theme} />
      </div>
    );
  }

  // --- HR / ADMIN AUTHENTICATED DASHBOARD ---
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <div className={`min-h-screen flex font-sans antialiased transition-colors duration-300 ${theme === 'light' ? 'light' : ''}`}
      style={{ background: 'var(--c-bg)', color: 'var(--c-text)' }}>
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={(view) => navigateTo(view)} 
        serverStatus={serverStatus}
        counts={{ jobs: jobs.length, apps: applications.length }}
        theme={theme}
        currentUser={currentUser}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        onLogout={handleLogout}
        onViewPublicPortal={() => navigateTo('candidate-portal')}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Header Bar */}
        <header className="sticky top-0 z-30 border-b glass px-6 py-3.5 flex items-center justify-between gap-4 transition-colors duration-300"
          style={{ background: 'var(--c-header)', borderColor: 'var(--c-border)' }}>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium hidden md:inline" style={{ color: 'var(--c-text-lo)' }}>Smart ATS</span>
            <ChevronRight className="w-3.5 h-3.5 hidden md:inline" style={{ color: 'var(--c-text-faint)' }} />
            <h2 className="font-bold text-sm md:text-base tracking-tight truncate max-w-xs md:max-w-md" style={{ color: 'var(--c-text-hi)' }}>
              {getViewTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Button: View Public Candidate Portal */}
            <button
              onClick={() => navigateTo('candidate-portal')}
              title="Xem giao diện công khai của Ứng viên"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ui-btn-ghost"
            >
              <Globe className="w-3.5 h-3.5" style={{ color: 'var(--c-accent)' }} />
              <span>Trang Tuyển Dụng</span>
            </button>

            {/* Quick Action: New Job */}
            <button
              onClick={() => navigateTo('jobs')}
              className="flex items-center gap-1.5 text-white font-bold px-3 py-1.5 rounded-xl text-xs ui-btn-accent"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Đăng Job</span>
            </button>

            {/* Dark / Light Theme Toggle Switch */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
              className="p-2 rounded-xl transition-all duration-300 border flex items-center justify-center hover:scale-105 active:scale-95 ui-btn-ghost"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" style={{ color: 'var(--c-accent)' }} />
              ) : (
                <Moon className="w-4 h-4" style={{ color: 'var(--c-accent)' }} />
              )}
            </button>

            {/* Interactive Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl transition-all duration-200 border flex items-center justify-center hover:scale-105 active:scale-95 ui-btn-ghost"
                title="Xem thông báo tuyển dụng"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full animate-ping" style={{ background: 'var(--c-accent)' }} />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--c-accent)' }} />
                  </>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {showNotifications && (
                <div 
                  className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl border shadow-2xl z-50 overflow-hidden animate-fade-in-scale"
                  style={{ background: 'var(--c-card)', borderColor: 'var(--c-border-md)', boxShadow: 'var(--shadow-lg)' }}
                >
                  <div className="p-3.5 border-b flex items-center justify-between"
                    style={{ background: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)' }}>
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                      <span className="font-bold text-xs" style={{ color: 'var(--text-heading)' }}>Thông Báo Hệ Thống</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border"
                          style={{ background: 'var(--accent-soft)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }}>
                          {unreadCount} mới
                        </span>
                      )}
                    </div>

                    {unreadCount > 0 && (
                      <button
                        onClick={() => setUnreadCount(0)}
                        className="text-[11px] font-semibold hover:underline"
                        style={{ color: 'var(--accent)' }}
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto text-xs" style={{ divide: 'var(--border-subtle)' }}>
                    {notificationList.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => {
                          setShowNotifications(false);
                          if (item.view) navigateTo(item.view);
                        }}
                        className="p-3.5 flex items-start gap-3 cursor-pointer transition-colors border-b last:border-b-0"
                        style={{ borderColor: 'var(--border-subtle)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-soft)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = ''; }}
                      >
                        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--accent)' }} />
                        <div className="flex-1">
                          <p className="font-bold text-xs leading-snug" style={{ color: 'var(--text-heading)' }}>{item.title}</p>
                          <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                            {item.desc}
                          </p>
                          <span className="text-[10px] mt-1.5 block font-mono" style={{ color: 'var(--text-faint)' }}>{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 text-center border-t text-[11px]"
                    style={{ background: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)' }}>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="font-bold transition-colors"
                      style={{ color: 'var(--text-faint)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-faint)'; }}
                    >
                      Đóng thông báo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar with dropdown or role badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l" style={{ borderColor: 'var(--c-border-md)' }}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-md ${
                isAdmin 
                  ? 'bg-gradient-to-tr from-indigo-500 to-violet-600' 
                  : 'bg-gradient-to-tr from-amber-500 to-orange-500'
              }`}>
                {currentUser.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold leading-tight" style={{ color: 'var(--c-text-hi)' }}>
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                    isAdmin 
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25' 
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/25'
                  }`}>
                    {isAdmin ? 'SYSTEM ADMIN' : 'HR RECRUITER'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 animate-fade-up">
          {currentView === 'dashboard' && (
            <DashboardView 
              jobs={jobs} 
              applications={applications} 
              onNavigate={(view) => navigateTo(view)}
              onOpenCreateJob={() => navigateTo('jobs')}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView 
              jobs={jobs}
              applications={applications}
            />
          )}

          {currentView === 'jobs' && (
            <JobListView 
              jobs={jobs} 
              fetchJobs={fetchJobs} 
              onSelectJob={handleSelectJob}
              onOpenApplyModal={(job) => {
                handleSelectJob(job);
              }}
            />
          )}

          {currentView === 'job-detail' && selectedJob && (
            <PublicJobDetailView 
              job={selectedJob} 
              onBack={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  navigateTo('jobs');
                }
              }}
              onApplicationSubmitted={handleApplicationSubmitted}
            />
          )}

          {currentView === 'pipeline' && (
            <PipelineKanbanView
              applications={applications}
              onSelectApplication={handleSelectApplication}
              onStatusUpdated={handleStatusUpdated}
            />
          )}

          {currentView === 'applications' && (
            <ApplicationListView 
              applications={applications} 
              onSelectApplication={handleSelectApplication}
              onNavigateToPipeline={() => navigateTo('pipeline')}
            />
          )}

          {currentView === 'application-detail' && selectedApplication && (
            <ApplicationDetailView 
              application={selectedApplication} 
              onBack={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  navigateTo('applications');
                }
              }}
              onStatusUpdated={handleStatusUpdated}
            />
          )}

          {currentView === 'interviews' && (
            <InterviewScheduleView
              applications={applications}
              onSelectApplication={handleSelectApplication}
            />
          )}

          {currentView === 'departments' && (
            <DepartmentView
              jobs={jobs}
              onNavigateToJobs={() => navigateTo('jobs')}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              serverStatus={serverStatus}
            />
          )}

          {currentView === 'users' && isAdmin && (
            <UserManagementView
              currentUser={currentUser}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t py-5 text-center text-xs"
          style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)', color: 'var(--c-text-faint)' }}>
          <p style={{ color: 'var(--c-text-lo)' }}>Hệ thống Quản lý Tuyển dụng Tích hợp AI (Smart ATS Pro)</p>
          <p className="mt-1 font-mono text-[11px]">
            Node.js Express + Prisma ORM + SQLite + Google Gemini AI | React Vite + Tailwind CSS v4
          </p>
        </footer>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        user={currentUser}
      />

      {/* Floating AI Recruitment Chatbot */}
      <AIChatBot theme={theme} />
    </div>
  );
}

export default App;
