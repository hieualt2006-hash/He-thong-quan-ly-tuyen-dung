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
  Filter,
  UserCheck,
  Kanban,
  Table,
  Download
} from 'lucide-react';

function ApplicationListView({ applications = [], onSelectApplication, onNavigateToPipeline }) {
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

  const handleExportCSV = () => {
    if (applications.length === 0) {
      alert('Chưa có dữ liệu ứng viên để xuất file!');
      return;
    }
    const headers = 'ID,Full Name,Email,Job,Department,Match Score,Status\n';
    const rows = applications.map(a => 
      `"${a.id}","${a.candidate?.fullName || ''}","${a.candidate?.email || ''}","${a.job?.title || ''}","${a.job?.department || ''}","${a.matchScore || 0}","${a.status}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SmartATS_Candidates_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Hồ Sơ Ứng Viên (Candidates & Applications)</h2>
          <p className="text-sm text-slate-400">Danh sách toàn bộ hồ sơ ứng tuyển và kết quả bóc tách AI Match Score</p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold px-3.5 py-2 rounded-xl text-xs border border-slate-800 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất CSV</span>
          </button>

          {/* Switch to Kanban */}
          {onNavigateToPipeline && (
            <button
              onClick={onNavigateToPipeline}
              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-md shadow-orange-500/20"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Dạng Bảng Theo Dõi</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Status Filters (OrangeHRM & Zoho Bar) */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên ứng viên, email hoặc tên công việc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-orange-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 shrink-0 font-medium"
          >
            <option value="ALL">Tất cả trạng thái ({applications.length})</option>
            <option value="Applied">Applied (Đã nộp)</option>
            <option value="Interview">Interview (Mời phỏng vấn)</option>
            <option value="Hired">Hired (Đã nhận)</option>
            <option value="Rejected">Rejected (Từ chối)</option>
          </select>
        </div>
      </div>

      {/* Applications Table (Zoho Recruiter Style) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
            <Users className="w-8 h-8 text-slate-600" />
            <span>Không tìm thấy hồ sơ ứng viên nào phù hợp với bộ lọc.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Ứng Viên</th>
                  <th className="px-6 py-4">Vị Trí Tuyển Dụng</th>
                  <th className="px-6 py-4">AI Match Score</th>
                  <th className="px-6 py-4">Trạng Thái HR</th>
                  <th className="px-6 py-4 text-right">Chi Tiết AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center font-bold text-orange-300 text-sm shrink-0">
                          {app.candidate?.fullName ? app.candidate.fullName.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <div className="font-bold text-white text-base">{app.candidate?.fullName || 'Ứng viên'}</div>
                          <div className="text-xs text-slate-400">{app.candidate?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-orange-300">{app.job?.title || 'Job'}</div>
                      <div className="text-xs text-slate-500">{app.job?.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      {app.matchScore !== null && app.matchScore !== undefined ? (
                        <div className="flex items-center gap-3">
                          <div>
                            <span className={`text-base font-extrabold font-mono ${
                              app.matchScore >= 80 ? 'text-emerald-400' : app.matchScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                            }`}>
                              {app.matchScore}%
                            </span>
                            <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                              <div 
                                className={`h-full rounded-full ${
                                  app.matchScore >= 80 ? 'bg-emerald-400' : app.matchScore >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                                }`}
                                style={{ width: `${app.matchScore}%` }}
                              />
                            </div>
                          </div>

                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            app.matchScore >= 80 ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : app.matchScore >= 60 ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                          }`}>
                            {app.matchScore >= 80 ? 'High Match' : app.matchScore >= 60 ? 'Medium Match' : 'Low Match'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono">Chờ AI Phân Tích</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                        app.status === 'Hired' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                        app.status === 'Interview' ? 'bg-orange-500/10 text-orange-300 border-orange-500/30' :
                        app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' :
                        'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onSelectApplication(app)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-white bg-orange-500/10 hover:bg-orange-500 px-3.5 py-1.5 rounded-xl border border-orange-500/30 transition-all shadow-sm active:scale-95"
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


