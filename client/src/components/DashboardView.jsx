import React from 'react';
import { 
  Briefcase, 
  Users, 
  FileCheck2, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  BrainCircuit, 
  Plus, 
  Zap, 
  Target, 
  Award, 
  CheckCircle2, 
  ChevronRight,
  Kanban,
  Calendar,
  Building2,
  BarChart3,
  Sliders
} from 'lucide-react';

function DashboardView({ jobs = [], applications = [], onNavigate, onOpenCreateJob }) {
  const totalJobs = jobs.length;
  const totalApps = applications.length;
  const interviewedApps = applications.filter(a => a.status === 'Interview').length;
  const hiredApps = applications.filter(a => a.status === 'Hired').length;

  const highMatchApps = applications.filter(a => (a.matchScore || 0) >= 80).length;
  const mediumMatchApps = applications.filter(a => (a.matchScore || 0) >= 60 && (a.matchScore || 0) < 80).length;
  const lowMatchApps = applications.filter(a => a.matchScore !== null && a.matchScore !== undefined && a.matchScore < 60).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-lg border"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-main)',
        }}>
        {/* Subtle glow orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'transparent', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: 'transparent', transform: 'translateY(40%)' }} />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }}>
              <Sparkles className="w-3 h-3" />
              <span>AI-Powered Recruitment</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-heading)' }}>
              Hệ Thống Quản Lý Tuyển Dụng AI
            </h2>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Tự động bóc tách CV bằng <code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>pdf-parse</code>, chấm điểm tương thích AI Match Score, theo dõi tiến trình tuyển dụng và tự động sinh câu hỏi phỏng vấn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenCreateJob}
              className="flex items-center gap-2 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-all active:scale-95"
              style={{ background: '#f59e0b', boxShadow: '0 4px 16px -4px rgba(245,158,11,0.40)' }}
            >
              <Plus className="w-4 h-4" />
              <span>Đăng Job Mới</span>
            </button>
            <button
              onClick={() => onNavigate('pipeline')}
              className="flex items-center gap-2 font-semibold px-4 py-2.5 rounded-2xl text-xs border transition-all active:scale-95"
              style={{ background: 'var(--bg-card-subtle)', borderColor: 'var(--border-main)', color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-heading)'; e.currentTarget.style.borderColor = 'var(--border-main)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <Kanban className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span>Bảng Theo Dõi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Module Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Tin Tuyển Dụng', view: 'jobs',         icon: Briefcase,  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.18)' },
          { label: 'Bảng Theo Dõi',  view: 'pipeline',     icon: Kanban,     color: '#818cf8', bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.18)' },
          { label: 'Hồ Sơ Ứng Viên', view: 'applications', icon: Users,      color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.18)' },
          { label: 'Lịch Phỏng Vấn', view: 'interviews',   icon: Calendar,   color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.18)' },
          { label: 'Báo Cáo AI',     view: 'analytics',    icon: BarChart3,  color: '#c084fc', bg: 'rgba(192,132,252,0.08)', border: 'rgba(192,132,252,0.18)' },
          { label: 'Cơ Cấu Phòng Ban',view: 'departments', icon: Building2,  color: '#38bdf8', bg: 'rgba(56,189,248,0.08)',  border: 'rgba(56,189,248,0.18)' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onNavigate(item.view)}
              className="rounded-2xl p-3 flex flex-col items-center justify-center gap-2 transition-all group ats-card border"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = item.border; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
            >
              <div className="p-2 rounded-xl border group-hover:scale-110 transition-transform"
                style={{ background: item.bg, borderColor: item.border, color: item.color }}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold truncate w-full text-center transition-colors"
                style={{ color: 'var(--text-muted)' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Metrics Cards Grid (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: 'Tin Tuyển Dụng', value: totalJobs,       sub: 'Đang mở đăng tuyển',       icon: Briefcase,  gradient: '#f59e0b', badge: 'Active' },
          { title: 'Đơn Ứng Tuyển', value: totalApps,        sub: 'Đã bóc tách & phân tích',   icon: Users,      gradient: '#6366f1', badge: 'Total' },
          { title: 'Mời Phỏng Vấn', value: interviewedApps,  sub: 'Thông qua vòng AI',         icon: Clock,      gradient: '#34d399', badge: 'Shortlisted' },
          { title: 'Đã Tuyển Dụng', value: hiredApps,        sub: 'Ứng viên xuất sắc',         icon: FileCheck2, gradient: '#2563eb', badge: 'Hired' }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="zoho-card border rounded-2xl p-5 flex flex-col justify-between"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>{card.title}</p>
                  <h3 className="text-3xl font-extrabold mt-2 font-mono tracking-tight" style={{ color: 'var(--text-heading)' }}>{card.value}</h3>
                </div>
                <div className="p-3 rounded-2xl text-white shadow-md" style={{ background: card.gradient }}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
                <span>{card.sub}</span>
                <span className="font-semibold flex items-center gap-0.5 text-[11px]" style={{ color: 'var(--accent)' }}>
                  <TrendingUp className="w-3 h-3" /> {card.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Match Stats & Recent Candidate Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Match Score Distribution */}
        <div className="border rounded-2xl p-6 flex flex-col justify-between gap-5"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
              <BrainCircuit className="w-4 h-4" />
              Thống Kê AI Score
            </div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>Phân Loại Đánh Giá Ứng Viên</h3>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Tỉ lệ độ phù hợp CV so với Yêu cầu công việc</p>
          </div>

          <div className="flex flex-col gap-4">
            {/* High Match */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1.5" style={{ color: '#34d399' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: '#34d399' }} />
                  Xuất Sắc (Match ≥ 80%)
                </span>
                <span className="font-mono" style={{ color: 'var(--text-heading)' }}>{highMatchApps} hồ sơ</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-card-subtle)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalApps > 0 ? (highMatchApps / totalApps) * 100 : 0}%`, background: '#34d399' }} />
              </div>
            </div>

            {/* Medium Match */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1.5" style={{ color: '#fbbf24' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: '#fbbf24' }} />
                  Khá Phù Hợp (Match 60-79%)
                </span>
                <span className="font-mono" style={{ color: 'var(--text-heading)' }}>{mediumMatchApps} hồ sơ</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-card-subtle)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalApps > 0 ? (mediumMatchApps / totalApps) * 100 : 0}%`, background: '#fbbf24' }} />
              </div>
            </div>

            {/* Low Match */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1.5" style={{ color: '#f87171' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: '#f87171' }} />
                  Cần Cân Nhắc (Match &lt; 60%)
                </span>
                <span className="font-mono" style={{ color: 'var(--text-heading)' }}>{lowMatchApps} hồ sơ</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-card-subtle)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalApps > 0 ? (lowMatchApps / totalApps) * 100 : 0}%`, background: '#ef4444' }} />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border text-xs leading-relaxed"
            style={{ background: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            <p className="flex items-center gap-1.5 font-medium mb-1" style={{ color: 'var(--text-main)' }}>
              <Zap className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} /> AI tự động đề xuất:
            </p>
            Chỉ ưu tiên mời phỏng vấn các hồ sơ có mức <strong>Match ≥ 60%</strong> để tối ưu thời gian tuyển dụng của HR.
          </div>
        </div>

        {/* Right Column: Recent Applications Preview */}
        <div className="lg:col-span-2 border rounded-2xl p-6 flex flex-col justify-between gap-5"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex justify-between items-center border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
            <div>
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-heading)' }}>Ứng Viên Mới Phân Tích AI</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Hồ sơ nộp mới nhất và điểm AI Match Score tương ứng</p>
            </div>
            <button 
              onClick={() => onNavigate('applications')}
              className="text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl border transition-all"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-soft)'; }}
            >
              <span>Xem Tất Cả</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12 text-sm flex flex-col items-center gap-2" style={{ color: 'var(--text-faint)' }}>
              <Users className="w-8 h-8" style={{ opacity: 0.4 }} />
              <span>Chưa có đơn ứng tuyển nào. Vui lòng tạo Tin tuyển dụng và nộp hồ sơ thử nghiệm!</span>
            </div>
          ) : (
            <div>
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="py-3 flex items-center justify-between gap-4 px-3 rounded-xl transition-colors"
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-subtle)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0"
                      style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent-border)', color: 'var(--accent)' }}>
                      {app.candidate?.fullName ? app.candidate.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm" style={{ color: 'var(--text-heading)' }}>{app.candidate?.fullName || 'Ứng viên'}</h4>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{app.job?.title || 'Công việc'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {app.matchScore !== null && app.matchScore !== undefined ? (
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono" style={{
                          color: app.matchScore >= 80 ? '#34d399' : app.matchScore >= 60 ? '#fbbf24' : '#f87171'
                        }}>
                          {app.matchScore}%
                        </div>
                        <div className="w-16 h-1.5 rounded-full overflow-hidden mt-1" style={{ background: 'var(--bg-card-subtle)' }}>
                          <div className="h-full rounded-full" style={{
                            width: `${app.matchScore}%`,
                            background: app.matchScore >= 80 ? '#34d399' : app.matchScore >= 60 ? '#fbbf24' : '#f87171'
                          }} />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--text-faint)' }}>Chờ AI</span>
                    )}

                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border"
                      style={{
                        ...(app.status === 'Hired'
                          ? { background: 'rgba(52,211,153,0.10)', color: '#34d399', borderColor: 'rgba(52,211,153,0.25)' }
                          : app.status === 'Interview'
                          ? { background: 'var(--accent-soft)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }
                          : app.status === 'Rejected'
                          ? { background: 'rgba(248,113,113,0.10)', color: '#f87171', borderColor: 'rgba(248,113,113,0.25)' }
                          : { background: 'var(--bg-card-subtle)', color: 'var(--text-muted)', borderColor: 'var(--border-subtle)' })
                      }}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
