import React, { useState } from 'react';
import { 
  Briefcase, 
  Building2, 
  DollarSign, 
  ArrowLeft, 
  Send, 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  X,
  Sparkles
} from 'lucide-react';
import api from '../services/api';

function PublicJobDetailView({ job, onBack, onApplicationSubmitted }) {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [cvFile, setCvFile] = useState(null);

  if (!job) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        alert('Vui lòng chọn file định dạng PDF!');
        return;
      }
      setCvFile(file);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      alert('Vui lòng nhập Họ tên và Email!');
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append('jobId', job.id);
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('phone', formData.phone || '');
      if (cvFile) {
        data.append('cv', cvFile);
      }

      const response = await api.post('/applications', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('🎉 Nộp hồ sơ ứng tuyển thành công! AI đã tự động phân tích CV của bạn.');
      setIsApplyModalOpen(false);
      setFormData({ fullName: '', email: '', phone: '' });
      setCvFile(null);

      if (onApplicationSubmitted) {
        onApplicationSubmitted(response.data);
      }
    } catch (err) {
      console.error('Lỗi khi nộp đơn:', err);
      alert('Lỗi nộp hồ sơ: ' + (err.message || 'Không thể nộp đơn ứng tuyển'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="self-start flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Danh sách Jobs</span>
      </button>

      {/* Main Job Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-semibold px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-2 inline-block">
              {job.department}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{job.title}</h1>
            <p className="text-sm font-bold text-emerald-400 mt-1">{job.salaryRange}</p>
          </div>

          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-xl shadow-indigo-600/30 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Nộp Hồ Sơ Ngay</span>
          </button>
        </div>

        {/* Description Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider text-indigo-400">Mô Tả Công Việc</h3>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/60 p-5 rounded-2xl border border-slate-800/60">
            {job.description}
          </p>
        </div>

        {/* Requirements Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider text-indigo-400">Yêu Cầu Ứng Viên</h3>
          <div className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-5 rounded-2xl border border-slate-800/60 whitespace-pre-line">
            {job.requirements}
          </div>
        </div>
      </div>

      {/* Apply Modal Form */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  Nộp Hồ Sơ Ứng Tuyển
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-xs">{job.title}</p>
              </div>
              <button 
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Họ và Tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Địa chỉ Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="an.nguyen@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Số Điện Thoại</label>
                  <input
                    type="text"
                    placeholder="0901234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* PDF File Upload Zone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tải Lên File CV (Định dạng PDF)</label>
                <div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/60 rounded-2xl p-5 text-center transition-colors">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <UploadCloud className="w-8 h-8 text-indigo-400" />
                    {cvFile ? (
                      <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                        <FileText className="w-4 h-4" />
                        <span>{cvFile.name} ({(cvFile.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-medium text-slate-300">Kéo thả hoặc click để chọn file PDF CV</p>
                        <span className="text-[11px] text-slate-500">Hỗ trợ định dạng .pdf (Tối đa 10MB)</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Đang Tải Up & AI Phân Tích...' : 'Gửi Đơn Ứng Tuyển'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PublicJobDetailView;
