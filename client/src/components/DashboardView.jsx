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
  Plus
} from 'lucide-react';

function DashboardView({ jobs = [], applications = [], onNavigate, onOpenCreateJob }) {
  const totalJobs = jobs.length;
  const totalApps = applications.length;
  const interviewedApps = applications.filter(a => a.status === 'Interview').length;
  const hiredApps = applications.filter(a => a.status === 'Hired').length;

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/60 border border-indigo-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Google Gemini 1.5 Flash Integrated
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hệ Thống Quản Lý Tuyển Dụng AI (ATS)
            </h2>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Tự động bóc tách CV bằng PDF-Parse, chấm điểm tương thích AI Match Score, phát hiện kỹ năng thiếu và khởi tạo bộ câu hỏi phỏng vấn thông minh.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCreateJob}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Đăng Tin Tuyển Dụng</span>
            </button>
            <button
              onClick={() => onNavigate('applications')}
              className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2.5 rounded-xl text-sm border border-slate-700 transition-all"
            >
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Xem Đơn Ứng Tuyển</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: 'Tin Tuyển Dụng', value: totalJobs, sub: 'Đang mở đăng tuyển', icon: Briefcase, color: 'from-blue-500 to-indigo-600' },
          { title: 'Tổng Đơn Ứng Tuyển', value: totalApps, sub: 'Ứng viên đã nộp', icon: Users, color: 'from-indigo-500 to-purple-600' },
          { title: 'Lịch Phỏng Vấn', value: interviewedApps, sub: 'Đã thông qua vòng AI', icon: Clock, color: 'from-amber-500 to-orange-600' },
          { title: 'Đã Tuyển Dụng', value: hiredApps, sub: 'Ứng viên xuất sắc', icon: FileCheck2, color: 'from-emerald-500 to-teal-600' }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
                  <h3 className="text-3xl font-black text-white mt-1.5 font-mono tracking-tight">{card.value}</h3>
                  <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Applications Preview */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-5 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-white">Ứng Viên Mới Phân Tích AI</h3>
            <p className="text-xs text-slate-400">Danh sách hồ sơ ứng tuyển mới nhất trên hệ thống</p>
          </div>
          <button 
            onClick={() => onNavigate('applications')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            Xem Tất Cả <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            Chưa có đơn ứng tuyển nào. Vui lòng tạo Tin tuyển dụng và nộp hồ sơ thử nghiệm!
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-800/20 px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 text-sm">
                    {app.candidate?.fullName ? app.candidate.fullName.charAt(0) : 'U'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">{app.candidate?.fullName || 'Ứng viên'}</h4>
                    <p className="text-xs text-slate-400">{app.job?.title || 'Công việc'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {app.matchScore !== null && (
                    <div className="text-right">
                      <span className={`text-sm font-bold font-mono ${
                        app.matchScore >= 80 ? 'text-emerald-400' : app.matchScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {app.matchScore}% Match
                      </span>
                    </div>
                  )}
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardView;
