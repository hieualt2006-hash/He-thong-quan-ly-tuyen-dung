import React, { useState } from 'react';
import { Sparkles, ChevronDown, Loader2, Building2, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import api from '../services/api';


// Hiệu ứng pháo hoa Confetti chúc mừng toàn màn hình
function FullscreenCelebration({ show }) {
  if (!show) return null;
  const pieces = Array.from({ length: 120 }, (_, i) => i);
  const colors = ['#f5a623', '#a855f7', '#10b981', '#f43f5e', '#3b82f6', '#ec4899', '#fbbf24', '#06b6d4'];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Rơi mảnh confetti */}
      {pieces.map(i => {
        const color = colors[i % colors.length];
        const left = Math.random() * 100;
        const delay = Math.random() * 1.5;
        const size = Math.random() * 12 + 6;
        const duration = Math.random() * 2 + 2.5;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '-20px',
              left: `${left}%`,
              width: `${size}px`,
              height: `${size * 0.55}px`,
              background: color,
              borderRadius: i % 3 === 0 ? '50%' : '2px',
              animation: `confettiFall ${duration}s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s forwards`,
              transform: `rotate(${Math.random() * 360}deg)`,
              boxShadow: `0 0 8px ${color}88`
            }}
          />
        );
      })}

      {/* Banner chúc mừng toàn màn hình rực rỡ */}
      <div className="text-center p-8 rounded-3xl bg-[#161a2b]/95 border-2 border-purple-500 shadow-2xl animate-scale-bounce max-w-md mx-4 pointer-events-auto">
        <div className="w-20 h-20 rounded-full bg-purple-700 flex items-center justify-center mx-auto mb-4 shadow-xl">
          <Sparkles className="w-10 h-10 text-white animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
          🎉 Chúc Mừng Bạn!
        </h2>
        <p className="text-sm font-semibold text-purple-300 mb-2">
          Doanh nghiệp đã được khởi tạo thành công trên hệ thống Nhóm 31!
        </p>
        <p className="text-xs text-slate-400">
          Đang chuyển hướng bạn đến màn hình làm việc...
        </p>
        <div className="mt-4 flex justify-center">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        </div>
      </div>
    </div>
  );
}

const SELECT_OPTIONS = {
  countries: ['Việt Nam', 'Hoa Kỳ', 'Nhật Bản', 'Hàn Quốc', 'Singapore', 'Anh', 'Đức', 'Khác'],
  languages: ['Tiếng Việt', 'English', '日本語', '한국어', 'Deutsch'],
  sizes: ['1 - 5 nhân viên', '6 - 10 nhân viên', '11 - 50 nhân viên', '51 - 200 nhân viên', '201 - 1000 nhân viên', '1000+ nhân viên'],
  purposes: ['Sử dụng cho công ty của tôi', 'Dùng thử / Demo', 'Dự án cá nhân', 'Mục đích học tập']
};

