import React from 'react';
import {
  LayoutDashboard, Briefcase, Users, Sparkles, Server,
  Building2, Calendar, BarChart3, Sliders, Kanban,
  ShieldCheck, Key, LogOut, Globe, ExternalLink, ChevronRight
} from 'lucide-react';

function Sidebar({
  currentView, setCurrentView, serverStatus, counts = {}, theme = 'dark',
  currentUser, onOpenChangePassword, onLogout, onViewPublicPortal
}) {
  const isAdmin = currentUser?.role === 'ADMIN';

  const navGroups = [
    {
      label: 'Tổng Quan',
      items: [
        { id: 'dashboard',  label: 'Dashboard',          icon: LayoutDashboard },
        { id: 'analytics',  label: 'Báo Cáo & Analytics', icon: BarChart3 },
      ]
    },
    {
      label: 'Tuyển Dụng',
      items: [
        { id: 'jobs',         label: 'Tin Tuyển Dụng',      icon: Briefcase,  badge: counts.jobs },
        { id: 'pipeline',     label: 'Bảng Theo Dõi',       icon: Kanban },
        { id: 'applications', label: 'Hồ Sơ Ứng Viên',      icon: Users,      badge: counts.apps },
        { id: 'interviews',   label: 'Lịch Phỏng Vấn',      icon: Calendar },
      ]
    },
    {
      label: 'Tổ Chức',
      items: [
        ...(isAdmin ? [{ id: 'users',       label: 'Quản Lý Tài Khoản', icon: ShieldCheck, tag: 'Admin' }] : []),
        { id: 'departments', label: 'Cơ Cấu Phòng Ban',    icon: Building2 },
        { id: 'settings',    label: 'Cài Đặt & Trọng Số',  icon: Sliders },
      ]
    }
  ];

  const isActive = (id) =>
    currentView === id ||
    (currentView === 'job-detail' && id === 'jobs') ||
    (currentView === 'application-detail' && (id === 'applications' || id === 'pipeline'));

  return (
    <aside
      className="w-60 shrink-0 min-h-screen sticky top-0 z-40 flex flex-col justify-between glass border-r"
      style={{
        background: 'var(--c-surface)',
        borderColor: 'var(--c-border)',
      }}
    >
      <div className="overflow-y-auto flex flex-col gap-1">
        {/* ── Brand ── */}
        <div className="px-4 pt-5 pb-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--c-border)' }}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md"
            style={{ background: 'linear-gradient(135deg, #f5a623 0%, #e8940f 50%, #7c3aed 100%)' }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight" style={{ color: 'var(--c-text-hi)' }}>
                Smart<span style={{ color: 'var(--c-accent)' }}>ATS</span>
              </span>
              <span
                className="text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider border uppercase"
                style={{ background: 'var(--c-accent-dim)', color: 'var(--c-accent)', borderColor: 'var(--c-accent-ring)' }}
              >
                {isAdmin ? 'ADMIN' : 'HR'}
              </span>
            </div>
            <span className="text-[10px] block mt-0.5 font-medium" style={{ color: 'var(--c-text-faint)' }}>
              AI Recruitment System
            </span>
          </div>
        </div>

        {/* ── Public Portal Button ── */}
        {onViewPublicPortal && (
          <div className="px-3 pt-2">
            <button
              onClick={onViewPublicPortal}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
              style={{ background: 'var(--c-card)', borderColor: 'var(--c-border)', color: 'var(--c-text-lo)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-accent-ring)'; e.currentTarget.style.color = 'var(--c-text-hi)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.color = 'var(--c-text-lo)'; }}
            >
              <span className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" style={{ color: 'var(--c-accent)' }} />
                Trang Tuyển Dụng (User)
              </span>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </button>
          </div>
        )}

        {/* ── Nav Groups ── */}
        <nav className="px-3 py-2 flex flex-col gap-4">
          {navGroups.map((grp, gi) => (
            <div key={gi}>
              <p
                className="px-3 mb-1 text-[10px] font-black uppercase tracking-widest"
                style={{ color: 'var(--c-text-faint)' }}
              >
                {grp.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {grp.items.map(item => {
                  const Icon = item.icon;
                  const active = isActive(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className="nav-item w-full text-left"
                      style={active ? {
                        background: 'linear-gradient(135deg, rgba(245,166,35,0.18), rgba(245,166,35,0.06))',
                        color: 'var(--c-accent)',
                        borderColor: 'var(--c-accent-ring)',
                        fontWeight: 700,
                      } : {}}
                    >
                      <Icon
                        className="w-4 h-4 shrink-0"
                        style={{ color: active ? 'var(--c-accent)' : 'var(--c-text-faint)' }}
                      />
                      <span className="flex-1 truncate text-[13px]">{item.label}</span>
                      {item.tag && (
                        <span
                          className="text-[9px] font-black px-1.5 py-0.5 rounded border ml-auto"
                          style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa', borderColor: 'rgba(139,92,246,0.25)' }}
                        >
                          {item.tag}
                        </span>
                      )}
                      {item.badge != null && (
                        <span
                          className="text-[10px] font-black px-1.5 py-0.5 rounded-full ml-auto"
                          style={active
                            ? { background: 'rgba(245,166,35,0.25)', color: 'var(--c-accent)' }
                            : { background: 'var(--c-card)', color: 'var(--c-text-lo)' }
                          }
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* ── Footer ── */}
      <div className="p-3 flex flex-col gap-2 border-t" style={{ borderColor: 'var(--c-border)' }}>
        {/* User card */}
        {currentUser && (
          <div
            className="p-3 rounded-2xl border"
            style={{ background: 'var(--c-card)', borderColor: 'var(--c-border)' }}
          >
            <div className="flex items-center gap-2.5 mb-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 ${
                  isAdmin
                    ? 'bg-gradient-to-tr from-violet-500 to-indigo-600'
                    : 'bg-gradient-to-tr from-amber-500 to-orange-500'
                }`}
              >
                {currentUser.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden flex-1 min-w-0">
                <p className="text-xs font-bold truncate leading-tight" style={{ color: 'var(--c-text-hi)' }}>
                  {currentUser.name}
                </p>
                <p className="text-[10px] truncate font-mono" style={{ color: 'var(--c-text-faint)' }}>
                  {currentUser.email}
                </p>
              </div>
            </div>

            <div className="flex gap-1.5 pt-2 border-t" style={{ borderColor: 'var(--c-border)' }}>
              <button
                onClick={onOpenChangePassword}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ui-btn-ghost"
              >
                <Key className="w-3 h-3" style={{ color: 'var(--c-accent)' }} />
                Đổi MK
              </button>
              <button
                onClick={onLogout}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all"
                style={{ background: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.22)', color: '#f87171' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.16)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
              >
                <LogOut className="w-3 h-3" />
                Đăng xuất
              </button>
            </div>
          </div>
        )}

        {/* Server status pill */}
        <div
          className="px-3 py-2 rounded-xl border flex items-center justify-between text-[10px] font-semibold"
          style={{ background: 'var(--c-card)', borderColor: 'var(--c-border)', color: 'var(--c-text-faint)' }}
        >
          <span className="flex items-center gap-1.5">
            <Server className="w-3 h-3" style={{ color: '#34d399' }} />
            Express + SQLite
          </span>
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-black"
            style={serverStatus === 'online'
              ? { background: 'rgba(52,211,153,0.10)', color: '#34d399', borderColor: 'rgba(52,211,153,0.28)' }
              : { background: 'rgba(251,191,36,0.10)', color: '#fbbf24', borderColor: 'rgba(251,191,36,0.28)' }
            }
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${serverStatus === 'online' ? 'animate-pulse' : ''}`}
              style={{ background: serverStatus === 'online' ? '#34d399' : '#fbbf24' }}
            />
            {serverStatus === 'online' ? 'Online' : 'Checking…'}
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
