import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Briefcase, 
  Plus, 
  DollarSign, 
  Sparkles, 
  Layers, 
  CheckCircle2,
  TrendingUp,
  MapPin
} from 'lucide-react';

const INITIAL_DEPARTMENTS = [
  { id: 'eng', name: 'Engineering', lead: 'Trần Minh Đức (CTO)', openJobs: 3, headcount: 24, budget: '$45,000 / tháng', topSkills: 'React, Node.js, TypeScript, PostgreSQL', color: 'from-orange-500 to-amber-600' },
  { id: 'ai', name: 'AI & Data Lab', lead: 'Nguyễn Thanh Hà (AI Research Lead)', openJobs: 2, headcount: 8, budget: '$25,000 / tháng', topSkills: 'Google Gemini, Python, PyTorch, LangChain', color: 'from-indigo-500 to-purple-600' },
  { id: 'prod', name: 'Product & Design', lead: 'Lê Hoàng Nam (Head of Product)', openJobs: 1, headcount: 6, budget: '$18,000 / tháng', topSkills: 'Figma, User Journey, Product Strategy', color: 'from-amber-500 to-yellow-600' },
  { id: 'mkt', name: 'Marketing & Growth', lead: 'Phạm Quỳnh Chi (Marketing Director)', openJobs: 1, headcount: 10, budget: '$20,000 / tháng', topSkills: 'SEO, Content, B2B Growth, Social Media', color: 'from-emerald-500 to-teal-600' },
  { id: 'hr', name: 'HR & Operations', lead: 'Vũ Lan Anh (HR Director)', openJobs: 1, headcount: 5, budget: '$12,000 / tháng', topSkills: 'Talent Acquisition, ATS, Employee Engagement', color: 'from-rose-500 to-pink-600' }
];

function DepartmentView({ jobs = [], onNavigateToJobs }) {
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', lead: '', budget: '$15,000 / tháng', topSkills: '' });

  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.lead) return;
    const newDept = {
      id: Date.now().toString(),
      name: formData.name,
      lead: formData.lead,
      openJobs: 0,
      headcount: 1,
      budget: formData.budget,
      topSkills: formData.topSkills || 'General Skills',
      color: 'from-orange-500 to-amber-600'
    };
    setDepartments([...departments, newDept]);
    setIsModalOpen(false);
    setFormData({ name: '', lead: '', budget: '$15,000 / tháng', topSkills: '' });
    alert('🎉 Thêm phòng ban mới thành công!');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Cơ Cấu Phòng Ban (Departments & Org Structure)</h2>
            <span className="bg-orange-500/10 text-orange-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-orange-500/20">
              Cơ Cấu Tổ Chức
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Quản lý các khối chuyên môn, định biên nhân sự và nhu cầu tuyển dụng theo từng phòng ban</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold px-4.5 py-2.5 rounded-2xl text-xs transition-all shadow-lg shadow-orange-500/25 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Phòng Ban Mới</span>
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => {
          // Count active jobs in this department
          const activeJobsCount = jobs.filter(j => j.department?.toLowerCase() === dept.name.toLowerCase()).length;
          return (
            <div key={dept.id} className="zoho-card bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-5">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Hoạt động
                  </span>
                </div>

                <h3 className="font-extrabold text-xl text-white">{dept.name}</h3>
                <p className="text-xs text-slate-400 mt-1">Trưởng bộ phận: <strong className="text-slate-200">{dept.lead}</strong></p>

                <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold uppercase">Nhân sự hiện tại</span>
                    <span className="text-white font-extrabold font-mono text-sm">{dept.headcount} người</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold uppercase">Tin tuyển đang mở</span>
                    <span className="text-orange-400 font-extrabold font-mono text-sm">{activeJobsCount || dept.openJobs} vị trí</span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-400">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">Kỹ năng cốt lõi:</span>
                  <span className="text-slate-300 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800/80 inline-block text-[11px]">
                    {dept.topSkills}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">
                  Quỹ lương: {dept.budget}
                </span>
                <button
                  onClick={onNavigateToJobs}
                  className="text-xs font-bold text-orange-400 hover:text-orange-300"
                >
                  Xem Jobs →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Department */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building2 className="w-5 h-5 text-orange-400" />
              Thêm Phòng Ban Mới
            </h3>

            <form onSubmit={handleAddDepartment} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tên Phòng Ban *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Security & Cloud Infrastructure"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Trưởng Bộ Phận (Department Lead) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A (Lead Engineer)"
                  value={formData.lead}
                  onChange={(e) => setFormData({...formData, lead: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Kỹ Năng Cốt Lõi</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Kubernetes, AWS, Go, CyberSecurity"
                  value={formData.topSkills}
                  onChange={(e) => setFormData({...formData, topSkills: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                >
                  Tạo Phòng Ban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentView;
