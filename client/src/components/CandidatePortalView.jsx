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
  Filter
} from 'lucide-react';

function CandidatePortalView({ 
  jobs = [], 
  onSelectJob, 
  onOpenApplyModal, 
  onOpenLogin,
  onOpenChatBot 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  // Distinct departments
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Public Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-amber-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 text-white font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-white">Smart<span className="text-orange-500">ATS</span></span>
                <span className="bg-orange-500/10 text-orange-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-orange-500/20">CAREERS</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Cổng Tuyển Dụng & Hướng Nghiệp AI</span>
            </div>
          </div>

          {/* Navigation Links & Action Button */}
          <div className="flex items-center gap-4">
            {/* Prominent Login button for HR/Admin at top right */}
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xl shadow-orange-500/25 border border-orange-400/30 active:scale-95 transition-all group"
            >
              <Lock className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
              <span>Đăng nhập với vai trò HR/Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-850 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950">
        {/* Glow circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hệ Thống Tuyển Dụng & Sàng Lọc Hồ Sơ Thông Minh</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Khám Phá Cơ Hội Nghề Nghiệp <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-indigo-400">
              Cùng Công Nghệ Đột Phá
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Ứng tuyển nhanh chóng chỉ bằng 1 thao tác tải CV. Trí tuệ nhân tạo sẽ tự động phân tích điểm tương thích và gợi ý định hướng phỏng vấn phù hợp nhất.
          </p>

          {/* Search Box in Hero */}
          <div className="mt-8 max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm vị trí tuyển dụng, kỹ năng (React, Node, Java...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-0 pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 rounded-xl px-3.5 py-3 focus:outline-none focus:border-orange-500 w-full sm:w-auto"
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
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-orange-400" />
              <span>Vị Trí Đang Tuyển Dụng</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Hiển thị <span className="text-orange-400 font-bold">{filteredJobs.length}</span> vị trí tuyển dụng phù hợp
            </p>
          </div>

          {/* Department Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {departments.map((dept, i) => (
              <button
                key={i}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedDept === dept
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
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
              className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center text-orange-400 font-bold shrink-0">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {job.status || 'Đang tuyển'}
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-white group-hover:text-orange-400 transition-colors line-clamp-1 mb-2">
                  {job.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {job.department}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-amber-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    {job.salaryRange || 'Thỏa thuận'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 mb-5 leading-relaxed">
                  {job.description}
                </p>

                {/* Requirement Tags */}
                {job.requirements && (
                  <div className="mb-6 flex flex-wrap gap-1.5">
                    {job.requirements.split(',').slice(0, 3).map((req, rIdx) => (
                      <span key={rIdx} className="bg-slate-950 border border-slate-800 text-[10px] text-slate-300 px-2 py-0.5 rounded-lg">
                        {req.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectJob(job)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  Xem Chi Tiết
                </button>
                <button
                  onClick={() => onOpenApplyModal(job)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ứng Tuyển</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-3xl">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">Không tìm thấy vị trí phù hợp</h4>
            <p className="text-xs text-slate-400 mt-1">Hãy thử tìm kiếm với từ khóa hoặc phòng ban khác</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">SmartATS Recruitment Platform</span>
            <span>•</span>
            <span>Trí tuệ nhân tạo tích hợp ATS</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onOpenLogin} className="hover:text-orange-400 transition-colors flex items-center gap-1 font-semibold text-slate-400">
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
