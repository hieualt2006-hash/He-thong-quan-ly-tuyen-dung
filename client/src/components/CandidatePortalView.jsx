import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Building2, 
  DollarSign, 
  MapPin, 
  Sparkles, 
  ChevronRight, 
  Send, 
  Bot, 
  Shield, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  TrendingUp,
  Layers,
  Award,
  Clock,
  Filter,
  Sun,
  Moon
} from 'lucide-react';

function CandidatePortalView({ 
  jobs = [], 
  onSelectJob, 
  onOpenApplyModal, 
  onOpenLogin,
  onOpenChatBot,
  theme = 'dark',
  onToggleTheme
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = ['All', ...new Set(jobs.map(j => j.department).filter(Boolean))];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requirements?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || job.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: 'var(--bg-app)', color: 'var(--text-main)' }}>
      {/* Top Public Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: 'var(--bg-header)', borderColor: 'var(--border-main)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md text-white font-black"
              style={{ background: '#f59e0b' }}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight" style={{ color: 'var(--text-heading)' }}>
                  Smart<span style={{ color: 'var(--accent)' }}>ATS</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }}>
                  CAREERS
                </span>
              </div>
              <span className="text-[10px] font-medium" style={{ color: 'var(--text-faint)' }}>Cổng Tuyển Dụng & Hướng Nghiệp AI</span>
            </div>
          </div>

          {/* Login Button */}
          <div className="flex items-center gap-2">
            {/* Dark / Light Theme Toggle */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
                className="p-2 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent-border)' }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                ) : (
                  <Moon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                )}
              </button>
            )}

            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 text-white font-bold px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm active:scale-95 transition-all"
              style={{ background: '#f59e0b', boxShadow: '0 2px 12px -2px rgba(245,158,11,0.35)' }}
            >
              <Lock className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Đăng nhập HR/Admin</span>
              <span className="sm:hidden">HR Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        {/* Subtle glow orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'transparent' }} />
        <div className="absolute top-1/3 right-10 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'transparent' }} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-6 border"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hệ Thống Tuyển Dụng & Sàng Lọc Hồ Sơ Thông Minh</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight" style={{ color: 'var(--text-heading)' }}>
            Khám Phá Cơ Hội Nghề Nghiệp <br className="hidden sm:block" />
            <span style={{ color: 'var(--accent)' }}>
              Cùng Công Nghệ Đột Phá
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Ứng tuyển nhanh chóng chỉ bằng 1 thao tác tải CV. Trí tuệ nhân tạo sẽ tự động phân tích điểm tương thích và gợi ý định hướng phỏng vấn phù hợp nhất.
          </p>

          {/* Search Box in Hero */}
          <div className="mt-8 max-w-3xl mx-auto p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col sm:flex-row items-center gap-2 border"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-main)' }}>
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-faint)' }} />
              <input
                type="text"
                placeholder="Tìm kiếm vị trí tuyển dụng, kỹ năng (React, Node, Java...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-0 pl-11 pr-4 py-3 text-sm focus:outline-none"
                style={{ color: 'var(--text-heading)', caretColor: 'var(--accent)' }}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="text-xs font-semibold rounded-xl px-3.5 py-3 focus:outline-none w-full sm:w-auto border"
                style={{ background: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
              >
                {departments.map((dept, i) => (
                  <option key={i} value={dept}>
                    {dept === 'All' ? 'Tất cả phòng ban' : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Jobs Listing Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* Filter bar & stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
              <Briefcase className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              <span>Vị Trí Đang Tuyển Dụng</span>
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Hiển thị <span className="font-bold" style={{ color: 'var(--accent)' }}>{filteredJobs.length}</span> vị trí tuyển dụng phù hợp
            </p>
          </div>

          {/* Department Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {departments.map((dept, i) => (
              <button
                key={i}
                onClick={() => setSelectedDept(dept)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border"
                style={selectedDept === dept
                  ? { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)', boxShadow: '0 2px 8px -2px rgba(245,158,11,0.30)' }
                  : { background: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }
                }
              >
                {dept === 'All' ? 'Tất cả' : dept}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div 
              key={job.id}
              className="border rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between group ats-card"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-border)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl border flex items-center justify-center shrink-0"
                    style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent-border)', color: 'var(--accent)' }}>
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border"
                    style={{ background: 'rgba(52,211,153,0.10)', color: '#34d399', borderColor: 'rgba(52,211,153,0.22)' }}>
                    {job.status || 'Đang tuyển'}
                  </span>
                </div>

                <h3 className="font-extrabold text-base line-clamp-1 mb-2 transition-colors group-hover:underline decoration-dotted"
                  style={{ color: 'var(--text-heading)' }}>
                  {job.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" style={{ color: 'var(--text-faint)' }} />
                    {job.department}
                  </span>
                  <span className="flex items-center gap-1 font-semibold" style={{ color: '#fbbf24' }}>
                    <DollarSign className="w-3.5 h-3.5" />
                    {job.salaryRange || 'Thỏa thuận'}
                  </span>
                </div>

                <p className="text-xs line-clamp-3 mb-5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {job.description}
                </p>

                {/* Requirement Tags */}
                {job.requirements && (
                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {job.requirements.split(',').slice(0, 3).map((req, rIdx) => (
                      <span key={rIdx} className="text-[10px] px-2 py-0.5 rounded-lg border"
                        style={{ background: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
                        {req.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  onClick={() => onSelectJob(job)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors border"
                  style={{ background: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-heading)'; e.currentTarget.style.borderColor = 'var(--border-main)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                  Xem Chi Tiết
                </button>
                <button
                  onClick={() => onOpenApplyModal(job)}
                  className="flex-1 py-2.5 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  style={{ background: '#f59e0b', boxShadow: '0 2px 10px -2px rgba(245,158,11,0.30)' }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ứng Tuyển</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16 rounded-3xl border"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
            <Briefcase className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)', opacity: 0.5 }} />
            <h4 className="text-base font-bold" style={{ color: 'var(--text-heading)' }}>Không tìm thấy vị trí phù hợp</h4>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Hãy thử tìm kiếm với từ khóa hoặc phòng ban khác</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-8" style={{ background: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: 'var(--text-faint)' }}>
          <div className="flex items-center gap-2">
            <span className="font-bold" style={{ color: 'var(--text-muted)' }}>SmartATS Recruitment Platform</span>
            <span>•</span>
            <span>Trí tuệ nhân tạo tích hợp ATS</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onOpenLogin} className="transition-colors flex items-center gap-1 font-semibold"
              style={{ color: 'var(--text-faint)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-faint)'; }}>
              <Lock className="w-3.5 h-3.5" />
              <span>HR/Admin Portal</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default CandidatePortalView;
