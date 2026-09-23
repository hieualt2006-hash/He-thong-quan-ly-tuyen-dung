import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Key, 
  X, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff,
  UserCheck,
  Check
} from 'lucide-react';
import api from '../services/api';

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Danh sách tài khoản công ty có sẵn (Demo 1-Click)
  const DEMO_ACCOUNTS = [
    {
      id: 'admin-nhom20',
      company: 'Nhóm 20',
      role: 'ADMIN',
      roleLabel: 'Quản trị viên (Admin)',
      name: 'Admin',
      email: 'admin@nhom20.com',

      password: 'Admin@123',
      color: '#7c3aed'
    },
    {
      id: 'hr-nhom20',
      company: 'Nhóm 20',
      role: 'HR',
      roleLabel: 'Chuyên viên tuyển dụng (HR)',
      name: 'Trần Thị Bích (HR)',
      email: 'recruiter@nhom20.com',
      password: 'Admin@123',
      color: '#0ea5e9'
    }
  ];

  const handleQuickLogin = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMsg('');
    
    // Tự động đăng nhập luôn với tài khoản công ty có sẵn
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        id: acc.id,
        name: acc.name,
        email: acc.email,
        role: acc.role,
        company: acc.company
      }, `ats_token_${acc.id}`);
      onClose();
    }, 400);
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ Email tài khoản công ty và Mật khẩu');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/login', {
        email: email.trim(),
        password: password
      });

      if (res.success && res.data?.user) {
        onLoginSuccess(res.data.user, res.data.token);
        onClose();
        return;
      } else {
        setErrorMsg(res.message || 'Đăng nhập không thành công');
      }
    } catch (err) {
      // Offline / Static fallback cho các tài khoản demo
      const cleanEmail = email.trim().toLowerCase();
      const matched = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === cleanEmail || cleanEmail.startsWith(a.role.toLowerCase()));
      
      if (matched && (password === matched.password || password === 'admin123' || password === 'hr123')) {
        onLoginSuccess({
          id: matched.id,
          name: matched.name,
          email: matched.email,
          role: matched.role,
          company: matched.company
        }, `ats_token_${matched.id}`);
        onClose();
        return;
      } else if (cleanEmail.includes('admin') && (password === 'Admin@123' || password === 'admin123')) {
        onLoginSuccess({
          id: 'admin-default',
          email: cleanEmail,
          name: 'Admin',
          role: 'ADMIN',
          company: 'Nhóm 20'
        }, 'ats_token_admin_demo');

        onClose();
        return;
      }

      setErrorMsg('Email hoặc Mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 bg-[#161a2b] border border-slate-700/80 text-slate-100 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center mb-5">
          <div className="w-13 h-13 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white shadow-lg bg-purple-700">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Đăng Nhập Tài Khoản Công Ty
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Đăng nhập vào không gian làm việc doanh nghiệp Nhóm 20 để quản lý nhân sự, lịch họp và tuyển dụng
          </p>
        </div>


        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <X className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold mb-1 text-slate-300">
              Email tài khoản công ty
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nhom20.com hoặc email công ty của bạn"
                required
                className="w-full rounded-xl pl-10 pr-4 py-2.5 bg-[#0e111d] border border-slate-700 text-slate-100 placeholder-slate-500 outline-none focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-300">
              Mật khẩu
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                required
                className="w-full rounded-xl pl-10 pr-10 py-2.5 bg-[#0e111d] border border-slate-700 text-slate-100 placeholder-slate-500 outline-none focus:border-purple-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-600 transition-all shadow-lg shadow-purple-700/25 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Đang kiểm tra tài khoản công ty...</span>
            ) : (
              <>
                <span>Đăng Nhập Tài Khoản Công Ty</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
