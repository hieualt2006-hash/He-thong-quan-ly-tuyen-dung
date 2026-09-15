import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Settings, 
  Star, 
  Users, 
  Loader2, 
  Briefcase, 
  X, 
  Trash2, 
  Mail, 
  CheckCircle, 
  List, 
  LayoutGrid, 
  ArrowLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import api from '../services/api';

const DEPARTMENTS = ['Tất cả', 'Management', 'Research & Development', 'Nhân sự', 'Marketing'];

// Demo jobs matching Ảnh 5
const INITIAL_DEMO_JOBS = [
  { 
    id: 'job-1', 
    title: 'Chief Executive Officer', 
    department: 'Management', 
    status: 'Open', 
    toRecruit: 1, 
    email: 'ceo@nhom31.com',
    starred: true,
    description: 'Điều hành chiến lược toàn diện của công ty.',
    requirements: '10+ năm kinh nghiệm quản trị cấp cao.'
  },
  { 
    id: 'job-2', 
    title: 'Consultant', 
    department: 'Management', 
    status: 'Open', 
    toRecruit: 5, 
    email: 'consultant@nhom31.com',
    starred: false,
    description: 'Tư vấn giải pháp chuyển đổi số và quản trị doanh nghiệp.',
    requirements: 'Kỹ năng giao tiếp và thuyết trình xuất sắc.'
  },
  { 
    id: 'job-3', 
    title: 'Experienced Developer', 
    department: 'Research & Development', 
    status: 'Open', 
    toRecruit: 5, 
    email: 'dev@nhom31.com',
    starred: false,
    description: 'Phát triển các module hệ thống ERP và tích hợp AI.',
    requirements: 'React, Node.js, PostgreSQL/SQLite, AI integration.'
  },
  { 
    id: 'job-4', 
    title: 'chạy bộ', 
    department: 'Research & Development', 
    status: 'Open', 
    toRecruit: 1, 
    email: 'cb@nhom31.com',
    starred: false,
    description: 'Vận động viên rèn luyện sức khỏe thể chất công ty.',
    requirements: 'Tinh thần thể thao và dẻo dai.'
  },
];

// Initial applications to test the badge and applicant counts
const INITIAL_DEMO_APPLICATIONS = [
  {
    id: 'app-1',
    jobId: 'job-3', // Experienced Developer
    candidateName: 'Trần Văn Hoàng',
    email: 'hoang.tran@gmail.com',
    phone: '0987654321',
    status: 'Applied',
    matchScore: 92,
    appliedAt: 'Hôm nay'
  },
  {
    id: 'app-2',
    jobId: 'job-3', // Experienced Developer
    candidateName: 'Lê Minh Quân',
    email: 'quan.le@gmail.com',
    phone: '0912345678',
    status: 'Applied',
    matchScore: 88,
    appliedAt: 'Hôm qua'
  },
  {
    id: 'app-3',
    jobId: 'job-2', // Consultant
    candidateName: 'Nguyễn Thuỳ Dung',
    email: 'dung.nguyen@yahoo.com',
    phone: '0933445566',
    status: 'Applied',
    matchScore: 85,
    appliedAt: '2 ngày trước'
  }
];

