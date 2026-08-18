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
      {/* Welcome Hero Banner (OrangeHRM & Zoho Style) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl -mb-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hệ Thống Quản Lý Tuyển Dụng AI
            </h2>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Tự động bóc tách CV bằng <code className="text-orange-300 font-mono">pdf-parse</code>, chấm điểm tương thích AI Match Score, theo dõi tiến trình tuyển dụng và tự động sinh câu hỏi phỏng vấn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenCreateJob}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-4.5 py-2.5 rounded-2xl text-xs transition-all shadow-xl shadow-orange-500/25 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Đăng Job Mới</span>
            </button>
            <button
              onClick={() => onNavigate('pipeline')}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-semibold px-4.5 py-2.5 rounded-2xl text-xs border border-slate-700 transition-all active:scale-95"
            >
              <Kanban className="w-4 h-4 text-orange-400" />
              <span>Bảng Theo Dõi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Module Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Tin Tuyển Dụng', view: 'jobs', icon: Briefcase, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
          { label: 'Bảng Theo Dõi', view: 'pipeline', icon: Kanban, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
          { label: 'Hồ Sơ Ứng Viên', view: 'applications', icon: Users, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
          { label: 'Lịch Phỏng Vấn', view: 'interviews', icon: Calendar, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Báo Cáo AI', view: 'analytics', icon: BarChart3, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
          { label: 'Cơ Cấu Phòng Ban', view: 'departments', icon: Building2, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onNavigate(item.view)}
              className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 transition-all hover:scale-102 group shadow-md"
            >
              <div className={`p-2 rounded-xl border ${item.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors truncate w-full text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Metrics Cards Grid (OrangeHRM KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: 'Tin Tuyển Dụng', value: totalJobs, sub: 'Đang mở đăng tuyển', icon: Briefcase, color: 'from-orange-500 to-amber-600', badge: 'Active' },
          { title: 'Đơn Ứng Tuyển', value: totalApps, sub: 'Đã bóc tách & phân tích', icon: Users, color: 'from-indigo-500 to-purple-600', badge: 'Total' },
          { title: 'Mời Phỏng Vấn', value: interviewedApps, sub: 'Thông qua vòng AI', icon: Clock, color: 'from-amber-500 to-yellow-600', badge: 'Shortlisted' },
          { title: 'Đã Tuyển Dụng', value: hiredApps, sub: 'Ứng viên xuất sắc', icon: FileCheck2, color: 'from-emerald-500 to-teal-600', badge: 'Hired' }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="zoho-card bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
                  </div>
                  <h3 className="text-3xl font-extrabold text-white mt-2 font-mono tracking-tight">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl bg-gradient-to-tr ${card.color} text-white shadow-md shadow-orange-500/10`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
                <span>{card.sub}</span>
                <span className="font-semibold text-orange-400 flex items-center gap-0.5 text-[11px]">
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
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 shadow-lg flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 mb-1">
              <BrainCircuit className="w-4 h-4" />
              Thống Kê AI Score
            </div>
            <h3 className="text-lg font-bold text-white">Phân Loại Đánh Giá Ứng Viên</h3>
            <p className="text-xs text-slate-400 mt-1">Tỉ lệ độ phù hợp CV so với Yêu cầu công việc</p>
          </div>

          <div className="flex flex-col gap-4">
            {/* High Match */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Xuất Sắc (Match ≥ 80%)
                </span>
                <span className="text-white font-mono">{highMatchApps} hồ sơ</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${totalApps > 0 ? (highMatchApps / totalApps) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium Match */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Khá Phù Hợp (Match 60-79%)
                </span>
                <span className="text-white font-mono">{mediumMatchApps} hồ sơ</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${totalApps > 0 ? (mediumMatchApps / totalApps) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Low Match */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  Cần Cân Nhắc (Match &lt; 60%)
                </span>
                <span className="text-white font-mono">{lowMatchApps} hồ sơ</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 to-red-400 rounded-full transition-all duration-500"
                  style={{ width: `${totalApps > 0 ? (lowMatchApps / totalApps) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
            <p className="flex items-center gap-1.5 font-medium text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> AI tự động đề xuất:
            </p>
            Chỉ ưu tiên mời phỏng vấn các hồ sơ có mức <strong>Match ≥ 60%</strong> để tối ưu thời gian tuyển dụng của HR.
          </div>
        </div>

        {/* Right Column: Recent Applications Preview */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 shadow-lg flex flex-col justify-between gap-5">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="font-bold text-lg text-white">Ứng Viên Mới Phân Tích AI</h3>
              <p className="text-xs text-slate-400">Hồ sơ nộp mới nhất và điểm AI Match Score tương ứng</p>
            </div>
            <button 
              onClick={() => onNavigate('applications')}
              className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 bg-orange-500/10 hover:bg-orange-500/20 px-3 py-1.5 rounded-xl border border-orange-500/20 transition-all"
            >
              <span>Xem Tất Cả</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm flex flex-col items-center gap-2">
              <Users className="w-8 h-8 text-slate-600" />
              <span>Chưa có đơn ứng tuyển nào. Vui lòng tạo Tin tuyển dụng và nộp hồ sơ thử nghiệm!</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="py-3 flex items-center justify-between gap-4 hover:bg-slate-800/30 px-3 rounded-xl transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center font-bold text-orange-300 text-sm shrink-0">
                      {app.candidate?.fullName ? app.candidate.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{app.candidate?.fullName || 'Ứng viên'}</h4>
                      <p className="text-xs text-slate-400">{app.job?.title || 'Công việc'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {app.matchScore !== null && app.matchScore !== undefined ? (
                      <div className="text-right">
                        <div className={`text-sm font-bold font-mono ${
                          app.matchScore >= 80 ? 'text-emerald-400' : app.matchScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {app.matchScore}%
                        </div>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                          <div 
                            className={`h-full rounded-full ${
                              app.matchScore >= 80 ? 'bg-emerald-400' : app.matchScore >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                            }`}
                            style={{ width: `${app.matchScore}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Chờ AI</span>
                    )}

                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                      app.status === 'Hired' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                      app.status === 'Interview' ? 'bg-orange-500/10 text-orange-300 border-orange-500/30' :
                      app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' :
                      'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
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


