import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Key, 
  X, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff
} from 'lucide-react';
import api from '../services/api';

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ Email/Tài khoản và Mật khẩu');
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
      // Offline / Static fallback
      const cleanEmail = email.trim().toLowerCase();
      if ((cleanEmail === 'admin@smartats.com' || cleanEmail === 'admin') && password === 'admin123') {
        const fallbackAdmin = {
          id: 'admin-default',
          email: 'admin@smartats.com',
          name: 'Quản Trị Viên (Admin)',
          role: 'ADMIN'
        };
        onLoginSuccess(fallbackAdmin, 'ats_token_admin_demo');
        onClose();
        return;
      } else if ((cleanEmail === 'hr@smartats.com' || cleanEmail === 'hr') && password === 'hr123') {
        const fallbackHr = {
          id: 'hr-default',
          email: 'hr@smartats.com',
          name: 'Chuyên Viên Tuyển Dụng (HR)',
          role: 'HR'
        };
        onLoginSuccess(fallbackHr, 'ats_token_hr_demo');
        onClose();
        return;
      }

      setErrorMsg('Mật khẩu không đúng hoặc tài khoản không tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}>
      <div 
        className="relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 border animate-fade-in-scale"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full transition-colors"
          style={{ color: 'var(--text-faint)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-subtle)'; e.currentTarget.style.color = 'var(--text-heading)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-faint)'; }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md text-white"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-heading)' }}>
            Đăng Nhập Quản Trị
          </h2>
          <p className="text-xs mt-1 max-w-xs mx-auto" style={{ color: 'var(--text-muted)' }}>
            Khu vực dành riêng cho <span className="font-bold" style={{ color: 'var(--accent)' }}>HR Tuyển dụng</span> và <span className="font-bold" style={{ color: '#818cf8' }}>Quản trị viên (Admin)</span>
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 border"
            style={{ background: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.22)', color: '#f87171' }}>
            <X className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Email / Tên tài khoản
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-faint)' }} />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@smartats.com hoặc hr@smartats.com"
                required
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs border transition-colors focus:outline-none ats-input"
                style={{ background: 'var(--bg-card-subtle)', borderColor: 'var(--border-main)', color: 'var(--text-heading)', caretColor: 'var(--accent)' }}
                onFocus={e => { e.target.style.borderColor = 'var(--accent-border)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-main)'; }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Mật khẩu
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-faint)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                required
                className="w-full rounded-xl pl-10 pr-10 py-2.5 text-xs border transition-colors focus:outline-none ats-input"
                style={{ background: 'var(--bg-card-subtle)', borderColor: 'var(--border-main)', color: 'var(--text-heading)', caretColor: 'var(--accent)' }}
                onFocus={e => { e.target.style.borderColor = 'var(--accent-border)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-main)'; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
                style={{ color: 'var(--text-faint)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-faint)'; }}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 16px -4px rgba(245,158,11,0.40)' }}
          >
            {loading ? (
              <span>Đang kiểm tra thông tin...</span>
            ) : (
              <>
                <span>Vào Không Gian Làm Việc</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-[11px]" style={{ color: 'var(--text-faint)' }}>
            * Ứng viên nộp CV không cần đăng nhập. Tài khoản HR/Admin được cấp bởi quản trị viên hệ thống.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
