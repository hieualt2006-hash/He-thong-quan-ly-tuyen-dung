import React, { useState } from 'react';
import { 
  Briefcase, 
  PlusCircle, 
  Search, 
  Building2, 
  DollarSign, 
  ChevronRight,
  CheckCircle,
  X,
  FileText,
  UserPlus
} from 'lucide-react';
import api from '../services/api';

function JobListView({ jobs = [], fetchJobs, onSelectJob, onOpenApplyModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    description: '',
    requirements: '',
    salaryRange: '$1,500 - $2,500'
  });

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.requirements.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.requirements) {
      alert('Vui lòng điền đầy đủ Tên công việc, Mô tả và Yêu cầu!');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/jobs', formData);
      alert('Tạo tin tuyển dụng thành công!');
      setIsModalOpen(false);
      setFormData({
        title: '',
        department: 'Engineering',
        description: '',
        requirements: '',
        salaryRange: '$1,500 - $2,500'
      });
      if (fetchJobs) fetchJobs();
    } catch (err) {
      alert('Lỗi tạo job: ' + (err.message || 'Không thể tạo job'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Tin Tuyển Dụng (Job Postings)</h2>
          <p className="text-sm text-slate-400">Danh sách các vị trí công việc đang đăng tuyển trên hệ thống Express & SQLite</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tạo Tin Tuyển Dụng Mới</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Tìm kiếm công việc theo tên, phòng ban hoặc kỹ năng yêu cầu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
        />
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          Không tìm thấy bài tuyển dụng nào phù hợp. Vui lòng bấm nút "Tạo Tin Tuyển Dụng Mới"!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-indigo-500/40 transition-all flex flex-col justify-between gap-5 group shadow-lg"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {job.department}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {job.status || 'Open'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                  {job.title}
                </h3>
                
                <p className="text-sm text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {job.description}
                </p>

                <div className="text-xs text-slate-300 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/60 mb-2">
                  <strong className="text-indigo-400">Requirements: </strong>{job.requirements}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-4 gap-3">
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {job.salaryRange}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectJob(job)}
                    className="text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                  >
                    Xem Chi Tiết JD
                  </button>
                  <button
                    onClick={() => onOpenApplyModal(job)}
                    className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 rounded-lg transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Nộp Hồ Sơ</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Create Job */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                Tạo Tin Tuyển Dụng Mới
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Tiêu Đề Công Việc *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Senior Fullstack Developer (Node.js & React)"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phòng Ban</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="AI Lab">AI Lab</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR & Operations">HR & Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mức Lương (Salary Range)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: $1,500 - $2,500"
                    value={formData.salaryRange}
                    onChange={(e) => setFormData({...formData, salaryRange: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mô Tả Công Việc (Job Description) *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Mô tả các nhiệm vụ và trách nhiệm công việc..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Yêu Cầu Kỹ Năng & Kinh Nghiệm *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Liệt kê các kỹ năng cần thiết (Node.js, React, SQL, AI API, Docker...)"
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang tạo...' : 'Xác Nhận Tạo Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobListView;
