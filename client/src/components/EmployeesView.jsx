import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Briefcase, 
  Building2, 
  X, 
  Loader2, 
  Edit, 
  Trash2, 
  ChevronRight, 
  MessageSquare, 
  FileText, 
  Activity, 
  Clock, 
  Users, 
  CheckCircle2, 
  ArrowLeft,
  Calendar
} from 'lucide-react';
import api from '../services/api';

// Demo sample employees matching Ảnh 3 & Ảnh 4 Odoo
const INITIAL_EMPLOYEES = [
  { 
    id: '1', 
    name: 'Emma Granger', 
    email: 'granger@mycompany.example.com', 
    phone: '(555)-768-6230', 
    mobile: '(555)-768-6231',
    position: 'Consultant', 
    department: 'Quản trị', 
    status: 'active', 
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', 
    workAddress: 'Nhóm 20, Việt Nam', 
    workLocation: 'Toà nhà Innovation, Tầng 5',
    tags: ['Consultant', 'Demo'],
    manager: { id: '2', name: 'Michael Williams', position: 'Chief Executive Officer', avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80' }, 
    workSchedule: { mon: 'Văn phòng', tue: 'Văn phòng', wed: 'Làm việc từ xa', thu: 'Văn phòng', fri: 'Văn phòng' }
  },
  { 
    id: '2', 
    name: 'Michael Williams', 
    email: 'williams@mycompany.example.com', 
    phone: '(555)-768-6230', 
    mobile: '(555)-768-6232',
    position: 'Chief Executive Officer', 
    department: 'Quản trị', 
    status: 'active', 
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80', 
    workAddress: 'Nhóm 20, Việt Nam', 
    workLocation: 'Văn phòng Tổng Giám Đốc',
    tags: ['Employee', 'Demo'],
    manager: null, 
    workSchedule: { mon: 'Văn phòng', tue: 'Văn phòng', wed: 'Văn phòng', thu: 'Văn phòng', fri: 'Văn phòng' }
  },
  { 
    id: '3', 
    name: 'Simon Jones', 
    email: 'jones@mycompany.example.com', 
    phone: '(555)-768-6230', 
    mobile: '(555)-768-6235',
    position: 'Experienced Developer', 
    department: 'Research & Development', 
    status: 'active', 
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80', 
    workAddress: 'Nhóm 20, Việt Nam', 
    workLocation: 'VD: Toà 2, Từ xa...',
    tags: ['Employee', 'Demo'],
    manager: { id: '2', name: 'Michael Williams', position: 'Chief Executive Officer', avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80' }, 
    workSchedule: { mon: 'Làm việc từ xa', tue: 'Văn phòng', wed: 'Văn phòng', thu: 'Làm việc từ xa', fri: 'Văn phòng' }
  },
];

export default function EmployeesView() {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('Tất cả');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('job'); // 'job', 'resume', 'personal', 'salary', 'settings'
  const [showAddModal, setShowAddModal] = useState(false);
  const [notes, setNotes] = useState([
    { id: '1', author: 'Hieu Trung', time: '21:15', text: 'Congratulations! May I recommend you to setup an onboarding plan?' },
    { id: '2', author: 'Hieu Trung', time: '21:15', text: 'Employee được tạo trong hệ thống' }
  ]);
  const [newNote, setNewNote] = useState('');

  // Fetch employees from API with fallback
  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setEmployees(res.data);
      }
    } catch (e) {
      // Fallback already set
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Department counts
  const departments = ['Tất cả', 'Quản trị', 'Research & Development'];
  const getDeptCount = (dept) => {
    if (dept === 'Tất cả') return employees.length;
    return employees.filter(e => e.department === dept).length;
  };

  // Filtered employees list
  const filtered = employees.filter(e => {
    const matchDept = selectedDept === 'Tất cả' || e.department === selectedDept;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || 
                        e.position.toLowerCase().includes(search.toLowerCase()) ||
                        e.email.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([
      ...notes,
      { id: Date.now().toString(), author: 'Tôi', time: 'Vừa xong', text: newNote }
    ]);
    setNewNote('');
  };

  // -------------------------------------------------------------
  // VIEW 2: CHI TIẾT NHÂN VIÊN (Ảnh 4 Odoo)
  // -------------------------------------------------------------
  if (selectedEmployee) {
    const emp = selectedEmployee;
    return (
      <div className="flex flex-col h-full bg-[#111422] text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl animate-fade-in">
        {/* Detail Top Action Bar */}
        <div className="px-5 py-3 border-b border-slate-800 bg-[#161a2b] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <button 
              onClick={() => setSelectedEmployee(null)}
              className="p-1.5 rounded-lg bg-[#0e111d] hover:bg-slate-800 text-slate-300 transition-all flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>
            <span className="text-slate-500">/</span>
            <button 
              onClick={() => setSelectedEmployee(null)} 
              className="text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Nhân viên
            </button>
            <span className="text-slate-500">/</span>
            <span className="font-bold text-slate-200">{emp.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-900/40 text-purple-300 border border-purple-700/50 hover:bg-purple-900/60 transition-all">
              Người tạo
            </button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0e111d] border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all">
              Bắt đầu kế hoạch
            </button>
            <span className="px-2.5 py-1 text-xs font-mono bg-[#0e111d] text-slate-400 rounded-lg border border-slate-800">
              7 thg 9, 2026
            </span>
          </div>
        </div>

        {/* Detail Main Content: Left Detail + Right Activity/Chat */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Main Info Columns */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* Header: Avatar, Name, Contact, Tags */}
            <div className="flex flex-wrap sm:flex-nowrap items-start gap-5">
              <img 
                src={emp.avatarUrl} 
                alt={emp.name} 
                className="w-24 h-28 object-cover rounded-xl border-2 border-slate-700 shadow-lg shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-black text-slate-100 tracking-tight">{emp.name}</h1>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Đang làm việc
                  </span>
                </div>

                <div className="mt-2 flex flex-col gap-1.5 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                    {emp.mobile && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <span>Di động: {emp.mobile}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 mt-3">
                  {(emp.tags || ['Employee', 'Demo']).map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#1e2338] text-slate-300 border border-slate-700"
                    >
                      {tag} ×
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Tabs: [Công việc] [CV] [Cá nhân] [Bảng lương] [Cài đặt] */}
            <div className="border-b border-slate-800 flex items-center gap-6 text-xs font-bold">
              {[
                { id: 'job', label: 'Công việc' },
                { id: 'resume', label: 'CV & Kỹ năng' },
                { id: 'personal', label: 'Cá nhân' },
                { id: 'salary', label: 'Bảng lương' },
                { id: 'settings', label: 'Cài đặt' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-2.5 transition-all relative cursor-pointer ${
                    activeTab === tab.id 
                      ? 'text-purple-400 border-b-2 border-purple-500' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: CÔNG VIỆC (Ảnh 4) */}
            {activeTab === 'job' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Left Column: CÔNG VIỆC & VỊ TRÍ */}
                <div className="flex flex-col gap-5">
                  <div className="p-4 rounded-xl bg-[#0e111d] border border-slate-800/80 flex flex-col gap-3">
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">CÔNG VIỆC</h3>
                    <div className="flex flex-col gap-2.5">
                      <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                        <span className="text-slate-400">Phòng ban</span>
                        <span className="font-semibold text-slate-200">{emp.department}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                        <span className="text-slate-400">Vị trí công việc</span>
                        <span className="font-semibold text-slate-200">{emp.position}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                        <span className="text-slate-400">Chức danh</span>
                        <span className="font-semibold text-slate-200">{emp.position}</span>
                      </div>
                      <div className="flex justify-between items-center pt-0.5">
                        <span className="text-slate-400">Quản lý</span>
                        {emp.manager ? (
                          <div className="flex items-center gap-2">
                            <img src={emp.manager.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                            <span className="font-semibold text-purple-300">{emp.manager.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0e111d] border border-slate-800/80 flex flex-col gap-3">
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">VỊ TRÍ</h3>
                    <div className="flex flex-col gap-2">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Địa chỉ làm việc</span>
                        <span className="font-semibold text-slate-200">{emp.workAddress || 'Nhóm 20, Việt Nam'}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-800/60">
                        <span className="text-slate-400 block mb-0.5">Vị trí làm việc</span>
                        <span className="font-semibold text-slate-200">{emp.workLocation || 'VD: Toà 2, Từ xa...'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: ORGANIZATION CHART & USUAL WORK LOCATION */}
                <div className="flex flex-col gap-5">
                  {/* Organization Chart */}
                  <div className="p-4 rounded-xl bg-[#0e111d] border border-slate-800/80 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">ORGANIZATION CHART</h3>
                      <span className="text-[10px] text-purple-400 font-bold">▲ FULL CHART</span>
                    </div>

                    <div className="flex flex-col gap-3 pt-1">
                      {/* Manager */}
                      {emp.manager && (
                        <div className="p-2.5 rounded-lg bg-[#161a2b] border border-slate-700/60 flex items-center gap-2.5">
                          <img src={emp.manager.avatarUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs text-slate-200 truncate">{emp.manager.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{emp.manager.position}</p>
                          </div>
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] flex items-center justify-center text-slate-300 font-bold">2</span>
                        </div>
                      )}

                      {/* Current Employee */}
                      <div className="ml-5 p-2.5 rounded-lg bg-purple-950/40 border border-purple-700/60 flex items-center gap-2.5">
                        <img src={emp.avatarUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-purple-200 truncate">{emp.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{emp.position}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Usual Work Location / Schedule */}
                  <div className="p-4 rounded-xl bg-[#0e111d] border border-slate-800/80 flex flex-col gap-3">
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">USUAL WORK LOCATION</h3>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {Object.entries(emp.workSchedule || {}).map(([day, loc]) => (
                        <div key={day} className="flex items-center justify-between p-1.5 rounded bg-[#161a2b] border border-slate-800">
                          <span className="text-slate-400 capitalize">{day}</span>
                          <span className="font-semibold text-slate-200">{loc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'job' && (
              <div className="p-8 text-center text-slate-500 bg-[#0e111d] rounded-xl border border-slate-800">
                <FileText className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                <p className="font-semibold">Thông tin {activeTab.toUpperCase()}</p>
                <p className="text-xs text-slate-500 mt-1">Dữ liệu chi tiết đã được đồng bộ với hồ sơ bảo mật nội bộ.</p>
              </div>
            )}
          </div>

          {/* Right Side Activity & Chat Feed (Ảnh 4) */}
          <div className="w-full lg:w-80 shrink-0 bg-[#131726] p-4 flex flex-col justify-between">
            <div>
              {/* Activity Actions Header */}
              <div className="flex items-center gap-1.5 pb-3 border-b border-slate-800 text-xs">
                <button className="px-2.5 py-1 rounded bg-[#0e111d] hover:bg-slate-800 text-slate-300 font-medium">Gửi tin</button>
                <button className="px-2.5 py-1 rounded bg-[#0e111d] hover:bg-slate-800 text-slate-300 font-medium">Ghi chú</button>
                <button className="px-2.5 py-1 rounded bg-[#0e111d] hover:bg-slate-800 text-slate-300 font-medium">Hoạt động</button>
              </div>

              {/* Feed items */}
              <div className="flex flex-col gap-3.5 mt-4 text-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">Hôm nay</span>
                {notes.map(note => (
                  <div key={note.id} className="flex items-start gap-2.5 bg-[#0e111d] p-3 rounded-xl border border-slate-800/80">
                    <div className="w-6 h-6 rounded bg-purple-700 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                      {note.author.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-slate-300">{note.author}</span>
                        <span>{note.time}</span>
                      </div>
                      <p className="text-slate-200 text-xs mt-1 leading-relaxed">{note.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick send note input */}
            <form onSubmit={handleAddNote} className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
              <input 
                type="text"
                placeholder="Ghi chú nhanh..."
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#0e111d] border border-slate-700 text-xs text-slate-200 outline-none focus:border-purple-500"
              />
              <button 
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-xs font-bold text-white cursor-pointer"
              >
                Gửi
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 1: DANH SÁCH NHÂN VIÊN KANBAN (Ảnh 3 Odoo)
  // -------------------------------------------------------------
  return (
    <div className="flex flex-col h-full bg-[#111422] text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Action Header Bar */}
      <div className="px-5 py-3 border-b border-slate-800 bg-[#161a2b] flex flex-wrap items-center justify-between gap-3">
        {/* Left: Button "Mới" + Breadcrumb "Nhân viên" */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-700 hover:bg-purple-600 transition-all shadow flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Mới</span>
          </button>
          
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <span>Nhân viên</span>
          </div>
        </div>

        {/* Center: Search */}
        <div className="relative w-80 max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Tìm kiếm nhân viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-[#0e111d] border border-slate-700/60 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
          />
        </div>

        {/* Right count */}
        <div className="text-xs text-slate-400 font-mono">
          1-{filtered.length}/{employees.length}
        </div>
      </div>

      {/* Main Container: Sidebar Departments on Left + Grid Cards on Right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: PHÒNG BAN (Ảnh 3) */}
        <div className="w-56 shrink-0 bg-[#131726] border-r border-slate-800 p-3 flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-2 py-1">
            PHÒNG BAN
          </span>

          <div className="flex flex-col gap-1">
            {departments.map(dept => {
              const count = getDeptCount(dept);
              const isActive = selectedDept === dept;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-purple-900/40 text-purple-300 border border-purple-700/50' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate">{dept}</span>
                  <span className="text-[10px] font-mono text-slate-500">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Area: Grid of Employee Cards (Ảnh 3 Odoo) */}
        <div className="flex-1 p-5 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(emp => (
              <div 
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className="p-4 rounded-xl bg-[#161a2b] border border-slate-800 hover:border-purple-600/70 hover:shadow-xl transition-all cursor-pointer flex gap-3.5 group relative"
              >
                {/* Avatar Image */}
                <img 
                  src={emp.avatarUrl} 
                  alt={emp.name} 
                  className="w-16 h-20 object-cover rounded-lg border border-slate-700 shadow-md shrink-0 group-hover:scale-105 transition-transform" 
                />

                {/* Card Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between text-xs">
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 group-hover:text-purple-300 transition-colors truncate">
                      {emp.name}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 text-slate-400 mt-1 truncate">
                      <Briefcase className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="truncate">{emp.position}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 mt-1 truncate">
                      <Mail className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="truncate">{emp.email}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 mt-1 truncate">
                      <Phone className="w-3 h-3 text-purple-400 shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 mt-2.5">
                    {(emp.tags || ['Consultant', 'Demo']).map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#111422] text-slate-400 border border-slate-800"
                      >
                        {tag}
                      </span>
                    ))}
                    <Clock className="w-3 h-3 text-slate-500 ml-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="font-bold text-sm">Không tìm thấy nhân viên nào</p>
              <p className="text-xs text-slate-500 mt-1">Thử thay đổi bộ lọc phòng ban hoặc từ khóa tìm kiếm</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#161a2b] border border-slate-700/80 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                Thêm Nhân Viên Mới
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const newEmp = {
                id: Date.now().toString(),
                name: fd.get('name'),
                email: fd.get('email'),
                phone: fd.get('phone'),
                position: fd.get('position'),
                department: fd.get('department'),
                status: 'active',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
                workAddress: 'Nhóm 20, Việt Nam',
                workLocation: 'Toà nhà chính',
                tags: ['Employee'],
                manager: { name: 'Michael Williams', position: 'CEO', avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80' },
                workSchedule: { mon: 'Văn phòng', tue: 'Văn phòng', wed: 'Văn phòng', thu: 'Văn phòng', fri: 'Văn phòng' }
              };
              setEmployees([...employees, newEmp]);
              setShowAddModal(false);
            }} className="py-4 flex flex-col gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Họ và tên *</label>
                <input name="name" required placeholder="VD: Nguyễn Văn Nam" className="w-full px-3 py-2 rounded-xl bg-[#0e111d] border border-slate-700 text-slate-100 outline-none focus:border-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Email *</label>
                  <input name="email" type="email" required placeholder="nam@company.com" className="w-full px-3 py-2 rounded-xl bg-[#0e111d] border border-slate-700 text-slate-100 outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Số điện thoại</label>
                  <input name="phone" placeholder="(555)-123-456" className="w-full px-3 py-2 rounded-xl bg-[#0e111d] border border-slate-700 text-slate-100 outline-none focus:border-purple-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Chức vụ *</label>
                  <input name="position" required placeholder="VD: Developer..." className="w-full px-3 py-2 rounded-xl bg-[#0e111d] border border-slate-700 text-slate-100 outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Phòng ban</label>
                  <select name="department" className="w-full px-3 py-2 rounded-xl bg-[#0e111d] border border-slate-700 text-slate-100 outline-none">
                    <option value="Research & Development">Research & Development</option>
                    <option value="Quản trị">Quản trị</option>
                    <option value="Nhân sự">Nhân sự</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 cursor-pointer">
                  Hủy
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 font-bold text-white cursor-pointer">
                  Lưu nhân viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
