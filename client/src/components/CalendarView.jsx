import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Plus, 
  Calendar as CalendarIcon, 
  List, 
  Clock, 
  Check, 
  X, 
  Video, 
  Users, 
  MapPin, 
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  Pencil,
  Trash2,
  Copy
} from 'lucide-react';

export default function CalendarView({ currentUser, theme, isLight: propIsLight }) {
  const isLight = propIsLight !== undefined ? propIsLight : theme === 'light';
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 7));
  const [viewMode, setViewMode] = useState('week');
  const [displayType, setDisplayType] = useState('calendar');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGoogleSyncing, setIsGoogleSyncing] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Context menu state
  const [contextMenu, setContextMenu] = useState(null); // { x, y, event }
  // Edit modal state
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState('');
  const contextMenuRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };



  // Calendars filter state
  const [calendars, setCalendars] = useState([
    { id: 'user', name: currentUser?.name || 'Hieu Trung', color: '#e11d48', checked: true },
    { id: 'interviews', name: 'Lịch phỏng vấn tuyển dụng', color: '#f59e0b', checked: true },
    { id: 'activities', name: 'My Activities', color: '#10b981', checked: true },
  ]);

  // Sample initial events based on recruitment ATS and meetings (Ảnh 2 Odoo)
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Phỏng vấn: Senior Node.js Engineer (Trần Văn Hoàng)',
      dayIndex: 0, // Thứ 2
      startHour: 9.5, // 9:30
      duration: 1.5,
      type: 'interview',
      color: '#f59e0b',
      location: 'Google Meet (meet.google.com/ats-meet)',
      participants: ['Trần Văn Hoàng', 'HR Lead', 'Tech Lead']
    },
    {
      id: '2',
      title: 'Họp giao ban đầu tuần bộ phận Tuyển dụng',
      dayIndex: 0, // Thứ 2
      startHour: 14,
      duration: 1,
      type: 'meeting',
      color: '#e11d48',
      location: 'Phòng họp A1 & Trực tuyến',
      participants: ['Toàn bộ phòng HR']
    },
    {
      id: '3',
      title: 'Sàng lọc CV đợt 2: AI / Machine Learning',
      dayIndex: 2, // Thứ 4
      startHour: 10,
      duration: 2,
      type: 'activity',
      color: '#10b981',
      location: 'Bàn làm việc',
      participants: ['Chuyên viên tuyển dụng']
    },
    {
      id: '4',
      title: 'Phỏng vấn vòng 2: AI Engineer (Lê Minh Quân)',
      dayIndex: 3, // Thứ 5
      startHour: 15,
      duration: 1.5,
      type: 'interview',
      color: '#f59e0b',
      location: 'Phòng phỏng vấn online 02',
      participants: ['Lê Minh Quân', 'CTO']
    }
  ]);

  // Form state for creating new event
  const [newEvent, setNewEvent] = useState({
    title: '',
    dayIndex: 0,
    startHour: 9,
    duration: 1,
    location: 'Google Meet',
    type: 'meeting'
  });

  // Week days calculation around currentDate (Monday to Sunday)
  const getWeekDates = (baseDate) => {
    const current = new Date(baseDate);
    const day = current.getDay(); // 0 is Sunday, 1 is Monday...
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));

    const week = [];
    const dayNames = ['THỨ 2', 'THỨ 3', 'THỨ 4', 'THỨ 5', 'THỨ 6', 'THỨ 7', 'CN'];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(monday);
      nextDate.setDate(monday.getDate() + i);
      week.push({
        name: dayNames[i],
        date: nextDate.getDate(),
        fullDate: nextDate,
        isToday: nextDate.getDate() === 7 && nextDate.getMonth() === 8 // Mock 7/9/2026
      });
    }
    return week;
  };

  const weekDays = getWeekDates(currentDate);

  // Time slots from 06:00 to 19:00 (Odoo screenshot Ảnh 2)
  const hours = Array.from({ length: 14 }, (_, i) => i + 6); // 6 to 19

  const handlePrevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const handleNextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 8, 7));
  };

  const handleToggleCalendar = (id) => {
    setCalendars(calendars.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const handleSlotClick = (dayIndex, hour) => {
    setSelectedSlot({ dayIndex, hour });
    setNewEvent({
      title: 'Cuộc họp mới',
      dayIndex,
      startHour: hour,
      duration: 1,
      location: 'Google Meet',
      type: 'meeting'
    });
    setShowEventModal(true);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    const created = {
      id: Date.now().toString(),
      title: newEvent.title,
      dayIndex: Number(newEvent.dayIndex),
      startHour: Number(newEvent.startHour),
      duration: Number(newEvent.duration),
      type: newEvent.type,
      color: newEvent.type === 'interview' ? '#f59e0b' : newEvent.type === 'activity' ? '#10b981' : '#e11d48',
      location: newEvent.location,
      participants: ['Tôi']
    };

    setEvents([...events, created]);
    setShowEventModal(false);
  };

  // ── Context menu handlers ──────────────────────────────────
  const handleEventContextMenu = (e, ev) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, event: ev });
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleEditFromContext = () => {
    if (!contextMenu?.event) return;
    setEditingEvent({ ...contextMenu.event });
    setShowEditModal(true);
    closeContextMenu();
  };

  const handleDeleteFromContext = () => {
    if (!contextMenu?.event) return;
    setEvents(prev => prev.filter(ev => ev.id !== contextMenu.event.id));
    closeContextMenu();
    showToast('Đã xóa sự kiện thành công!');
  };

  const handleCopyLocation = () => {
    if (contextMenu?.event?.location) {
      navigator.clipboard.writeText(contextMenu.event.location).catch(() => {});
      showToast('Đã sao chép địa điểm / link họp!');
    } else {
      showToast('Sự kiện không có địa điểm / link họp');
    }
    closeContextMenu();
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingEvent?.title?.trim()) return;
    setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? {
      ...ev,
      title: editingEvent.title,
      dayIndex: Number(editingEvent.dayIndex),
      startHour: Number(editingEvent.startHour),
      duration: Number(editingEvent.duration),
      location: editingEvent.location,
      type: editingEvent.type,
      color: editingEvent.type === 'interview' ? '#f59e0b' : editingEvent.type === 'activity' ? '#10b981' : '#e11d48',
    } : ev));
    setShowEditModal(false);
    setEditingEvent(null);
    showToast('Đã cập nhật sự kiện thành công!');
  };

  // Close context menu on click outside or Escape
  useEffect(() => {
    const handleClick = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        closeContextMenu();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeContextMenu();
        setShowEditModal(false);
        setShowEventModal(false);
      }
    };
    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);




  const handleGoogleSync = () => {
    setIsGoogleSyncing(true);
    setTimeout(() => {
      setIsGoogleSyncing(false);
      setIsGoogleConnected(true);
      setShowSyncModal(false);
      // Add a synced meeting
      setEvents(prev => [
        ...prev,
        {
          id: 'google-sync-1',
          title: '[Google Calendar] Đồng bộ lịch phỏng vấn Q4',
          dayIndex: 1, // Thứ 3
          startHour: 10,
          duration: 1,
          type: 'meeting',
          color: '#4285f4',
          location: 'Google Meet (meet.google.com/sync-nhom20)',
          participants: ['hieu.trung@company.com', 'team-recruitment@company.com']
        }
      ]);
    }, 1200);
  };

  const activeCalendars = calendars.filter(c => c.checked).map(c => c.id);
  const filteredEvents = events.filter(ev => {
    if (ev.type === 'interview' && !activeCalendars.includes('interviews')) return false;
    if (ev.type === 'meeting' && !activeCalendars.includes('user')) return false;
    if (ev.type === 'activity' && !activeCalendars.includes('activities')) return false;
    if (searchQuery.trim()) {
      return ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             ev.location.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className={`flex flex-col h-full rounded-2xl border overflow-hidden shadow-2xl transition-colors ${
      isLight 
        ? 'bg-white text-slate-800 border-slate-200' 
        : 'bg-[#111422] text-slate-100 border-slate-800/80'
    }`}>
      {/* Top action header bar */}
      <div className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
        isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#161a2b] border-slate-800 text-slate-100'
      }`}>
        {/* Left: Button "Mới" + Breadcrumb "Cuộc họp" */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setNewEvent({
                title: 'Cuộc họp mới',
                dayIndex: 0,
                startHour: 9,
                duration: 1,
                location: 'Google Meet',
                type: 'meeting'
              });
              setShowEventModal(true);
            }}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-700 hover:bg-purple-600 transition-all shadow flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Mới</span>
          </button>
          
          <div className={`flex items-center gap-2 text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            <span>Cuộc họp</span>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="relative w-80 max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-1.5 rounded-lg border text-xs focus:outline-none focus:border-purple-500 transition-all ${
              isLight 
                ? 'bg-white border-slate-200 text-slate-800 placeholder-slate-400' 
                : 'bg-[#0e111d] border-slate-700/60 text-slate-200 placeholder-slate-500'
            }`}
          />
        </div>

        {/* Right: View switches */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center p-0.5 rounded-lg border text-xs ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0e111d] border-slate-700/60'
          }`}>
            <button 
              onClick={() => setDisplayType('calendar')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                displayType === 'calendar' 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Xem dạng Lịch"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setDisplayType('list')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                displayType === 'list' 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Xem danh sách"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-header: Navigation, Date range & Google Sync Button */}
      <div className={`px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
        isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#131726] border-slate-800 text-slate-300'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`flex items-center rounded-lg border overflow-hidden ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e111d] border-slate-700/60'
          }`}>
            <button 
              onClick={handlePrevWeek} 
              className={`p-1.5 cursor-pointer transition-colors ${
                isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleNextWeek} 
              className={`p-1.5 border-l cursor-pointer transition-colors ${
                isLight 
                  ? 'hover:bg-slate-200 text-slate-600 border-slate-200' 
                  : 'hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <select 
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className={`border rounded-lg px-2.5 py-1 font-medium outline-none cursor-pointer ${
              isLight 
                ? 'bg-slate-50 border-slate-200 text-slate-700' 
                : 'bg-[#0e111d] border-slate-700/60 text-slate-300'
            }`}
          >
            <option value="week">Tuần</option>
            <option value="day">Ngày</option>
            <option value="month">Tháng</option>
          </select>

          <button 
            onClick={handleToday}
            className={`px-3 py-1 rounded-lg border font-medium cursor-pointer transition-colors ${
              isLight 
                ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700' 
                : 'bg-[#0e111d] border-slate-700/60 hover:bg-slate-800 text-slate-300'
            }`}
          >
            Hôm nay
          </button>

          <span className={`font-bold text-sm ml-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
            tháng 9 2026 <span className={`font-normal text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Tuần 37</span>
          </span>
        </div>

        {/* Sync with Google Calendar */}
        <div className="flex items-center gap-2">
          <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Đồng bộ với</span>
          <button 
            onClick={() => setShowSyncModal(true)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all font-semibold cursor-pointer ${
              isGoogleConnected 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500' 
                : isLight 
                  ? 'bg-slate-50 border-slate-200 hover:border-slate-400 text-slate-700'
                  : 'bg-[#0e111d] border-slate-700/70 hover:border-slate-500 text-slate-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{isGoogleConnected ? 'Google (Đã đồng bộ)' : 'Google'}</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {displayType === 'list' ? (
          /* List View */
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-2.5">
            {filteredEvents.length === 0 ? (
              <div className={`text-center py-16 text-sm ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                Không tìm thấy sự kiện nào
              </div>
            ) : (
              filteredEvents.map(ev => (
                <div
                  key={ev.id}
                  onClick={() => { setEditingEvent({ ...ev }); setShowEditModal(true); }}
                  onContextMenu={(e) => handleEventContextMenu(e, ev)}
                  className={`p-3.5 rounded-xl border border-l-4 transition-all flex items-center justify-between gap-4 cursor-pointer select-none ${
                    isLight
                      ? 'bg-white border-slate-200 shadow-xs hover:bg-slate-50 text-slate-800'
                      : 'bg-[#161a2b] border-slate-800 hover:bg-[#1f243c] text-slate-100'
                  }`}
                  style={{ borderLeftColor: ev.color }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate">{ev.title}</div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>{weekDays[ev.dayIndex]?.name || 'Thứ ?'}, {weekDays[ev.dayIndex]?.date}/9/2026</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {String(Math.floor(ev.startHour)).padStart(2, '0')}:{ev.startHour % 1 === 0.5 ? '30' : '00'} ({ev.duration}h)
                      </span>
                      {ev.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-purple-400" />
                            {ev.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingEvent({ ...ev });
                        setShowEditModal(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-500/10 cursor-pointer transition-colors"
                      title="Chỉnh sửa lịch"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEvents(prev => prev.filter(item => item.id !== ev.id));
                        showToast('Đã xóa sự kiện thành công!');
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors"
                      title="Xóa lịch"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Calendar Grid View */
          <div className={`flex-1 flex flex-col overflow-y-auto border-r ${
            isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-[#111422]'
          }`}>
            {/* Days Header */}
            <div className={`grid grid-cols-[60px_repeat(7,1fr)] border-b sticky top-0 z-20 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141829] border-slate-800'
            }`}>
              <div className={`py-2.5 px-2 border-r text-[11px] font-mono text-center select-none ${
                isLight ? 'border-slate-200 text-slate-400' : 'border-slate-800 text-slate-500'
              }`}>
                Giờ
              </div>
              {weekDays.map((d, i) => (
                <div 
                  key={i} 
                  className={`py-2 px-1 text-center border-r last:border-r-0 ${
                    isLight ? 'border-slate-200' : 'border-slate-800/80'
                  } ${d.isToday ? (isLight ? 'bg-purple-50' : 'bg-purple-950/30') : ''}`}
                >
                  <span className={`block text-[10px] font-bold tracking-wider ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {d.name}
                  </span>
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black mt-0.5 ${
                    d.isToday 
                      ? 'bg-red-500 text-white shadow-md' 
                      : (isLight ? 'text-slate-800' : 'text-slate-200')
                  }`}>
                    {d.date}
                  </span>
                </div>
              ))}
            </div>

            {/* Grid Body: Time column + 7 Day columns with stacked events layer */}
            <div className="flex-1 flex relative min-h-[728px]">
              {/* Left: Hours labels (60px) */}
              <div className={`w-[60px] shrink-0 border-r divide-y select-none ${
                isLight 
                  ? 'border-slate-200 divide-slate-200 bg-slate-50/40 text-slate-400' 
                  : 'border-slate-800 divide-slate-800/60 bg-[#111422] text-slate-500'
              }`}>
                {hours.map(hour => (
                  <div key={hour} className="h-[52px] px-2 py-1 text-[11px] font-mono text-right">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>

              {/* Right: 7 Day Columns */}
              <div className={`flex-1 grid grid-cols-7 relative divide-x ${
                isLight ? 'divide-slate-200' : 'divide-slate-800/60'
              }`}>
                {Array.from({ length: 7 }, (_, dayIdx) => (
                  <div key={dayIdx} className="relative h-full">
                    {/* Layer 0: Background Hour Grid Lines & Slot Click Targets */}
                    <div className={`absolute inset-0 divide-y z-0 ${
                      isLight ? 'divide-slate-200' : 'divide-slate-800/60'
                    }`}>
                      {hours.map(hour => (
                        <div
                          key={hour}
                          onClick={() => handleSlotClick(dayIdx, hour)}
                          className={`h-[52px] relative cursor-pointer transition-colors group ${
                            isLight ? 'hover:bg-purple-50/60' : 'hover:bg-purple-900/10'
                          }`}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <Plus className="w-3.5 h-3.5 text-purple-500/70" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Layer 1: Foreground Events Layer (z-10, fully covers any grid line underneath!) */}
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {filteredEvents
                        .filter(ev => ev.dayIndex === dayIdx)
                        .map(ev => {
                          const top = (ev.startHour - 6) * 52 + 2;
                          const height = ev.duration * 52 - 4;
                          return (
                            <div
                              key={ev.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingEvent({ ...ev });
                                setShowEditModal(true);
                              }}
                              onContextMenu={(e) => handleEventContextMenu(e, ev)}
                              style={{
                                top: `${top}px`,
                                height: `${height}px`,
                                borderLeftColor: ev.color,
                              }}
                              className={`pointer-events-auto absolute left-1 right-1 p-2 rounded-lg text-left overflow-hidden shadow-md border-l-4 transition-all hover:scale-[1.01] hover:brightness-95 cursor-pointer select-none border ${
                                isLight
                                  ? 'bg-white text-slate-800 border-slate-200 shadow-slate-200/80 hover:bg-slate-50'
                                  : 'bg-[#1e1a34] text-slate-100 border-slate-700/70 shadow-black/50 hover:bg-[#252040]'
                              }`}
                              title="Nhấn chuột trái để sửa, chuột phải để mở tùy chọn"
                            >
                              <div className={`font-bold text-[11px] leading-tight truncate ${
                                isLight ? 'text-slate-900' : 'text-slate-100'
                              }`}>
                                {ev.title}
                              </div>
                              <div className={`flex items-center gap-1 text-[10px] mt-1 truncate ${
                                isLight ? 'text-slate-500' : 'text-slate-400'
                              }`}>
                                <Clock className="w-3 h-3 shrink-0 text-slate-400" />
                                <span>
                                  {String(Math.floor(ev.startHour)).padStart(2, '0')}:{ev.startHour % 1 === 0.5 ? '30' : '00'} - {String(Math.floor(ev.startHour + ev.duration)).padStart(2, '0')}:{(ev.startHour + ev.duration) % 1 === 0.5 ? '30' : '00'}
                                </span>
                              </div>
                              {ev.location && (
                                <div className={`flex items-center gap-1 text-[9px] truncate mt-0.5 ${
                                  isLight ? 'text-slate-500' : 'text-slate-400'
                                }`}>
                                  <MapPin className="w-2.5 h-2.5 text-purple-500 shrink-0" />
                                  <span className="truncate">{ev.location}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Right Sidebar: Mini Month Calendar & Checkboxes */}
        <div className={`w-64 shrink-0 p-4 flex flex-col gap-5 overflow-y-auto ${
          isLight ? 'bg-slate-50 border-l border-slate-200 text-slate-700' : 'bg-[#131726] border-l border-slate-800 text-slate-300'
        }`}>
          {/* Mini Month Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-bold text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                Tháng 9 2026
              </span>
              <div className="flex items-center gap-1">
                <button className={`p-1 rounded cursor-pointer ${isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-slate-800 text-slate-400'}`}>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className={`p-1 rounded cursor-pointer ${isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-slate-800 text-slate-400'}`}>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Days table */}
            <div className="grid grid-cols-7 text-center text-[10px] text-slate-400 font-bold mb-1">
              <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
            </div>
            <div className="grid grid-cols-7 text-center text-xs gap-y-1">
              <span className="text-slate-400 opacity-60">31</span>
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
              <span className="w-6 h-6 mx-auto rounded-full bg-red-500 text-white font-bold flex items-center justify-center shadow-xs">7</span>
              <span>8</span><span>9</span><span>10</span><span>11</span><span>12</span><span>13</span>
              <span>14</span><span>15</span><span>16</span><span>17</span><span>18</span><span>19</span><span>20</span>
              <span>21</span><span>22</span><span>23</span><span>24</span><span>25</span><span>26</span><span>27</span>
              <span>28</span><span>29</span><span>30</span>
              <span className="text-slate-400 opacity-60">1</span>
              <span className="text-slate-400 opacity-60">2</span>
              <span className="text-slate-400 opacity-60">3</span>
              <span className="text-slate-400 opacity-60">4</span>
            </div>
          </div>

          <hr className={isLight ? 'border-slate-200' : 'border-slate-800'} />

          {/* Calendars Checkboxes */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Calendars</span>
              <button 
                onClick={() => alert('Thêm danh mục Calendar mới')}
                className="text-[10px] text-purple-600 hover:underline font-semibold cursor-pointer"
              >
                + Thêm Calendars
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {calendars.map(cal => (
                <label key={cal.id} className="flex items-center gap-2.5 text-xs cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={cal.checked}
                    onChange={() => handleToggleCalendar(cal.id)}
                    className="w-3.5 h-3.5 rounded accent-purple-600 cursor-pointer"
                  />
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: cal.color }} />
                  <span className={`truncate ${isLight ? 'text-slate-700 group-hover:text-purple-600' : 'text-slate-300 group-hover:text-white'}`}>
                    {cal.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <hr className={isLight ? 'border-slate-200' : 'border-slate-800'} />

          {/* Quick Info / Google Status */}
          <div className={`p-3 rounded-xl border text-[11px] flex flex-col gap-2 ${
            isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-[#0e111d] border-slate-800 text-slate-400'
          }`}>
            <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              Đồng bộ Google Calendar
            </span>
            <p className="leading-relaxed">
              {isGoogleConnected 
                ? 'Tài khoản Google Calendar đã kết nối thành công. Lịch phỏng vấn sẽ tự động đồng bộ sang Google Meet.' 
                : 'Kết nối tài khoản Google để tự động tạo phòng họp Google Meet và gửi lời mời đến ứng viên.'}
            </p>
            <button
              onClick={() => setShowSyncModal(true)}
              className="mt-1 py-1.5 px-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-500 text-center font-semibold transition-all cursor-pointer shadow-xs"
            >
              {isGoogleConnected ? 'Quản lý đồng bộ' : 'Kết nối ngay'}
            </button>
          </div>
        </div>
      </div>

      {/* Google Calendar Sync Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className={`w-full max-w-md border rounded-2xl p-6 shadow-2xl animate-fade-in-scale ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#161a2b] border-slate-700/80 text-slate-100'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-purple-600" />
                Đồng Bộ Lịch với Google Calendar
              </h3>
              <button onClick={() => setShowSyncModal(false)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-5 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-slate-100">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <h4 className={`font-bold text-base ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>
                Kết Nối Google Calendar API
              </h4>
              <p className={`text-xs max-w-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Cho phép SmartATS đồng bộ các lịch phỏng vấn và cuộc họp trực tiếp lên Google Calendar của công ty, tự động tạo phòng Google Meet.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button 
                onClick={() => setShowSyncModal(false)}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                  isLight ? 'border-slate-300 hover:bg-slate-100 text-slate-700' : 'border-slate-700 hover:bg-slate-800 text-slate-300'
                }`}
              >
                Đóng
              </button>
              <button 
                onClick={handleGoogleSync}
                disabled={isGoogleSyncing}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {isGoogleSyncing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang đồng bộ...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{isGoogleConnected ? 'Đồng bộ lại' : 'Xác nhận kết nối'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className={`w-full max-w-md border rounded-2xl p-6 shadow-2xl animate-fade-in-scale ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#161a2b] border-slate-700/80 text-slate-100'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-600" />
                Tạo Cuộc Họp / Lịch Mới
              </h3>
              <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="py-4 flex flex-col gap-3 text-xs">
              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Tên sự kiện / Buổi phỏng vấn *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="VD: Phỏng vấn Senior Backend..."
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-purple-600' 
                      : 'bg-[#0e111d] border-slate-700 text-slate-100 focus:border-purple-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Thứ trong tuần
                  </label>
                  <select
                    value={newEvent.dayIndex}
                    onChange={e => setNewEvent({ ...newEvent, dayIndex: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-800' 
                        : 'bg-[#0e111d] border-slate-700 text-slate-100'
                    }`}
                  >
                    <option value={0}>Thứ 2 (7/9)</option>
                    <option value={1}>Thứ 3 (8/9)</option>
                    <option value={2}>Thứ 4 (9/9)</option>
                    <option value={3}>Thứ 5 (10/9)</option>
                    <option value={4}>Thứ 6 (11/9)</option>
                    <option value={5}>Thứ 7 (12/9)</option>
                    <option value={6}>Chủ Nhật (13/9)</option>
                  </select>
                </div>

                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Giờ bắt đầu
                  </label>
                  <select
                    value={newEvent.startHour}
                    onChange={e => setNewEvent({ ...newEvent, startHour: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-800' 
                        : 'bg-[#0e111d] border-slate-700 text-slate-100'
                    }`}
                  >
                    {hours.map(h => (
                      <React.Fragment key={h}>
                        <option value={h}>{h}:00</option>
                        <option value={h + 0.5}>{h}:30</option>
                      </React.Fragment>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Thời lượng (giờ)
                  </label>
                  <select
                    value={newEvent.duration}
                    onChange={e => setNewEvent({ ...newEvent, duration: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-800' 
                        : 'bg-[#0e111d] border-slate-700 text-slate-100'
                    }`}
                  >
                    <option value={0.5}>30 phút</option>
                    <option value={1}>1 giờ</option>
                    <option value={1.5}>1.5 giờ</option>
                    <option value={2}>2 giờ</option>
                    <option value={3}>3 giờ</option>
                  </select>
                </div>

                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Loại lịch
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-800' 
                        : 'bg-[#0e111d] border-slate-700 text-slate-100'
                    }`}
                  >
                    <option value="interview">Phỏng vấn tuyển dụng</option>
                    <option value="meeting">Cuộc họp nội bộ</option>
                    <option value="activity">Hoạt động cá nhân</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Địa điểm / Đường dẫn họp
                </label>
                <input 
                  type="text"
                  value={newEvent.location}
                  onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="VD: Google Meet / Phòng họp 101"
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-purple-600' 
                      : 'bg-[#0e111d] border-slate-700 text-slate-100 focus:border-purple-500'
                  }`}
                />
              </div>

              <div className={`flex gap-2.5 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <button 
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className={`flex-1 py-2.5 rounded-xl border font-semibold cursor-pointer ${
                    isLight ? 'border-slate-300 hover:bg-slate-100 text-slate-700' : 'border-slate-700 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white shadow-lg cursor-pointer"
                >
                  Lưu cuộc họp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className={`w-full max-w-md border rounded-2xl p-6 shadow-2xl animate-fade-in-scale ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#161a2b] border-slate-700/80 text-slate-100'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Pencil className="w-4 h-4 text-purple-600" />
                Chỉnh Sửa Cuộc Họp / Lịch
              </h3>
              <button 
                onClick={() => { setShowEditModal(false); setEditingEvent(null); }} 
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="py-4 flex flex-col gap-3 text-xs">
              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Tên sự kiện / Buổi phỏng vấn *
                </label>
                <input 
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-purple-600' 
                      : 'bg-[#0e111d] border-slate-700 text-slate-100 focus:border-purple-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Thứ trong tuần
                  </label>
                  <select
                    value={editingEvent.dayIndex}
                    onChange={e => setEditingEvent({ ...editingEvent, dayIndex: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-800' 
                        : 'bg-[#0e111d] border-slate-700 text-slate-100'
                    }`}
                  >
                    <option value={0}>Thứ 2 (7/9)</option>
                    <option value={1}>Thứ 3 (8/9)</option>
                    <option value={2}>Thứ 4 (9/9)</option>
                    <option value={3}>Thứ 5 (10/9)</option>
                    <option value={4}>Thứ 6 (11/9)</option>
                    <option value={5}>Thứ 7 (12/9)</option>
                    <option value={6}>Chủ Nhật (13/9)</option>
                  </select>
                </div>

                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Giờ bắt đầu
                  </label>
                  <select
                    value={editingEvent.startHour}
                    onChange={e => setEditingEvent({ ...editingEvent, startHour: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-800' 
                        : 'bg-[#0e111d] border-slate-700 text-slate-100'
                    }`}
                  >
                    {hours.map(h => (
                      <React.Fragment key={h}>
                        <option value={h}>{h}:00</option>
                        <option value={h + 0.5}>{h}:30</option>
                      </React.Fragment>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Thời lượng (giờ)
                  </label>
                  <select
                    value={editingEvent.duration}
                    onChange={e => setEditingEvent({ ...editingEvent, duration: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-800' 
                        : 'bg-[#0e111d] border-slate-700 text-slate-100'
                    }`}
                  >
                    <option value={0.5}>30 phút</option>
                    <option value={1}>1 giờ</option>
                    <option value={1.5}>1.5 giờ</option>
                    <option value={2}>2 giờ</option>
                    <option value={3}>3 giờ</option>
                  </select>
                </div>

                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Loại lịch
                  </label>
                  <select
                    value={editingEvent.type}
                    onChange={e => setEditingEvent({ ...editingEvent, type: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-800' 
                        : 'bg-[#0e111d] border-slate-700 text-slate-100'
                    }`}
                  >
                    <option value="interview">Phỏng vấn tuyển dụng</option>
                    <option value="meeting">Cuộc họp nội bộ</option>
                    <option value="activity">Hoạt động cá nhân</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Địa điểm / Đường dẫn họp
                </label>
                <input 
                  type="text"
                  value={editingEvent.location || ''}
                  onChange={e => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  placeholder="VD: Google Meet / Phòng họp 101"
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-purple-600' 
                      : 'bg-[#0e111d] border-slate-700 text-slate-100 focus:border-purple-500'
                  }`}
                />
              </div>

              <div className={`flex items-center justify-between gap-2.5 pt-3 border-t ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}>
                <button 
                  type="button"
                  onClick={() => {
                    setEvents(prev => prev.filter(ev => ev.id !== editingEvent.id));
                    setShowEditModal(false);
                    setEditingEvent(null);
                    showToast('Đã xóa sự kiện thành công!');
                  }}
                  className="py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa</span>
                </button>

                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => { setShowEditModal(false); setEditingEvent(null); }}
                    className={`py-2 px-4 rounded-xl border font-semibold cursor-pointer ${
                      isLight ? 'border-slate-300 hover:bg-slate-100 text-slate-700' : 'border-slate-700 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white shadow-lg cursor-pointer"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Software Custom Context Menu (Chuột phải trên nhãn lịch) */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          style={{
            top: `${Math.min(contextMenu.y, window.innerHeight - 170)}px`,
            left: `${Math.min(contextMenu.x, window.innerWidth - 220)}px`,
          }}
          className={`fixed z-50 w-52 rounded-xl shadow-2xl border py-1.5 backdrop-blur-md animate-fade-in ${
            isLight 
              ? 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/80' 
              : 'bg-[#1a1f33]/95 border-slate-700 text-slate-100 shadow-black/80'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`px-3 py-1.5 border-b text-[11px] font-bold truncate ${
            isLight ? 'text-slate-900 border-slate-100 bg-slate-50' : 'text-slate-200 border-slate-800 bg-[#161a2b]'
          }`}>
            {contextMenu.event.title}
          </div>

          <button
            onClick={handleEditFromContext}
            className={`w-full px-3 py-2 text-xs flex items-center gap-2.5 transition-colors text-left cursor-pointer ${
              isLight ? 'hover:bg-purple-50 hover:text-purple-700' : 'hover:bg-purple-950/50 hover:text-purple-300'
            }`}
          >
            <Pencil className="w-3.5 h-3.5 text-purple-500" />
            <span>Chỉnh sửa lịch</span>
          </button>

          <button
            onClick={handleCopyLocation}
            className={`w-full px-3 py-2 text-xs flex items-center gap-2.5 transition-colors text-left cursor-pointer ${
              isLight ? 'hover:bg-purple-50 hover:text-purple-700' : 'hover:bg-purple-950/50 hover:text-purple-300'
            }`}
          >
            <Copy className="w-3.5 h-3.5 text-blue-500" />
            <span>Sao chép địa điểm / link</span>
          </button>

          <div className={`my-1 border-t ${isLight ? 'border-slate-100' : 'border-slate-800'}`} />

          <button
            onClick={handleDeleteFromContext}
            className="w-full px-3 py-2 text-xs flex items-center gap-2.5 text-red-500 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>Xóa lịch này</span>
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