export default function LandingView({ onRegisterSuccess, onOpenLogin }) {
  const [form, setForm] = useState({
    ownerName: '',
    companyName: '',
    email: '',
    phone: '',
    country: 'Việt Nam',
    language: 'Tiếng Việt',
    size: '1 - 5 nhân viên',
    purpose: 'Sử dụng cho công ty của tôi',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('ats_theme') || 'light');

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('ats_theme', next);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ownerName || !form.companyName || !form.email) {
      setError('Vui lòng điền đầy đủ họ tên, tên doanh nghiệp và email.');
      return;
    }
    if (form.password && form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let user = null;
      let company = null;
      try {
        const res = await api.post('/company/register', {
          ownerName: form.ownerName,
          companyName: form.companyName,
          email: form.email,
          phone: form.phone,
          country: form.country,
          language: form.language,
          size: form.size,
          purpose: form.purpose,
          password: form.password || 'Admin@123'
        });
        if (res.success && res.data) {
          user = res.data.user;
          company = res.data.company;
        }
      } catch (err) {
        user = {
          id: 'user-admin',
          name: form.ownerName,
          email: form.email,
          role: 'ADMIN',
          companyId: 'company-new'
        };
        company = {
          id: 'company-new',
          name: form.companyName,
          ownerName: form.ownerName,
          email: form.email,
          phone: form.phone
        };
      }

      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        onRegisterSuccess(user, company);
      }, 2500);

    } catch (err) {
      setError('Có lỗi xảy ra trong quá trình khởi tạo công ty. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // ── Theme-aware styles ──────────────────────────────────────
  const bg       = isDark ? 'bg-[#0e111d]'  : 'bg-[#f4f5f8]';
  const headerBg = isDark ? 'bg-[#131726] border-slate-800' : 'bg-white border-slate-200';
  const cardBg   = isDark ? 'bg-[#161a2b] border-slate-800' : 'bg-white border-slate-200';
  const titleCol = isDark ? 'text-slate-100' : 'text-slate-900';
  const subCol   = isDark ? 'text-slate-400' : 'text-slate-500';
  const logoText = isDark ? 'text-slate-100' : 'text-slate-900';

  const inputCls = [
    'w-full px-4 py-3.5 rounded-xl border text-sm transition-all outline-none',
    isDark
      ? 'bg-[#0e111d] text-slate-100 placeholder-slate-500 border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
      : 'bg-white text-slate-800 placeholder-slate-400 border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-200'
  ].join(' ');

  const selectCls = [
    'w-full appearance-none px-4 py-3.5 rounded-xl border text-sm font-medium pr-10 cursor-pointer transition-all outline-none',
    isDark
      ? 'bg-[#0e111d] text-slate-100 border-slate-700 focus:border-purple-500'
      : 'bg-white text-slate-800 border-slate-200 focus:border-purple-600'
  ].join(' ');

  const chevronCol = isDark ? 'text-slate-500' : 'text-slate-400';
  const eyeCol     = isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-700';

  return (
    <>
      <FullscreenCelebration show={showCelebration} />

      <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${bg}`}>
        {/* Header */}
        <header className={`flex items-center justify-between px-6 sm:px-12 py-4 border-b shadow-xs transition-colors duration-300 ${headerBg}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-700 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className={`font-black text-lg tracking-tight ${logoText}`}>
                Nhóm <span className="text-purple-600">31</span>
              </span>
              <span className="text-[10px] text-slate-500 block -mt-1 font-medium">
                Hệ thống quản lý tuyển dụng
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút đổi theme sáng / tối */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark
                  ? 'border-slate-700 bg-[#0e111d] text-slate-300'
                  : 'border-slate-200 bg-slate-100 text-slate-600'
              }`}
            >
              {isDark
                ? <Sun className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4 text-purple-600" />}
            </button>

            {/* Nút đăng nhập */}
            <button
              onClick={onOpenLogin}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-purple-700 border-2 border-purple-600 hover:bg-purple-50 transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>Đăng nhập tài khoản công ty</span>
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-xl">
            <div className="text-center mb-6">
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${titleCol}`}>
                Chào mừng đã đến với phần mềm
              </h1>
              <p className={`text-xs sm:text-sm mt-1.5 ${subCol}`}>
                Thiết lập thông tin công ty của bạn để bắt đầu sử dụng không gian làm việc
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className={`rounded-2xl border p-6 sm:p-8 shadow-sm flex flex-col gap-4 transition-colors duration-300 ${cardBg}`}
            >

              {/* Họ Tên */}
              <input
                type="text"
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                placeholder="Họ Tên"
                required
                className={inputCls}
              />

              {/* Tên doanh nghiệp */}
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Tên doanh nghiệp"
                required
                className={inputCls}
              />

              {/* Email & Số điện thoại */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  autoComplete="new-email"
                  className={inputCls}
                />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Số điện thoại"
                  autoComplete="off"
                  className={inputCls}
                />

              </div>

              {/* Quốc gia & Ngôn ngữ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <select name="country" value={form.country} onChange={handleChange} className={selectCls}>
                    {SELECT_OPTIONS.countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${chevronCol}`} />
                </div>
                <div className="relative">
                  <select name="language" value={form.language} onChange={handleChange} className={selectCls}>
                    {SELECT_OPTIONS.languages.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <ChevronDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${chevronCol}`} />
                </div>
              </div>

              {/* Quy mô & Mục đích */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <select name="size" value={form.size} onChange={handleChange} className={selectCls}>
                    {SELECT_OPTIONS.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${chevronCol}`} />
                </div>
                <div className="relative">
                  <select name="purpose" value={form.purpose} onChange={handleChange} className={selectCls}>
                    {SELECT_OPTIONS.purposes.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${chevronCol}`} />
                </div>
              </div>

              {/* Mật khẩu */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mật khẩu (để trống mặc định: Admin@123)"
                  autoComplete="new-password"
                  className={inputCls + ' pr-11'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer transition-colors ${eyeCol}`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Xác nhận mật khẩu"
                  autoComplete="new-password"
                  className={inputCls + ' pr-11'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer transition-colors ${eyeCol}`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>


              {/* Ô tích hiển thị mật khẩu */}
              <label className={`flex items-center gap-2 text-xs cursor-pointer select-none -mt-1 ${subCol}`}>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(v => !v)}
                  className="w-3.5 h-3.5 rounded accent-purple-600 cursor-pointer"
                />
                Hiển thị mật khẩu
              </label>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-200">
                  {error}
                </div>
              )}

              {/* Nút Tạo công ty */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white text-sm bg-purple-700 hover:bg-purple-600 transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer mt-1 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang khởi tạo doanh nghiệp...</span>
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4" />
                    <span>Bắt đầu ngay</span>
                  </>
                )}
              </button>

              <div className={`text-center text-xs pt-1 ${subCol}`}>
                Đã có tài khoản công ty?{' '}
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="font-bold text-purple-600 hover:underline cursor-pointer"
                >
                  Đăng nhập tài khoản công ty tại đây
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

