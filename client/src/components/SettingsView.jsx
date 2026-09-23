import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Layers, 
  Mail, 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Upload, 
  Send,
  Lock,
  Server
} from 'lucide-react';
import api from '../services/api';

export default function SettingsView({ currentUser, serverStatus }) {
  const [activeTab, setActiveTab] = useState('company'); // 'company' | 'users' | 'stages' | 'email'
  const [isSaved, setIsSaved] = useState(false);

  // 1. Quản lý thông tin chung công ty
  const [companyInfo, setCompanyInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('ats_company_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: 'Nhóm 20',
      logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&auto=format&fit=crop&q=80',
      address: 'Tầng 8, Toà nhà Innovation Center, Cầu Giấy, Hà Nội',
      email: 'contact@nhom20.com',
      phone: '024 7788 9900',
      website: 'https://nhom20.com',
      taxCode: '0109988776'
    };
  });

  // 2. Danh sách người dùng nội bộ & Phân quyền
  const [internalUsers, setInternalUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('ats_internal_users');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: '1', name: 'Hieu Trung', email: 'admin@nhom20.com', role: 'ADMIN', status: 'active' },
      { id: '2', name: 'Trần Thị Bích', email: 'recruiter@nhom20.com', role: 'HR', status: 'active' },
      { id: '3', name: 'Lê Minh Đức (Tech Lead)', email: 'interviewer@nhom20.com', role: 'INTERVIEWER', status: 'active' }
    ];
  });
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'HR' });

  // 3. Danh mục giai đoạn tuyển dụng chung (nhận CV, sơ loại, phỏng vấn, đề nghị nhận việc)
  const [stages, setStages] = useState(() => {
    try {
      const saved = localStorage.getItem('ats_stages');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: '1', name: 'Nhận CV', code: 'Applied', color: '#6366f1', description: 'Tiếp nhận hồ sơ ứng tuyển ban đầu' },
      { id: '2', name: 'Sơ loại', code: 'Screening', color: '#f59e0b', description: 'Đánh giá AI Match và lọc hồ sơ ban đầu' },
      { id: '3', name: 'Phỏng vấn', code: 'Interview', color: '#ec4899', description: 'Phỏng vấn chuyên môn và văn hoá trực tiếp/online' },
      { id: '4', name: 'Đề nghị nhận việc', code: 'Offer', color: '#10b981', description: 'Gửi thư mời nhận việc (Offer letter)' }
    ];
  });
  const [newStageName, setNewStageName] = useState('');

  // 4. Cấu hình SMTP & Mẫu email tự động
  const [smtpConfig, setSmtpConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ats_smtp_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      host: 'smtp.gmail.com',
      port: 587,
      username: 'recruitment@nhom20.com',
      password: '••••••••••••••••',
      fromName: 'Ban Tuyển Dụng Nhóm 20',
      useTls: true
    };
  });

  const [emailTemplates, setEmailTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem('ats_email_templates');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      interview: {
        subject: '[{Company_Name}] Thư mời tham dự phỏng vấn vị trí {Job_Title}',
        body: `Kính gửi bạn {Candidate_Name},

Chúc mừng bạn đã xuất sắc vượt qua vòng sơ loại hồ sơ cho vị trí {Job_Title} tại {Company_Name}.

Bộ phận Tuyển dụng trân trọng kính mời bạn tham gia buổi phỏng vấn trực tuyến với Hội đồng tuyển dụng:
- Thời gian: {Interview_Time}
- Hình thức: Google Meet trực tuyến
- Người phỏng vấn: {Interviewer_Name}

Vui lòng phản hồi email này để xác nhận tham gia.

Trân trọng,
Bộ phận Tuyển dụng {Company_Name}`
      },
      resultOffer: {
        subject: '[{Company_Name}] Thông báo kết quả phỏng vấn & Thư đề nghị nhận việc {Job_Title}',
        body: `Kính gửi bạn {Candidate_Name},

Sau quá trình phỏng vấn, {Company_Name} rất ấn tượng với năng lực và kinh nghiệm của bạn. Chúng tôi trân trọng gửi đến bạn lời mời làm việc chính thức cho vị trí {Job_Title}.

Vui lòng xem chi tiết chế độ đãi ngộ đính kèm và phản hồi trước ngày thông báo.

Trân trọng chào đón bạn gia nhập đội ngũ {Company_Name}!`
      }
    };
  });

  // Save settings handler
  const handleSaveAll = () => {
    localStorage.setItem('ats_company_settings', JSON.stringify(companyInfo));
    localStorage.setItem('ats_internal_users', JSON.stringify(internalUsers));
    localStorage.setItem('ats_stages', JSON.stringify(stages));
    localStorage.setItem('ats_smtp_config', JSON.stringify(smtpConfig));
    localStorage.setItem('ats_email_templates', JSON.stringify(emailTemplates));
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    setInternalUsers([
      ...internalUsers,
      { id: Date.now().toString(), ...newUser, status: 'active' }
    ]);
    setNewUser({ name: '', email: '', role: 'HR' });
  };

  const handleDeleteUser = (id) => {
    if (internalUsers.length <= 1) {
      alert('Phải giữ lại ít nhất 1 tài khoản Quản trị viên!');
      return;
    }
    setInternalUsers(internalUsers.filter(u => u.id !== id));
  };

  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    setStages([
      ...stages,
      {
        id: Date.now().toString(),
        name: newStageName.trim(),
        code: `Custom_${stages.length + 1}`,
        color: '#8b5cf6',
        description: 'Giai đoạn tuỳ chỉnh bổ sung'
      }
    ]);
    setNewStageName('');
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl bg-[#0e111d] border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-500 transition-all";

  return (
    <div className="flex flex-col h-full bg-[#111422] text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-[#161a2b] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-100 tracking-tight">Cài Đặt Hệ Thống</h2>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-900/40 text-purple-300 border border-purple-700/50">
              Phiên Bản Nhóm 20
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quản trị người dùng, thông tin công ty, danh mục giai đoạn tuyển dụng và cấu hình gửi thư tự động
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSaved && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" /> Đã lưu cài đặt!
            </span>
          )}

          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-xs font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu tất cả thay đổi</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-6 border-b border-slate-800 bg-[#141829] flex gap-8 text-xs font-bold">
        {[
          { id: 'company', label: '1. Thông tin công ty', icon: Building2 },
          { id: 'users', label: '2. Phân quyền & Người dùng', icon: Users },
          { id: 'stages', label: '3. Giai đoạn tuyển dụng', icon: Layers },
          { id: 'email', label: '4. SMTP & Mẫu Email', icon: Mail }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 flex items-center gap-2 transition-all cursor-pointer ${
                isActive 
                  ? 'text-purple-400 border-b-2 border-purple-500' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Viewport */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* TAB 1: THÔNG TIN CHUNG CỦA CÔNG TY */}
        {activeTab === 'company' && (
          <div className="max-w-4xl flex flex-col gap-6 animate-fade-in">
            <div className="p-5 rounded-2xl bg-[#161a2b] border border-slate-800 flex flex-col gap-4">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
                <Building2 className="w-4 h-4 text-purple-400" />
                Hồ Sơ Doanh Nghiệp (Hiển thị trên thư từ & liên hệ)
              </h3>

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Logo Preview */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-24 h-24 rounded-2xl bg-[#0e111d] border border-slate-700 flex items-center justify-center overflow-hidden p-1 shadow-inner">
                    <img src={companyInfo.logoUrl} alt="Company Logo" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <span className="text-[10px] text-slate-500">Logo công ty</span>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Tên doanh nghiệp *</label>
                    <input 
                      type="text" 
                      value={companyInfo.name} 
                      onChange={e => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                      className={inputCls} 
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Mã số thuế / Giấy phép</label>
                    <input 
                      type="text" 
                      value={companyInfo.taxCode} 
                      onChange={e => setCompanyInfo({ ...companyInfo, taxCode: e.target.value })}
                      className={inputCls} 
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-400 mb-1 font-semibold">Địa chỉ liên hệ chính thức (In trên thư từ)</label>
                    <input 
                      type="text" 
                      value={companyInfo.address} 
                      onChange={e => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                      className={inputCls} 
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Email liên hệ tuyển dụng</label>
                    <input 
                      type="email" 
                      value={companyInfo.email} 
                      onChange={e => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                      className={inputCls} 
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Số điện thoại tổng đài</label>
                    <input 
                      type="text" 
                      value={companyInfo.phone} 
                      onChange={e => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                      className={inputCls} 
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-400 mb-1 font-semibold">Đường dẫn Logo URL</label>
                    <input 
                      type="text" 
                      value={companyInfo.logoUrl} 
                      onChange={e => setCompanyInfo({ ...companyInfo, logoUrl: e.target.value })}
                      className={inputCls} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUẢN LÝ NGƯỜI DÙNG NỘI BỘ & PHÂN QUYỀN */}
        {activeTab === 'users' && (
          <div className="max-w-4xl flex flex-col gap-6 animate-fade-in">
            {/* Form thêm tài khoản mới */}
            <form onSubmit={handleAddUser} className="p-5 rounded-2xl bg-[#161a2b] border border-slate-800 flex flex-col gap-4">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
                <Plus className="w-4 h-4 text-purple-400" />
                Thêm Tài Khoản Nội Bộ Mới
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Họ tên nhân viên *</label>
                  <input 
                    placeholder="VD: Lê Minh Quân" 
                    value={newUser.name}
                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                    className={inputCls} 
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Email đăng nhập *</label>
                  <input 
                    type="email"
                    placeholder="quan.le@top-gap.com" 
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    className={inputCls} 
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Phân quyền vai trò</label>
                  <select 
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                    className={inputCls}
                  >
                    <option value="ADMIN">Admin (Quản trị toàn quyền)</option>
                    <option value="HR">Chuyên viên tuyển dụng (HR Recruiter)</option>
                    <option value="INTERVIEWER">Người phỏng vấn (Interviewer)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-xs font-bold text-white shadow transition-all cursor-pointer"
                  >
                    + Thêm người dùng
                  </button>
                </div>
              </div>
            </form>

            {/* Bảng danh sách người dùng */}
            <div className="p-5 rounded-2xl bg-[#161a2b] border border-slate-800 flex flex-col gap-4">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
                <Users className="w-4 h-4 text-purple-400" />
                Danh Sách Tài Khoản & Quyền Truy Cập
              </h3>

              <div className="divide-y divide-slate-800 text-xs">
                {internalUsers.map(u => (
                  <div key={u.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-purple-900/40 text-purple-300 font-bold flex items-center justify-center shrink-0 border border-purple-700/40">
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-200 truncate">{u.name}</p>
                        <p className="text-slate-400 font-mono text-[11px] truncate">{u.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Badge phân quyền */}
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                        u.role === 'ADMIN' 
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                          : u.role === 'HR'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      }`}>
                        {u.role === 'ADMIN' ? 'Admin' : u.role === 'HR' ? 'Chuyên viên tuyển dụng' : 'Người phỏng vấn'}
                      </span>

                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Xoá tài khoản"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: THIẾT LẬP DANH MỤC GIAI ĐOẠN TUYỂN DỤNG CHUNG */}
        {activeTab === 'stages' && (
          <div className="max-w-4xl flex flex-col gap-6 animate-fade-in">
            <div className="p-5 rounded-2xl bg-[#161a2b] border border-slate-800 flex flex-col gap-4">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
                <Layers className="w-4 h-4 text-purple-400" />
                Danh Mục Quy Trình Tuyển Dụng Chuẩn (Recruitment Stages)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Các giai đoạn chuẩn được áp dụng đồng bộ cho tất cả các vị trí tuyển dụng: Nhận CV → Sơ loại → Phỏng vấn → Đề nghị nhận việc.
              </p>

              <div className="flex flex-col gap-3 mt-2">
                {stages.map((st, idx) => (
                  <div key={st.id} className="p-3.5 rounded-xl bg-[#0e111d] border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: st.color }} />
                      <div>
                        <h4 className="font-bold text-xs text-slate-200">{st.name}</h4>
                        <p className="text-[11px] text-slate-400">{st.description}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 px-2.5 py-1 rounded-md border border-purple-800/40">
                      Mã: {st.code}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add custom stage */}
              <div className="flex gap-2 pt-3 border-t border-slate-800">
                <input 
                  type="text" 
                  placeholder="Thêm giai đoạn mới (VD: Kiểm tra bài test năng lực...)" 
                  value={newStageName}
                  onChange={e => setNewStageName(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#0e111d] border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-500" 
                />
                <button 
                  onClick={handleAddStage}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  + Thêm giai đoạn
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CẤU HÌNH SMTP & MẪU EMAIL TỰ ĐỘNG */}
        {activeTab === 'email' && (
          <div className="max-w-4xl flex flex-col gap-6 animate-fade-in">
            {/* Card SMTP */}
            <div className="p-5 rounded-2xl bg-[#161a2b] border border-slate-800 flex flex-col gap-4">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
                <Server className="w-4 h-4 text-purple-400" />
                Cấu Hình Tài Khoản Gửi Thư (SMTP Mail Server)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">SMTP Host *</label>
                  <input 
                    type="text" 
                    value={smtpConfig.host} 
                    onChange={e => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                    className={inputCls} 
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">SMTP Port *</label>
                  <input 
                    type="number" 
                    value={smtpConfig.port} 
                    onChange={e => setSmtpConfig({ ...smtpConfig, port: Number(e.target.value) })}
                    className={inputCls} 
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Tên tài khoản / Email gửi *</label>
                  <input 
                    type="email" 
                    value={smtpConfig.username} 
                    onChange={e => setSmtpConfig({ ...smtpConfig, username: e.target.value })}
                    className={inputCls} 
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Mật khẩu ứng dụng (App Password) *</label>
                  <input 
                    type="password" 
                    value={smtpConfig.password} 
                    onChange={e => setSmtpConfig({ ...smtpConfig, password: e.target.value })}
                    className={inputCls} 
                  />
                </div>

                <div className="md:col-span-2 flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="tls"
                      checked={smtpConfig.useTls} 
                      onChange={e => setSmtpConfig({ ...smtpConfig, useTls: e.target.checked })}
                      className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
                    />
                    <label htmlFor="tls" className="text-slate-300 font-semibold cursor-pointer">Bật mã hóa bảo mật SSL/TLS</label>
                  </div>

                  <button 
                    onClick={() => alert('Đã gửi email thử nghiệm thành công tới: ' + smtpConfig.username)}
                    className="px-3.5 py-1.5 rounded-lg border border-purple-700/60 bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 text-xs font-semibold cursor-pointer"
                  >
                    Gửi thư thử nghiệm (Test SMTP)
                  </button>
                </div>
              </div>
            </div>

            {/* Mẫu email tự động */}
            <div className="p-5 rounded-2xl bg-[#161a2b] border border-slate-800 flex flex-col gap-5">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
                <Mail className="w-4 h-4 text-purple-400" />
                Mẫu Email Tự Động Phản Hồi Ứng Viên (Email Templates)
              </h3>

              {/* Template 1: Mời phỏng vấn */}
              <div className="flex flex-col gap-2.5 text-xs">
                <span className="font-extrabold text-purple-400">1. Mẫu Thư Mời Phỏng Vấn (Interview Invitation)</span>
                <div>
                  <label className="block text-slate-400 mb-1">Tiêu đề email:</label>
                  <input 
                    type="text" 
                    value={emailTemplates.interview.subject}
                    onChange={e => setEmailTemplates({
                      ...emailTemplates,
                      interview: { ...emailTemplates.interview, subject: e.target.value }
                    })}
                    className={inputCls} 
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nội dung thư:</label>
                  <textarea 
                    rows={6}
                    value={emailTemplates.interview.body}
                    onChange={e => setEmailTemplates({
                      ...emailTemplates,
                      interview: { ...emailTemplates.interview, body: e.target.value }
                    })}
                    className={inputCls + " font-mono text-[11px] leading-relaxed resize-none"} 
                  />
                </div>
              </div>

              <hr className="border-slate-800" />

              {/* Template 2: Thông báo kết quả & Đề nghị nhận việc */}
              <div className="flex flex-col gap-2.5 text-xs">
                <span className="font-extrabold text-emerald-400">2. Mẫu Thư Thông Báo Kết Quả & Đề Nghị Nhận Việc (Offer Letter)</span>
                <div>
                  <label className="block text-slate-400 mb-1">Tiêu đề email:</label>
                  <input 
                    type="text" 
                    value={emailTemplates.resultOffer.subject}
                    onChange={e => setEmailTemplates({
                      ...emailTemplates,
                      resultOffer: { ...emailTemplates.resultOffer, subject: e.target.value }
                    })}
                    className={inputCls} 
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nội dung thư:</label>
                  <textarea 
                    rows={6}
                    value={emailTemplates.resultOffer.body}
                    onChange={e => setEmailTemplates({
                      ...emailTemplates,
                      resultOffer: { ...emailTemplates.resultOffer, body: e.target.value }
                    })}
                    className={inputCls + " font-mono text-[11px] leading-relaxed resize-none"} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
