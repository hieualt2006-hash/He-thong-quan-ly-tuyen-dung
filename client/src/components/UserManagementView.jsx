import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  UserCheck, 
  Trash2, 
  Key, 
  Mail, 
  Plus, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Lock,
  Search
} from 'lucide-react';
import api from '../services/api';

function UserManagementView({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'HR'
  });
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/users');
      if (res.success && Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMsg('Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu khởi tạo');
      return;
    }

    try {
      setCreating(true);
      const res = await api.post('/auth/users', formData);
      if (res.success) {
        setSuccessMsg(`🎉 ${res.message}`);
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'HR'
        });
        fetchUsers();
        setTimeout(() => {
          setIsCreateOpen(false);
          setSuccessMsg('');
        }, 1500);
      } else {
        setErrorMsg(res.message || 'Không thể tạo tài khoản');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi tạo tài khoản');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (userToDelete) => {
    if (userToDelete.id === currentUser?.id) {
      alert('Bạn không thể tự xóa tài khoản của chính mình!');
      return;
    }

    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xoá tài khoản: ${userToDelete.name} (${userToDelete.email})?`);
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/auth/users/${userToDelete.id}?currentUserId=${currentUser?.id}`);
      if (res.success) {
        alert('Đã xoá tài khoản thành công!');
        fetchUsers();
      } else {
        alert(res.message || 'Không thể xoá tài khoản');
      }
    } catch (err) {
      alert('Lỗi khi xoá tài khoản: ' + err.message);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const hrCount = users.filter(u => u.role === 'HR').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Quản Trị Người Dùng & Cấp Quyền
            </h2>
            <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              Chỉ Dành Cho Admin
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Chỉ Quản trị viên (Admin) mới có quyền tạo mới, cấp tài khoản và xoá quyền truy cập của các thành viên HR hoặc Admin khác.
          </p>
        </div>

        <button
          onClick={() => { setIsCreateOpen(true); setErrorMsg(''); setSuccessMsg(''); }}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-lg shadow-orange-500/25 active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Cấp Tài Khoản Mới</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/70 border border-slate-800 p-4.5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Tổng số tài khoản</span>
            <h4 className="text-2xl font-black text-white mt-0.5">{users.length}</h4>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 p-4.5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Quản trị viên (Admin)</span>
            <h4 className="text-2xl font-black text-indigo-400 mt-0.5">{adminCount}</h4>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 p-4.5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Chuyên viên tuyển dụng (HR)</span>
            <h4 className="text-2xl font-black text-orange-400 mt-0.5">{hrCount}</h4>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="font-bold text-sm text-white">Danh Sách Thành Viên Quản Trị</h3>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên, email, vai trò..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">Thành viên</th>
                <th className="pb-3 px-3">Email Đăng Nhập</th>
                <th className="pb-3 px-3">Vai Trò</th>
                <th className="pb-3 px-3">Ngày Tạo</th>
                <th className="pb-3 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => {
                const isSelf = u.id === currentUser?.id;
                const isAdmin = u.role === 'ADMIN';

                return (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          isAdmin 
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-500/30' 
                            : 'bg-orange-600 text-white ring-2 ring-orange-500/30'
                        }`}>
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isSelf && (
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-semibold">
                                Bạn
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        isAdmin 
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' 
                          : 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                      }`}>
                        {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                        {isAdmin ? 'Quản Trị Viên (ADMIN)' : 'Tuyển Dụng (HR)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : 'Mặc định'}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleDeleteUser(u)}
                        disabled={isSelf}
                        title={isSelf ? 'Không thể tự xoá chính mình' : 'Xoá tài khoản này'}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-8 text-slate-500 text-xs">
              Không tìm thấy tài khoản nào phù hợp
            </div>
          )}
        </div>
      </div>

      {/* Modal Cấp Tài Khoản Mới */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div 
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-2xl flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Cấp Tài Khoản Mới</h3>
                <p className="text-xs text-slate-400">Tạo tài khoản quản trị cho HR hoặc Admin</p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Họ và tên người dùng</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email đăng nhập</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ví dụ: hr.nguyenvana@smartats.com"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mật khẩu khởi tạo</label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Nhập mật khẩu ban đầu..."
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Phân quyền vai trò</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'HR' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.role === 'HR'
                        ? 'bg-orange-500/10 border-orange-500 text-orange-400 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>HR Recruiter</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Quản lý job, ứng viên, phỏng vấn</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.role === 'ADMIN'
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>System Admin</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Toàn quyền hệ thống & quản trị user</p>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 disabled:opacity-50"
                >
                  {creating ? 'Đang tạo...' : 'Tạo & Cấp Tài Khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagementView;
