import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sun,
  Moon,
  Loader2,
  Sparkles,
  Building2,
  DollarSign,
  X,
  Check,
  Send,
  Radio,
  FileCheck
} from 'lucide-react';
import axios from 'axios';
import sseService from '../services/sseService';

const getApiBase = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    const base = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '');
    return `${base}/api/public`;
  }
  if (typeof window !== 'undefined' && window.location.port === '5173') {
    return 'http://localhost:5000/api/public';
  }
  return '/api/public';
};

export default function PublicApplyPage({ theme = 'dark', onToggleTheme, onNavigateHome }) {
  const isLight = theme === 'light';

  // Form states
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Status & notifications
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null); // stores submitted application data
  const [errorMessage, setErrorMessage] = useState('');
  const [closedJobAlert, setClosedJobAlert] = useState('');
  const [sseConnected, setSseConnected] = useState(false);

  const fileInputRef = useRef(null);

  // Parse initial jobId from URL hash if provided: #apply?jobId=xxx
  const getInitialJobIdFromUrl = () => {
    try {
      const hash = window.location.hash;
      const queryIdx = hash.indexOf('?');
      if (queryIdx !== -1) {
        const params = new URLSearchParams(hash.slice(queryIdx));
        return params.get('jobId') || '';
      }
    } catch (e) {
      // ignore
    }
    return '';
  };

  // 1. Initial REST API Fetch for Jobs (Fallback guaranteed)
  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const res = await axios.get(`${getApiBase()}/jobs`);
      if (res.data?.success && Array.isArray(res.data.data)) {
        const openJobs = res.data.data;
        setJobs(openJobs);

        // Pre-select if initial URL parameter matches an open job
        const targetId = getInitialJobIdFromUrl();
        if (targetId && openJobs.some((j) => j.id === targetId)) {
          setSelectedJobId(targetId);
        }
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách vị trí:', err);
      setErrorMessage('Không thể tải danh sách vị trí tuyển dụng. Đang thử kết nối lại...');
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs();

    // Auto sync when user focuses back on the tab
    const handleFocus = () => {
      fetchJobs();
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // 2. Real-time Synchronization via SSE Hub
  useEffect(() => {
    // Monitor connection status
    const unsubStatus = sseService.onStatusChange((status) => {
      setSseConnected(status === 'connected');
    });

    // Listen to JobCreated: Add new job to dropdown
    const unsubCreated = sseService.on('JobCreated', (newJob) => {
      if (newJob && newJob.status === 'Open') {
        setJobs((prev) => {
          if (prev.some((j) => j.id === newJob.id)) return prev;
          return [newJob, ...prev];
        });
      }
    });

    // Listen to JobUpdated: Update job info, or handle closed status
    const unsubUpdated = sseService.on('JobUpdated', (updatedJob) => {
      if (!updatedJob) return;

      setJobs((prev) => {
        // If status changed to non-Open, remove from public list
        if (updatedJob.status !== 'Open') {
          return prev.filter((j) => j.id !== updatedJob.id);
        }
        // If still Open, update in list or add if wasn't there
        const exists = prev.some((j) => j.id === updatedJob.id);
        if (exists) {
          return prev.map((j) => (j.id === updatedJob.id ? { ...j, ...updatedJob } : j));
        }
        return [updatedJob, ...prev];
      });

      // Edge Case: If currently selected job was updated to non-Open
      if (updatedJob.status !== 'Open') {
        setSelectedJobId((currentSelected) => {
          if (currentSelected === updatedJob.id) {
            setClosedJobAlert('Vị trí này vừa dừng tiếp nhận hồ sơ, vui lòng chọn vị trí khác.');
            return '';
          }
          return currentSelected;
        });
      }
    });

    // Listen to JobDeleted: Remove job and alert if currently selected
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

      // Edge Case: If user is actively selecting this deleted job
      setSelectedJobId((currentSelected) => {
        const selJob = jobs.find((j) => j.id === currentSelected);
        const isMatch =
          currentSelected === id ||
          (normId && currentSelected.toLowerCase() === normId) ||
          (normTitle && selJob?.title && selJob.title.trim().toLowerCase() === normTitle);

        if (isMatch) {
          setClosedJobAlert('Vị trí này vừa dừng tiếp nhận hồ sơ, vui lòng chọn vị trí khác.');
          return '';
        }
        return currentSelected;
      });
    });


    return () => {
      unsubStatus();
      unsubCreated();
      unsubUpdated();
      unsubDeleted();
    };
  }, []);

  // Selected job entity
  const currentJob = jobs.find((j) => j.id === selectedJobId);

  // File handling & validation
  const validateAndSetFile = (file) => {
    setFileError('');
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.mimetype !== 'application/pdf') {
      setFileError('Chỉ chấp nhận file định dạng PDF (.pdf)!');
      setCvFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('Kích thước file không được vượt quá 10MB!');
      setCvFile(null);
      return;
    }

    setCvFile(file);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Submit Application
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setClosedJobAlert('');

    // Pre-flight validation
    if (!selectedJobId) {
      setErrorMessage('Vui lòng chọn vị trí tuyển dụng.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMessage('Vui lòng điền họ và tên.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (!cvFile) {
      setErrorMessage('Vui lòng đính kèm file CV định dạng PDF.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('email', email.trim());
      formData.append('phone', phone.trim());
      formData.append('jobId', selectedJobId);
      formData.append('cv', cvFile);

      const res = await axios.post(`${getApiBase()}/applications`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data?.success) {
        setSubmitSuccess({
          jobTitle: currentJob?.title || 'Vị trí đã chọn',
          candidateName: fullName.trim(),
          candidateEmail: email.trim(),
          data: res.data.data
        });
      } else {
        setErrorMessage(res.data?.message || 'Có lỗi xảy ra khi nộp hồ sơ.');
      }
    } catch (err) {
      console.error('Submit application error:', err);
      const msg = err.response?.data?.message || 'Không thể gửi hồ sơ. Vui lòng thử lại sau.';
      setErrorMessage(msg);
      // If error indicates job closed, reset dropdown
      if (err.response?.status === 400 && msg.includes('dừng tiếp nhận')) {
        setSelectedJobId('');
        setClosedJobAlert('Vị trí này vừa dừng tiếp nhận hồ sơ, vui lòng chọn vị trí khác.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form to submit another application
  const handleResetForm = () => {
    setSubmitSuccess(null);
    setSelectedJobId('');
    setFullName('');
    setEmail('');
    setPhone('');
    setCvFile(null);
    setFileError('');
    setErrorMessage('');
    setClosedJobAlert('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isLight
          ? 'bg-slate-50 text-slate-800'
          : 'bg-[#0b0e17] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200'
      }`}
    >
      {/* Top Header Bar */}
      <header
        className={`sticky top-0 z-40 px-4 sm:px-8 py-3.5 border-b backdrop-blur-md transition-colors ${
          isLight
            ? 'bg-white/90 border-slate-200 shadow-xs'
            : 'bg-[#111422]/90 border-slate-800/80 shadow-md'
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* External Public Portal Logo & Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                  SmartATS
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                  Cổng Tuyển Dụng Công Khai
                </span>
              </div>
              <span
                className={`text-[11px] block font-medium ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Hệ thống tiếp nhận hồ sơ ứng viên trực tuyến
              </span>
            </div>
          </div>

          {/* Real-time Status Badge & Theme Switcher */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                sseConnected
                  ? isLight
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                  : isLight
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-amber-950/40 text-amber-400 border-amber-800/40'
              }`}
              title={
                sseConnected
                  ? 'Hệ thống đang mở tiếp nhận hồ sơ trực tiếp'
                  : 'Đang kết nối lại kênh truyền dữ liệu'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  sseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="hidden sm:inline font-mono">
                {sseConnected ? 'Đang nhận hồ sơ' : 'Đang kết nối...'}
              </span>
            </div>


            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isLight
                    ? 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'border-slate-800 bg-[#0e111d] hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Chuyển chế độ Sáng / Tối"
              >
                {isLight ? <Moon className="w-4 h-4 text-purple-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        {submitSuccess ? (
          /* =========================================================================
             SUCCESS SCREEN: Animated confirmation with candidate details
             ========================================================================= */
          <div
            className={`rounded-3xl border p-8 sm:p-12 text-center shadow-2xl animate-fade-in-scale max-w-xl mx-auto w-full ${
              isLight
                ? 'bg-white border-slate-200'
                : 'bg-[#131726] border-slate-800 shadow-amber-500/5'
            }`}
          >
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-5 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black mb-2">
              Nộp Hồ Sơ Tuyển Dụng Thành Công!
            </h2>
            <p className={`text-xs sm:text-sm mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Cảm ơn bạn <strong className="text-amber-400 font-bold">{submitSuccess.candidateName}</strong> đã ứng tuyển vào vị trí{' '}
              <strong className={isLight ? 'text-slate-900 font-bold' : 'text-white font-bold'}>
                {submitSuccess.jobTitle}
              </strong>
              . Đội ngũ tuyển dụng sẽ sớm xem xét và liên hệ với bạn qua email{' '}
              <span className="font-mono text-purple-400">{submitSuccess.candidateEmail}</span>.
            </p>

            <div
              className={`p-4 rounded-2xl border text-left mb-6 text-xs ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e111d] border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 font-bold text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Trạng thái xử lý hồ sơ:</span>
              </div>
              <ul className="space-y-1.5 text-slate-400 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Đã ghi nhận thông tin và lưu trữ file CV an toàn.
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Hệ thống AI ATS tự động phân tích độ tương thích kỹ năng với JD.
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Thông báo real-time đã được gửi tức thời đến bộ phận nhân sự HR.
                </li>
              </ul>
            </div>

            <button
              onClick={handleResetForm}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
            >
              Nộp thêm hồ sơ khác
            </button>
          </div>
        ) : (
          /* =========================================================================
             PUBLIC APPLICATION FORM
             ========================================================================= */
          <div className="w-full">
            {/* Page Header Intro */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border bg-amber-500/10 border-amber-500/30 text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cổng Tiếp Nhận Hồ Sơ Trực Tuyến</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Nộp Hồ Sơ Ứng Tuyển
              </h1>
              <p
                className={`text-xs sm:text-sm mt-2 max-w-lg mx-auto leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                Vui lòng chọn vị trí công việc bạn quan tâm, hoàn tất thông tin liên hệ và tải lên file CV (định dạng PDF).
                Thông tin của bạn sẽ được gửi thẳng về hệ thống của bộ phận tuyển dụng ngay lập tức.
              </p>
            </div>


            {/* Edge Case Alert: Job closed/deleted in real-time */}
            {closedJobAlert && (
              <div className="mb-6 p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-300 flex items-start gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <span className="font-bold block">Thông báo cập nhật vị trí:</span>
                  <span>{closedJobAlert}</span>
                </div>
                <button
                  onClick={() => setClosedJobAlert('')}
                  className="text-rose-400 hover:text-rose-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-300 flex items-start gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">{errorMessage}</div>
                <button
                  onClick={() => setErrorMessage('')}
                  className="text-rose-400 hover:text-rose-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Main Form Card */}
            <form
              onSubmit={handleSubmit}
              className={`rounded-3xl border p-6 sm:p-10 shadow-2xl transition-all ${
                isLight
                  ? 'bg-white border-slate-200'
                  : 'bg-[#131726] border-slate-800 shadow-slate-950/50'
              }`}
            >
              <div className="space-y-6">
                {/* 1. Job Selection Dropdown */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                      <span>Vị trí tuyển dụng *</span>
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">
                      {loadingJobs ? 'Đang tải...' : `${jobs.length} vị trí đang mở`}
                    </span>
                  </div>

                  <div className="relative">
                    <select
                      value={selectedJobId}
                      onChange={(e) => {
                        setSelectedJobId(e.target.value);
                        setClosedJobAlert('');
                      }}
                      disabled={loadingJobs || jobs.length === 0}
                      className={`w-full px-4 py-3 rounded-2xl text-xs font-medium outline-none transition-all cursor-pointer border ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                          : 'bg-[#0e111d] border-slate-700/80 text-slate-100 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                      } ${!selectedJobId ? 'text-slate-400' : ''}`}
                    >
                      <option value="">-- Chọn vị trí công việc bạn muốn ứng tuyển --</option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title} — [{job.department}] {job.salaryRange ? `(${job.salaryRange})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {jobs.length === 0 && !loadingJobs && (
                    <p className="text-[11px] text-amber-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Hiện tại chưa có vị trí nào đang mở nhận hồ sơ.
                    </p>
                  )}
                </div>

                {/* Job Info Banner if Selected */}
                {currentJob && (
                  <div
                    className={`p-4 rounded-2xl border text-xs transition-all animate-fade-in ${
                      isLight
                        ? 'bg-amber-50/60 border-amber-200/80 text-slate-700'
                        : 'bg-amber-950/20 border-amber-600/30 text-slate-300'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="font-extrabold text-sm text-amber-400">
                        {currentJob.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {currentJob.department}
                        </span>
                        {currentJob.salaryRange && (
                          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-0.5">
                            <DollarSign className="w-3 h-3" />
                            {currentJob.salaryRange}
                          </span>
                        )}
                      </div>
                    </div>
                    {currentJob.description && (
                      <p className="text-[11px] leading-relaxed line-clamp-2 mb-1.5 text-slate-400">
                        {currentJob.description}
                      </p>
                    )}
                    {currentJob.requirements && (
                      <p className="text-[11px] text-slate-400">
                        <strong className="text-slate-300">Yêu cầu:</strong> {currentJob.requirements}
                      </p>
                    )}
                  </div>
                )}

                {/* 2. Personal Information Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                      Họ và tên ứng viên *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full px-4 py-3 rounded-2xl text-xs outline-none transition-all border ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                          : 'bg-[#0e111d] border-slate-700/80 text-slate-100 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                      Địa chỉ Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="VD: nguyenvana@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 rounded-2xl text-xs outline-none transition-all border ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                          : 'bg-[#0e111d] border-slate-700/80 text-slate-100 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                      }`}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      placeholder="VD: 0912 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 py-3 rounded-2xl text-xs outline-none transition-all border ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                          : 'bg-[#0e111d] border-slate-700/80 text-slate-100 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                      }`}
                    />
                  </div>
                </div>

                {/* 3. CV Upload Zone (PDF Only) */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                    Hồ sơ CV (Định dạng PDF, tối đa 10MB) *
                  </label>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                        : cvFile
                        ? 'border-emerald-500/60 bg-emerald-500/5'
                        : isLight
                        ? 'border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-slate-100/80'
                        : 'border-slate-700 hover:border-amber-400/70 bg-[#0e111d] hover:bg-[#151929]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {cvFile ? (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                          <FileCheck className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-xs sm:text-sm text-emerald-400">
                          {cvFile.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono mt-1">
                          {(cvFile.size / 1024 / 1024).toFixed(2)} MB • File PDF đã sẵn sàng
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCvFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="mt-3 text-[11px] font-semibold text-rose-400 hover:underline cursor-pointer"
                        >
                          Thay đổi file khác
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <p className="font-bold text-xs sm:text-sm">
                          Kéo thả file CV vào đây hoặc{' '}
                          <span className="text-amber-400 underline">chọn từ thiết bị</span>
                        </p>
                        <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          Hệ thống chỉ hỗ trợ định dạng PDF (.pdf), dung lượng tối đa 10MB
                        </p>
                      </div>
                    )}
                  </div>

                  {fileError && (
                    <p className="text-[11px] text-rose-400 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {fileError}
                    </p>
                  )}
                </div>

                {/* 4. Action Buttons */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting || !selectedJobId || !cvFile || !fullName.trim() || !email.trim()}
                    className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                      submitting || !selectedJobId || !cvFile || !fullName.trim() || !email.trim()
                        ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed border border-slate-700'
                        : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/20 active:scale-[0.99]'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Đang xử lý & phân tích hồ sơ...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Gửi Hồ Sơ Ứng Tuyển</span>
                      </>
                    )}
                  </button>

                  {!selectedJobId && (
                    <p className="text-center text-[11px] text-amber-400/80 mt-2 font-medium">
                      * Vui lòng chọn một vị trí tuyển dụng hợp lệ để mở nút gửi hồ sơ
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`py-4 text-center text-[11px] border-t ${
          isLight
            ? 'border-slate-200 bg-white text-slate-500'
            : 'border-slate-800 bg-[#0b0e17] text-slate-500'
        }`}
      >
        <span>Cổng tiếp nhận hồ sơ tuyển dụng trực tuyến • Dữ liệu của bạn được bảo mật và truyền an toàn về hệ thống nhân sự</span>
      </footer>

    </div>
  );
}
