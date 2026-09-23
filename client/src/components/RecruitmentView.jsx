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
  UserCheck,
  Share2,
  Check,
  Link2,
  ExternalLink
} from 'lucide-react';

import api from '../services/api';
import sseService from '../services/sseService';


const DEPARTMENTS = ['Tất cả', 'Management', 'Research & Development', 'Nhân sự', 'Marketing'];

// Demo jobs matching Ảnh 5
const INITIAL_DEMO_JOBS = [
  { 
    id: 'job-1', 
    title: 'Chief Executive Officer', 
    department: 'Management', 
    status: 'Open', 
    toRecruit: 1, 
    email: 'ceo@nhom20.com',
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
    email: 'consultant@nhom20.com',
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
    email: 'dev@nhom20.com',
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
    email: 'cb@nhom20.com',
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

function JobFormModal({ job, onClose, onSave, theme }) {
  const isLight = theme === 'light';
  const [form, setForm] = useState({
    title: job?.title || '', 
    department: job?.department || 'Research & Development',
    salaryRange: job?.salaryRange || '$1,500 - $2,500',
    description: job?.description || '', 
    requirements: job?.requirements || '',
    email: job?.email || '',
    status: job?.status || 'Open',
    toRecruit: job?.toRecruit || 1
  });
  const [saving, setSaving] = useState(false);

  const inputCls = `w-full px-3 py-2 rounded-xl text-xs outline-none transition-all border ${
    isLight 
      ? 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:bg-white' 
      : 'bg-[#0e111d] border-slate-700 text-slate-100 placeholder-slate-500 focus:border-purple-500'
  }`;

  const labelCls = `block mb-1 font-semibold text-xs ${isLight ? 'text-slate-700' : 'text-slate-400'}`;

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
      <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-fade-in-scale border ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#161a2b] border-slate-700/80 text-slate-100'
      }`}>
        <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <h3 className={`font-bold text-sm flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            <Briefcase className="w-4 h-4 text-purple-600" />
            {job ? 'Cấu hình vị trí công việc' : 'Tạo vị trí tuyển dụng mới'}
          </h3>
          <button onClick={onClose} className={`cursor-pointer ${isLight ? 'text-slate-400 hover:text-slate-600' : 'text-slate-400 hover:text-slate-200'}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3 text-xs">
          <div>
            <label className={labelCls}>Tên vị trí công việc *</label>
            <input 
              value={form.title} 
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="VD: Experienced Developer..." 
              className={inputCls} 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Phòng ban *</label>
              <select 
                value={form.department} 
                onChange={e => setForm({ ...form, department: e.target.value })}
                className={inputCls}
              >
                {DEPARTMENTS.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Cần tuyển (To recruit)</label>
              <input 
                type="number" 
                min="1" 
                value={form.toRecruit}
                onChange={e => setForm({ ...form, toRecruit: Number(e.target.value) })}
                className={inputCls} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Mức lương (Salary Range)</label>
              <input 
                value={form.salaryRange} 
                onChange={e => setForm({ ...form, salaryRange: e.target.value })}
                placeholder="VD: $1,500 - $2,500 hoặc Thỏa thuận" 
                className={inputCls} 
              />
            </div>
            <div>
              <label className={labelCls}>Email nhận hồ sơ ứng tuyển</label>
              <input 
                type="email"
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="VD: dev@nhom20.com" 
                className={inputCls} 
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Mô tả công việc</label>
            <textarea 
              rows={3} 
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="VD: Mô tả quyền lợi và trách nhiệm chính..."
              className={inputCls + " resize-none"} 
            />
          </div>

          <div>
            <label className={labelCls}>Yêu cầu ứng viên</label>
            <textarea 
              rows={3} 
              value={form.requirements}
              onChange={e => setForm({ ...form, requirements: e.target.value })}
              placeholder="VD: Kỹ năng chuyên môn, năm kinh nghiệm..."
              className={inputCls + " resize-none"} 
            />
          </div>

          <div>
            <label className={labelCls}>Trạng thái tuyển dụng</label>
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

        <div className={`flex gap-2.5 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <button 
            onClick={onClose} 
            className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
              isLight ? 'border-slate-300 hover:bg-slate-100 text-slate-700' : 'border-slate-700 hover:bg-slate-800 text-slate-300'
            }`}
          >
            Hủy
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
          >
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang lưu...</> : 'Lưu vị trí'}
          </button>
        </div>
      </div>
    </div>
  );
}

const STORAGE_KEY_JOBS = 'smart_ats_jobs_v1';
const STORAGE_KEY_APPS = 'smart_ats_applications_v1';

export default function RecruitmentView({ jobs: propJobs, applications: propApps, theme }) {
  const isLight = theme === 'light';
  const [jobs, setJobs] = useState(() => {
    if (propJobs?.length) return propJobs;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_JOBS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_DEMO_JOBS;
  });

  const [applications, setApplications] = useState(() => {
    if (propApps?.length) return propApps;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return INITIAL_DEMO_APPLICATIONS;
  });

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('Tất cả');
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [selectedJobApplications, setSelectedJobApplications] = useState(null);
  const [copiedPublicLink, setCopiedPublicLink] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
    } catch (e) {}
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(applications));
    } catch (e) {}
  }, [applications]);

  // 1. Fetch live jobs from backend API on mount & on tab focus
  useEffect(() => {
    let mounted = true;
    const loadJobs = async () => {
      try {
        const res = await api.get('/jobs');
        if (mounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const normalized = res.data.map((j) => ({
            ...j,
            email: j.email || (j.title ? `${j.title.toLowerCase().replace(/[^a-z0-9]/g, '')}@nhom20.com` : 'recruitment@nhom20.com')
          }));
          setJobs(normalized);
        }
      } catch (err) {
        console.warn('RecruitmentView: could not load jobs from API, keeping current local data:', err);
      }
    };
    loadJobs();

    const handleFocus = () => {
      loadJobs();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      mounted = false;
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // 2. Real-time Synchronization via SSE Hub
  useEffect(() => {
    // When a candidate submits an application from the public portal
    const unsubApp = sseService.on('NewApplicationReceived', (data) => {
      if (!data) return;

      const newAppItem = {
        id: data.applicationId || `app-${Date.now()}`,
        jobId: data.jobId,
        candidateName: data.candidateName || 'Ứng viên mới',
        email: data.candidateEmail || '',
        phone: '',
        status: 'Applied',
        appliedAt: 'Vừa xong'
      };

      // Add new application to applications state (updates badge & sidebar immediately)
      setApplications((prev) => [newAppItem, ...prev]);

      // Update application count in jobs state
      setJobs((prevJobs) =>
        prevJobs.map((j) => {
          if (j.id === data.jobId) {
            const currentCount = j._count?.applications || 0;
            return {
              ...j,
              _count: { applications: currentCount + 1 }
            };
          }
          return j;
        })
      );
    });

    // When a job is created by another session or background
    const unsubCreated = sseService.on('JobCreated', (newJob) => {
      if (!newJob) return;
      const normalized = {
        ...newJob,
        email: newJob.email || (newJob.title ? `${newJob.title.toLowerCase().replace(/[^a-z0-9]/g, '')}@nhom20.com` : 'recruitment@nhom20.com')
      };
      setJobs((prev) => {
        const normTitle = (normalized.title || '').trim().toLowerCase();
        const alreadyExists = prev.some(
          (j) => j.id === normalized.id || (normTitle && (j.title || '').trim().toLowerCase() === normTitle)
        );
        if (alreadyExists) {
          return prev.map((j) =>
            (j.id === normalized.id || (normTitle && (j.title || '').trim().toLowerCase() === normTitle))
              ? { ...j, ...normalized }
              : j
          );
        }
        return [normalized, ...prev];
      });
    });

    // When a job is updated
    const unsubUpdated = sseService.on('JobUpdated', (updatedJob) => {
      if (!updatedJob) return;
      const normalized = {
        ...updatedJob,
        email: updatedJob.email || (updatedJob.title ? `${updatedJob.title.toLowerCase().replace(/[^a-z0-9]/g, '')}@nhom20.com` : 'recruitment@nhom20.com')
      };
      setJobs((prev) =>
        prev.map((j) => {
          if (j.id === normalized.id || (j.title && normalized.title && j.title.toLowerCase() === normalized.title.toLowerCase())) {
            return { ...j, ...normalized };
          }
          return j;
        })
      );
    });

    // When a job is deleted
    const unsubDeleted = sseService.on('JobDeleted', ({ id, title }) => {
      if (!id && !title) return;
      const normTitle = title ? title.trim().toLowerCase() : '';
      const normId = id ? id.trim().toLowerCase() : '';

      setJobs((prev) =>
        prev.filter((j) => {
          if (id && j.id === id) return false;
          if (normId && j.id && j.id.trim().toLowerCase() === normId) return false;
          if (normTitle && j.title && j.title.trim().toLowerCase() === normTitle) return false;
          return true;
        })
      );
      setApplications((prev) => prev.filter((a) => a.jobId !== id));
    });

    return () => {
      unsubApp();
      unsubCreated();
      unsubUpdated();
      unsubDeleted();
    };
  }, []);

  // Copy public candidate application link to clipboard
  const handleCopyPublicLink = () => {
    const url = `${window.location.origin}/#apply`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopiedPublicLink(true);
    setTimeout(() => setCopiedPublicLink(false), 2500);
  };

  // Helper calculation for application metrics
  const getJobApplications = (jobId) => applications.filter((a) => a.jobId === jobId);
  const newAppsForJob = (jobId) =>
    applications.filter((a) => a.jobId === jobId && (a.status === 'Applied' || !a.status)).length;
  const inProgressForJob = (jobId) =>
    applications.filter((a) => a.jobId === jobId && a.status === 'Interview').length;

  // Toggle favorite star
  const handleToggleStar = (id) => {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, starred: !j.starred } : j)));
  };

  const handleSave = async (data, id) => {
    if (id) {
      // 1. Optimistic Edit
      const normalized = {
        ...data,
        id,
        email: data.email || (data.title ? `${data.title.toLowerCase().replace(/[^a-z0-9]/g, '')}@nhom20.com` : 'recruitment@nhom20.com')
      };
      setJobs((prev) => {
        const next = prev.map((j) => (j.id === id ? { ...j, ...normalized } : j));
        try { localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(next)); } catch (e) {}
        return next;
      });

      // 2. Background API sync
      try {
        const res = await api.put(`/jobs/${id}`, data);
        if (res?.data) {
          const fromServer = {
            ...res.data,
            email: res.data.email || normalized.email
          };
          setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...fromServer } : j)));
        }
      } catch (err) {
        console.warn('Backend PUT API error (kept local edit):', err?.message || err);
      }
    } else {
      // 1. Optimistic Create
      const newId = `job-${Date.now()}`;
      const normalized = {
        id: newId,
        starred: false,
        toRecruit: 1,
        status: 'Open',
        salaryRange: 'Thỏa thuận',
        ...data,
        email: data.email || (data.title ? `${data.title.toLowerCase().replace(/[^a-z0-9]/g, '')}@nhom20.com` : 'recruitment@nhom20.com')
      };

      setJobs((prev) => {
        const normTitle = (normalized.title || '').trim().toLowerCase();
        const alreadyExists = prev.some(
          (j) => j.id === normalized.id || (normTitle && (j.title || '').trim().toLowerCase() === normTitle)
        );
        const next = alreadyExists
          ? prev.map((j) => (j.id === normalized.id || (normTitle && (j.title || '').trim().toLowerCase() === normTitle)) ? { ...j, ...normalized } : j)
          : [normalized, ...prev];
        try { localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(next)); } catch (e) {}
        return next;
      });

      // 2. Background API sync
      try {
        const res = await api.post('/jobs', data);
        if (res?.data) {
          const fromServer = {
            ...res.data,
            email: res.data.email || normalized.email
          };
          setJobs((prev) => {
            const normTitle = (fromServer.title || '').trim().toLowerCase();
            return prev.map((j) =>
              (j.id === newId || (normTitle && (j.title || '').trim().toLowerCase() === normTitle))
                ? { ...j, ...fromServer }
                : j
            );
          });
        }
      } catch (err) {
        console.warn('Backend POST API error (kept local creation):', err?.message || err);
      }
    }
  };

  const handleDelete = async (jobOrId) => {
    const jobObj = typeof jobOrId === 'object' ? jobOrId : jobs.find((j) => j.id === jobOrId) || { id: jobOrId, title: '' };
    const id = jobObj.id;
    const title = jobObj.title || '';

    if (!window.confirm(`Bạn có chắc chắn muốn xóa vị trí tuyển dụng "${title || 'này'}"?`)) return;

    // 1. Optimistically delete immediately so UI updates instantly
    setJobs((prev) => {
      const next = prev.filter((j) => j.id !== id && (!title || j.title !== title));
      try { localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(next)); } catch (e) {}
      return next;
    });
    setApplications((prev) => {
      const next = prev.filter((a) => a.jobId !== id);
      try { localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(next)); } catch (e) {}
      return next;
    });

    // 2. Background API sync
    try {
      await api.delete(`/jobs/${id}?title=${encodeURIComponent(title)}`);
    } catch (err) {
      console.warn('Backend DELETE API error (offline or Vercel static demo, kept local delete):', err?.message || err);
    }
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
    <div className={`flex flex-col h-full rounded-2xl border overflow-hidden shadow-2xl ${
      isLight
        ? 'bg-white border-slate-200 text-slate-800'
        : 'bg-[#111422] border-slate-800 text-slate-100'
    }`}>
      {/* Top action header bar (style Ảnh 5 Odoo) */}
      <div className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#161a2b] border-slate-800'
      }`}>
        {/* Left: Button "Mới" + Breadcrumb "Vị trí công việc" + Button "Tạo link ứng tuyển" */}
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

          {/* Nút Tạo / Sao chép link ứng tuyển công khai */}
          <button
            onClick={handleCopyPublicLink}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1.5 active:scale-95 cursor-pointer border ${
              copiedPublicLink
                ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/50'
                : isLight
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40 shadow-amber-500/10'
            }`}
            title="Sao chép link form ứng tuyển công khai gửi cho ứng viên"
          >
            {copiedPublicLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Đã sao chép link ứng tuyển!</span>
              </>
            ) : (
              <>
                <Link2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Tạo link ứng tuyển</span>
              </>
            )}
          </button>
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
          <div className={`flex flex-col divide-y rounded-2xl border overflow-hidden shadow-lg ${
            isLight
              ? 'divide-slate-200 bg-white border-slate-200'
              : 'divide-slate-800/80 bg-[#141829] border-slate-800'
          }`}>
            {filtered.map(job => {
              const appCount = getJobApplications(job.id).length;
              const newApps = newAppsForJob(job.id);
              const inProg = inProgressForJob(job.id);

              return (
                <div 
                  key={job.id} 
                  className={`px-6 py-4 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 transition-colors ${
                    isLight
                      ? 'hover:bg-slate-100'
                      : 'hover:bg-[#181d33]'
                  }`}
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
                        <h3 className={`font-bold text-sm hover:text-purple-500 transition-colors cursor-pointer ${
                          isLight ? 'text-slate-800' : 'text-slate-100'
                        }`}>
                          {job.title}
                        </h3>
                      </div>
                      
                      {job.email && (
                        <div className={`flex items-center gap-1.5 text-[11px] mt-0.5 font-mono ${
                          isLight ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          <Mail className={`w-3 h-3 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
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
                        newApps > 0 ? 'text-purple-500' : (isLight ? 'text-slate-600' : 'text-slate-300')
                      }`}>
                        {newApps}
                      </span>
                      <span className={`text-[10px] mt-1 block ${
                        isLight ? 'text-slate-500' : 'text-slate-400'
                      }`}>new applications</span>
                    </button>

                    <div className="text-center">
                      <span className={`block font-extrabold text-base leading-none ${
                        isLight ? 'text-slate-600' : 'text-slate-300'
                      }`}>
                        {inProg}
                      </span>
                      <span className={`text-[10px] mt-1 block ${
                        isLight ? 'text-slate-500' : 'text-slate-400'
                      }`}>in progress</span>
                    </div>

                    <div className="text-center">
                      <span className={`block font-extrabold text-base leading-none ${
                        isLight ? 'text-slate-800' : 'text-slate-100'
                      }`}>
                        {job.toRecruit || 1}
                      </span>
                      <span className={`text-[10px] mt-1 block ${
                        isLight ? 'text-slate-500' : 'text-slate-400'
                      }`}>to recruit</span>
                    </div>
                  </div>

                  {/* Right: Actions (Cấu hình / Xoá) */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => { setEditJob(job); setShowModal(true); }}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        isLight
                          ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700'
                          : 'border-slate-700 bg-[#0e111d] hover:bg-slate-800 text-slate-200'
                      }`}
                    >
                      Cấu hình
                    </button>
                    <button 
                      onClick={() => handleDelete(job)}
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
          theme={theme}
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