function JobFormModal({ job, onClose, onSave }) {
  const [form, setForm] = useState({
    title: job?.title || '', 
    department: job?.department || 'Research & Development',
    description: job?.description || '', 
    requirements: job?.requirements || '',
    email: job?.email || '',
    status: job?.status || 'Open',
    toRecruit: job?.toRecruit || 1
  });
  const [saving, setSaving] = useState(false);
  const inputCls = "w-full px-3 py-2 rounded-xl bg-[#0e111d] border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-500";

  const handleSave = async () => {
    if (!form.title || !form.department) return;
    setSaving(true);
    try { 
      await onSave(form, job?.id); 
      onClose(); 
    } finally { 
      setSaving(false); 
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#161a2b] border border-slate-700/80 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-fade-in-scale">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-purple-400" />
            {job ? 'Cấu hình vị trí công việc' : 'Tạo vị trí tuyển dụng mới'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Tên vị trí công việc *</label>
            <input 
              value={form.title} 
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="VD: Experienced Developer..." 
              className={inputCls} 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Phòng ban *</label>
              <select 
                value={form.department} 
                onChange={e => setForm({ ...form, department: e.target.value })}
                className={inputCls}
              >
                {DEPARTMENTS.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Cần tuyển (To recruit)</label>
              <input 
                type="number" 
                min="1" 
                value={form.toRecruit}
                onChange={e => setForm({ ...form, toRecruit: Number(e.target.value) })}
                className={inputCls} 
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Email nhận hồ sơ ứng tuyển</label>
            <input 
              type="email"
              value={form.email} 
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="VD: dev@nhom31.com" 
              className={inputCls} 
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Mô tả công việc</label>
            <textarea 
              rows={3} 
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className={inputCls + " resize-none"} 
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Yêu cầu ứng viên</label>
            <textarea 
              rows={3} 
              value={form.requirements}
              onChange={e => setForm({ ...form, requirements: e.target.value })}
              className={inputCls + " resize-none"} 
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Trạng thái tuyển dụng</label>
            <select 
              value={form.status} 
              onChange={e => setForm({ ...form, status: e.target.value })}
              className={inputCls}
            >
              <option value="Open">Đang tuyển (Open)</option>
              <option value="Draft">Bản nháp (Draft)</option>
              <option value="Closed">Đã đóng (Closed)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2.5 pt-3 border-t border-slate-800">
          <button 
            onClick={onClose} 
            className="flex-1 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 cursor-pointer"
          >
            Hủy
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang lưu...</> : 'Lưu vị trí'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecruitmentView({ jobs: propJobs, applications: propApps }) {
  const [jobs, setJobs] = useState(propJobs?.length ? propJobs : INITIAL_DEMO_JOBS);
  const [applications, setApplications] = useState(propApps?.length ? propApps : INITIAL_DEMO_APPLICATIONS);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('Tất cả');
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [selectedJobApplications, setSelectedJobApplications] = useState(null);

  // Helper calculation for application metrics
  const getJobApplications = (jobId) => applications.filter(a => a.jobId === jobId);
  const newAppsForJob = (jobId) => applications.filter(a => a.jobId === jobId && (a.status === 'Applied' || !a.status)).length;
  const inProgressForJob = (jobId) => applications.filter(a => a.jobId === jobId && a.status === 'Interview').length;

  // Toggle favorite star
  const handleToggleStar = (id) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, starred: !j.starred } : j));
  };

  const handleSave = async (data, id) => {
    if (id) {
      setJobs(jobs.map(j => j.id === id ? { ...j, ...data } : j));
    } else {
      const newJob = {
        id: `job-${Date.now()}`,
        starred: false,
        ...data
      };
      setJobs([...jobs, newJob]);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa vị trí tuyển dụng này?')) return;
    setJobs(jobs.filter(j => j.id !== id));
  };

  // Department counts
  const deptCounts = DEPARTMENTS.reduce((acc, d) => {
    acc[d] = d === 'Tất cả' ? jobs.length : jobs.filter(j => j.department === d).length;
    return acc;
  }, {});

  // Filtered jobs
  const filtered = jobs.filter(j => {
    const matchDept = selectedDept === 'Tất cả' || j.department === selectedDept;
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  // Jobs that currently have applications
  const jobsWithApplications = jobs.filter(j => getJobApplications(j.id).length > 0);

  return (
    <div className="flex flex-col h-full bg-[#111422] text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top action header bar (style Ảnh 5 Odoo) */}
      <div className="px-5 py-3 border-b border-slate-800 bg-[#161a2b] flex flex-wrap items-center justify-between gap-3">
        {/* Left: Button "Mới" + Breadcrumb "Vị trí công việc" */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setEditJob(null); setShowModal(true); }}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-700 hover:bg-purple-600 transition-all shadow flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Mới</span>
          </button>
          
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <span>Vị trí công việc</span>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="relative w-80 max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Tìm kiếm vị trí..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-[#0e111d] border border-slate-700/60 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
          />
        </div>

        {/* Right: Counter and Views */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">
            1-{filtered.length} / {jobs.length}
          </span>
          <div className="flex items-center bg-[#0e111d] p-0.5 rounded-lg border border-slate-700/60 text-xs">
            <button className="p-1.5 rounded-md bg-purple-900/50 text-purple-300">
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-200">
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Area: Sidebar on Left + Jobs List on Right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: PHÒNG BAN & JOBS CÓ ĐƠN ỨNG TUYỂN (Ảnh 5 & Prompt) */}
        <div className="w-60 shrink-0 bg-[#131726] border-r border-slate-800 p-3 flex flex-col justify-between overflow-y-auto">
          <div className="flex flex-col gap-3">
            {/* PHÒNG BAN */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-2 py-1 block">
                PHÒNG BAN
              </span>
              <div className="flex flex-col gap-1 mt-1">
                {DEPARTMENTS.map(dept => {
                  const count = deptCounts[dept] || 0;
                  const isActive = selectedDept === dept;
                  return (
                    <button
                      key={dept}
                      onClick={() => setSelectedDept(dept)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-purple-900/40 text-purple-300 border border-purple-700/50' 
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <span className="truncate">{dept}</span>
                      <span className="text-[10px] font-mono text-slate-500">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-800" />

            {/* JOBS CÓ ĐƠN ỨNG TUYỂN - YÊU CẦU ĐẶC BIỆT */}
            <div>
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 block">
                  CÓ ĐƠN ỨNG TUYỂN
                </span>
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                {jobsWithApplications.map(j => {
                  const count = getJobApplications(j.id).length;
                  return (
                    <button
                      key={j.id}
                      onClick={() => setSelectedJobApplications(j)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#0e111d] hover:bg-purple-950/40 border border-slate-800 hover:border-purple-600/50 transition-all text-left cursor-pointer group"
                    >
                      <span className="truncate text-xs font-semibold text-slate-300 group-hover:text-purple-200 flex-1">
                        {j.title}
                      </span>
                      <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-600 text-white shadow-sm shrink-0">
                        {count}
                      </span>
                    </button>
                  );
                })}

                {jobsWithApplications.length === 0 && (
                  <p className="text-[11px] text-slate-500 italic px-2 py-1">
                    Chưa có đơn ứng tuyển mới
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="p-3 rounded-xl bg-[#0e111d] border border-slate-800 text-[11px] text-slate-400">
            <span className="font-bold text-slate-300 block mb-0.5">HR ATS Hub</span>
            <span>Tạo mới, sửa và tiếp nhận hồ sơ ứng viên tự động.</span>
          </div>
        </div>

        {/* Right Main Content: Jobs List rows (Ảnh 5 Odoo) */}
        <div className="flex-1 p-5 overflow-y-auto">
          <div className="flex flex-col divide-y divide-slate-800/80 bg-[#141829] rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
            {filtered.map(job => {
              const appCount = getJobApplications(job.id).length;
              const newApps = newAppsForJob(job.id);
              const inProg = inProgressForJob(job.id);

              return (
                <div 
                  key={job.id} 
                  className="px-6 py-4 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 hover:bg-[#181d33] transition-colors"
                >
                  {/* Left: Star + Title + Email */}
                  <div className="flex items-center gap-3.5 min-w-[280px]">
                    <button 
                      onClick={() => handleToggleStar(job.id)}
                      className="text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${job.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-100 hover:text-purple-300 transition-colors cursor-pointer">
                          {job.title}
                        </h3>
                      </div>
                      
                      {job.email && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 font-mono">
                          <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>{job.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle: Metrics (new applications / in progress / to recruit) */}
                  <div className="flex items-center gap-8 text-xs shrink-0">
                    <button 
                      onClick={() => setSelectedJobApplications(job)}
                      className="text-center group cursor-pointer"
                    >
                      <span className={`block font-extrabold text-base leading-none transition-transform group-hover:scale-110 ${
                        newApps > 0 ? 'text-purple-400' : 'text-slate-300'
                      }`}>
                        {newApps}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 block">new applications</span>
                    </button>

                    <div className="text-center">
                      <span className="block font-extrabold text-base text-slate-300 leading-none">
                        {inProg}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 block">in progress</span>
                    </div>

                    <div className="text-center">
                      <span className="block font-extrabold text-base text-slate-100 leading-none">
                        {job.toRecruit || 1}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 block">to recruit</span>
                    </div>
                  </div>

                  {/* Right: Actions (Cấu hình / Xoá) */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => { setEditJob(job); setShowModal(true); }}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 bg-[#0e111d] hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
                    >
                      Cấu hình
                    </button>
                    <button 
                      onClick={() => handleDelete(job.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                      title="Xoá job"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="py-20 text-center text-slate-500">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                <p className="font-bold text-sm">Chưa có vị trí tuyển dụng nào</p>
                <p className="text-xs text-slate-500 mt-1">Bấm "+ Mới" để tạo vị trí tuyển dụng đầu tiên</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Cấu hình / Tạo Job */}
      {showModal && (
        <JobFormModal 
          job={editJob} 
          onClose={() => { setShowModal(false); setEditJob(null); }} 
          onSave={handleSave} 
        />
      )}

      {/* Modal Xem Danh Sách Đơn Ứng Tuyển của 1 Job */}
      {selectedJobApplications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[#161a2b] border border-slate-700/80 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto animate-fade-in-scale">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Đơn Ứng Tuyển: {selectedJobApplications.title}
                </h3>
                <span className="text-[11px] text-slate-400">{selectedJobApplications.department}</span>
              </div>
              <button onClick={() => setSelectedJobApplications(null)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {getJobApplications(selectedJobApplications.id).map(app => (
                <div key={app.id} className="p-3.5 rounded-xl bg-[#0e111d] border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-xs text-slate-200">{app.candidateName}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{app.email} • {app.phone}</p>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">Nộp: {app.appliedAt}</span>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-purple-900/40 text-purple-300 border border-purple-700/40">
                      Điểm AI: {app.matchScore || 85}%
                    </span>
                    <span className="block text-[10px] text-emerald-400 font-semibold mt-1">
                      {app.status || 'Applied'}
                    </span>
                  </div>
                </div>
              ))}

              {getJobApplications(selectedJobApplications.id).length === 0 && (
                <div className="py-12 text-center text-slate-500 text-xs">
                  Chưa có hồ sơ ứng viên nộp cho vị trí này.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setSelectedJobApplications(null)} 
                className="px-4 py-2 rounded-xl bg-[#0e111d] border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
