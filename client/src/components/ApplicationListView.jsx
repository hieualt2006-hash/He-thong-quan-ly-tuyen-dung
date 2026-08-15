import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Sparkles, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

function ApplicationListView({ applications = [], onSelectApplication }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredApps = applications.filter(app => {
    const matchesSearch = (
      (app.candidate?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.candidate?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.job?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Hồ Sơ Ứng Viên (Applications)</h2>
          <p className="text-sm text-slate-400">Danh sách đơn ứng tuyển đã nộp và kết quả phân tích AI Match Score</p>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên ứng viên, email hoặc tên công việc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 shrink-0"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="Applied">Applied (Đã nộp)</option>
            <option value="Interview">Interview (Mời phỏng vấn)</option>
            <option value="Hired">Hired (Đã nhận)</option>
            <option value="Rejected">Rejected (Từ chối)</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Không tìm thấy hồ sơ ứng viên nào phù hợp với bộ lọc.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Ứng Viên</th>
                  <th className="px-6 py-4">Vị Trí Tuyển Dụng</th>
                  <th className="px-6 py-4">AI Match Score</th>
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4 text-right">Chi Tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-base">{app.candidate?.fullName || 'Ứng viên'}</div>
                      <div className="text-xs text-slate-400">{app.candidate?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-indigo-300">{app.job?.title || 'Job'}</div>
                      <div className="text-xs text-slate-500">{app.job?.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      {app.matchScore !== null && app.matchScore !== undefined ? (
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-black font-mono ${
                            app.matchScore >= 80 ? 'text-emerald-400' : app.matchScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {app.matchScore}%
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            app.matchScore >= 80 ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : app.matchScore >= 60 ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                          }`}>
                            {app.matchScore >= 80 ? 'High' : app.matchScore >= 60 ? 'Medium' : 'Low'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono">Chờ AI</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                        app.status === 'Hired' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                        app.status === 'Interview' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' :
                        app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' :
                        'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onSelectApplication(app)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-500/30 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem AI Assessment</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationListView;
