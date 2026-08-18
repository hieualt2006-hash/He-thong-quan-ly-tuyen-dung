import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  BrainCircuit, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Target, 
  Award,
  PieChart,
  Layers
} from 'lucide-react';

function AnalyticsView({ jobs = [], applications = [] }) {
  const totalJobs = jobs.length;
  const totalApps = applications.length;
  const hiredCount = applications.filter(a => a.status === 'Hired').length;
  const interviewCount = applications.filter(a => a.status === 'Interview').length;

  const highMatch = applications.filter(a => (a.matchScore || 0) >= 80).length;
  const mediumMatch = applications.filter(a => (a.matchScore || 0) >= 60 && (a.matchScore || 0) < 80).length;
  const lowMatch = applications.filter(a => a.matchScore !== null && a.matchScore !== undefined && a.matchScore < 60).length;

  const avgMatchScore = totalApps > 0 
    ? Math.round(applications.reduce((acc, a) => acc + (a.matchScore || 0), 0) / totalApps)
    : 0;

  // Mock Skill Gap frequency count
  const skillGaps = [
    { name: 'Docker / Kubernetes', count: 12, percent: 75, category: 'DevOps & Cloud' },
    { name: 'Google Gemini / LLM Prompting', count: 9, percent: 60, category: 'AI & Data' },
    { name: 'Prisma ORM & PostgreSQL', count: 7, percent: 45, category: 'Backend' },
    { name: 'Tailwind CSS v4 & UI UX', count: 5, percent: 30, category: 'Frontend' },
    { name: 'Automated CI/CD Pipeline', count: 4, percent: 25, category: 'Infrastructure' }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Báo Cáo & Phân Tích Tuyển Dụng AI (ATS Analytics)</h2>
            <span className="bg-orange-500/10 text-orange-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-orange-500/20">
              Báo Cáo Tuyển Dụng
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Tổng quan chỉ số hiệu suất tuyển dụng, chất lượng hồ sơ ứng viên và bản đồ khoảng cách kỹ năng (Skill Gap)</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Thời gian:</span>
          <select className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500">
            <option>Quý này (Q3 2026)</option>
            <option>Tháng này</option>
            <option>Cả năm 2026</option>
          </select>
        </div>
      </div>

      {/* Top 4 KPI Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Điểm AI Match Trung Bình', value: `${avgMatchScore}%`, sub: 'Chất lượng CV đầu vào', icon: BrainCircuit, color: 'from-orange-500 to-amber-600' },
          { title: 'Tỉ Lệ Trúng Tuyển (Hiring Rate)', value: `${totalApps > 0 ? Math.round((hiredCount / totalApps) * 100) : 0}%`, sub: `${hiredCount} trên tổng số ${totalApps} hồ sơ`, icon: Award, color: 'from-emerald-500 to-teal-600' },
          { title: 'Tốc Độ Sàng Lọc (Time-to-Screen)', value: '< 3 giây', sub: 'Tự động bởi Gemini AI Flash', icon: Clock, color: 'from-indigo-500 to-purple-600' },
          { title: 'Vị Trí Đang Mở (Open Jobs)', value: totalJobs, sub: 'Nhu cầu nhân sự các phòng ban', icon: Briefcase, color: 'from-amber-500 to-orange-600' }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{kpi.title}</p>
                  <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{kpi.value}</h3>
                  <p className="text-xs text-slate-400 mt-1">{kpi.sub}</p>
                </div>
                <div className={`p-3 rounded-2xl bg-gradient-to-tr ${kpi.color} text-white shadow-md shadow-orange-500/10`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: AI Match Score Distribution */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-5">
          <div className="border-b border-slate-800/80 pb-4">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-400" />
              Phân Phối Điểm Tương Thích AI (Match Score Funnel)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Thống kê số lượng hồ sơ theo từng dải điểm phù hợp</p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-emerald-400">Xuất Sắc (Match ≥ 80%)</span>
                <span className="text-white font-mono">{highMatch} hồ sơ ({totalApps > 0 ? Math.round((highMatch/totalApps)*100) : 0}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${totalApps > 0 ? (highMatch/totalApps)*100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-amber-400">Khá Phù Hợp (Match 60 - 79%)</span>
                <span className="text-white font-mono">{mediumMatch} hồ sơ ({totalApps > 0 ? Math.round((mediumMatch/totalApps)*100) : 0}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${totalApps > 0 ? (mediumMatch/totalApps)*100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-rose-400">Cần Cân Nhắc (Match &lt; 60%)</span>
                <span className="text-white font-mono">{lowMatch} hồ sơ ({totalApps > 0 ? Math.round((lowMatch/totalApps)*100) : 0}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${totalApps > 0 ? (lowMatch/totalApps)*100 : 0}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300">
            ✅ <strong>Nhận định:</strong> Điểm AI Match trung bình ở mức <strong>{avgMatchScore}%</strong> cho thấy nguồn ứng viên tiếp cận đúng với JD đăng tuyển.
          </div>
        </div>

        {/* Chart 2: Skill Gap Heatmap */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-5">
          <div className="border-b border-slate-800/80 pb-4">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              Bản Đồ Kỹ Năng Ứng Viên Còn Thiếu (Top Skill Gaps)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Các kỹ năng trong JD mà ứng viên bị thiếu nhiều nhất qua phân tích CV</p>
          </div>

          <div className="flex flex-col gap-3">
            {skillGaps.map((skill, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-200">{skill.name}</span>
                  <span className="text-rose-400 font-mono font-bold">{skill.percent}% thiếu</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full" style={{ width: `${skill.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300">
            💡 <strong>Khuyến nghị đào tạo:</strong> Khi onboard ứng viên mới, bộ phận HR nên chuẩn bị thêm tài liệu onboarding về Docker và Gemini AI.
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsView;
