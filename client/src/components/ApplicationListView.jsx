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
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-heading)' }}>Hồ Sơ Ứng Viên (Candidates & Applications)</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Danh sách toàn bộ hồ sơ ứng tuyển và kết quả bóc tách AI Match Score</p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 font-semibold px-3.5 py-2 rounded-xl text-xs border transition-colors"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-main)', color: 'var(--text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-heading)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất CSV</span>
          </button>

          {/* Switch to Kanban */}
          {onNavigateToPipeline && (
            <button
              onClick={onNavigateToPipeline}
              className="flex items-center gap-1.5 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 2px 10px -2px rgba(245,158,11,0.30)' }}
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
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-faint)' }} />
          <input
            type="text"
            placeholder="Tìm theo tên ứng viên, email hoặc tên công việc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none transition-colors border"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-main)', color: 'var(--text-heading)', caretColor: 'var(--accent)' }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent-border)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-main)'; }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl px-4 py-3 text-sm focus:outline-none shrink-0 font-medium border"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-main)', color: 'var(--text-heading)' }}
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
      <div className="border rounded-3xl overflow-hidden shadow-lg"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center text-sm flex flex-col items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <Users className="w-8 h-8" style={{ color: 'var(--text-faint)', opacity: 0.5 }} />
            <span>Không tìm thấy hồ sơ ứng viên nào phù hợp với bộ lọc.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" style={{ color: 'var(--text-main)' }}>
              <thead className="text-[11px] font-bold uppercase tracking-wider border-b"
                style={{ background: 'var(--bg-card-subtle)', color: 'var(--text-faint)', borderColor: 'var(--border-subtle)' }}>
                <tr>
                  <th className="px-6 py-4">Ứng Viên</th>
                  <th className="px-6 py-4">Vị Trí Tuyển Dụng</th>
                  <th className="px-6 py-4">AI Match Score</th>
                  <th className="px-6 py-4">Trạng Thái HR</th>
                  <th className="px-6 py-4 text-right">Chi Tiết AI</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.id} className="border-b transition-colors" style={{ borderColor: 'var(--border-subtle)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-subtle)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0"
                          style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent-border)', color: 'var(--accent)' }}>
                          {app.candidate?.fullName ? app.candidate.fullName.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <div className="font-bold text-base" style={{ color: 'var(--text-heading)' }}>{app.candidate?.fullName || 'Ứng viên'}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{app.candidate?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold" style={{ color: 'var(--accent)' }}>{app.job?.title || 'Job'}</div>
                      <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{app.job?.department}</div>
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
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all active:scale-95"
                        style={{ background: 'var(--accent-soft)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.18)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-soft)'; }}
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


