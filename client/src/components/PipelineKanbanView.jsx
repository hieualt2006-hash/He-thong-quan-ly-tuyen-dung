import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  ChevronRight, 
  ArrowRight, 
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Award,
  Filter,
  Search,
  Building2, 
  Calendar, 
  Briefcase,
  GripVertical
} from 'lucide-react';
import api from '../services/api';

const PIPELINE_STAGES = [
  { id: 'Applied', status: 'Applied', title: '1. Mới Nộp (Applied)', color: 'border-slate-700 bg-slate-900/70', badge: 'bg-slate-800 text-slate-300' },
  { id: 'AI_Screened', status: 'Applied', title: '2. AI Sàng Lọc', color: 'border-amber-500/30 bg-amber-950/20', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  { id: 'Interview', status: 'Interview', title: '3. Phỏng Vấn (Interview)', color: 'border-orange-500/30 bg-orange-950/20', badge: 'bg-orange-500/10 text-orange-300 border-orange-500/30' },
  { id: 'Offered', status: 'Offered', title: '4. Đề Xuất (Offered)', color: 'border-indigo-500/30 bg-indigo-950/20', badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' },
  { id: 'Hired', status: 'Hired', title: '5. Đã Tuyển (Hired)', color: 'border-emerald-500/30 bg-emerald-950/20', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
];

function PipelineKanbanView({ applications = [], onSelectApplication, onStatusUpdated }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [isUpdating, setIsUpdating] = useState(false);
  const [draggedApp, setDraggedApp] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  // Group applications into stages
  const filteredApps = applications.filter(app => {
    const matchesSearch = (
      (app.candidate?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.job?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesDept = departmentFilter === 'ALL' || app.job?.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const getAppsInStage = (stageId) => {
    return filteredApps.filter(app => {
      if (stageId === 'AI_Screened') {
        return app.status === 'Applied' && app.matchScore !== null && app.matchScore !== undefined;
      }
      if (stageId === 'Offered') {
        return app.status === 'Offered';
      }
      return app.status === stageId;
    });
  };

  const handleDragStart = (e, app) => {
    setDraggedApp(app);
    e.dataTransfer.setData('text/plain', app.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedApp(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = (e, stageId) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (dragOverStage === stageId) {
      setDragOverStage(null);
    }
  };

  const handleDrop = async (e, stage) => {
    e.preventDefault();
    setDragOverStage(null);

    const appId = e.dataTransfer.getData('text/plain') || draggedApp?.id;
    if (!appId) return;

    const targetStatus = stage.status;
    const currentApp = applications.find(a => a.id === appId);

    if (currentApp && currentApp.status === targetStatus && stage.id !== 'AI_Screened') {
      setDraggedApp(null);
      return;
    }

    try {
      setIsUpdating(true);
      await api.patch(`/applications/${appId}/status`, { status: targetStatus });
      if (onStatusUpdated) onStatusUpdated();
    } catch (err) {
      alert('Lỗi cập nhật giai đoạn: ' + (err.message || 'Thao tác thất bại'));
    } finally {
      setIsUpdating(false);
      setDraggedApp(null);
    }
  };

  const handleMoveStage = async (appId, newStatus, e) => {
    e.stopPropagation();
    try {
      setIsUpdating(true);
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      if (onStatusUpdated) onStatusUpdated();
    } catch (err) {
      alert('Lỗi cập nhật giai đoạn: ' + (err.message || 'Thao tác thất bại'));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Bảng Theo Dõi Tuyển Dụng</h2>
            <span className="bg-orange-500/10 text-orange-400 text-xs font-bold px-2 py-0.5 rounded-full border border-orange-500/20">
              Kéo & Thả Thẻ
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Giữ và kéo thẻ ứng viên thả vào cột mong muốn để cập nhật tiến trình tuyển dụng</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Filter */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên ứng viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="ALL">Tất cả Phòng Ban</option>
            <option value="Engineering">Engineering</option>
            <option value="AI Lab">AI Lab</option>
            <option value="Product & Design">Product & Design</option>
            <option value="Marketing">Marketing</option>
            <option value="HR & Operations">HR & Operations</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => {
          const appsInStage = getAppsInStage(stage.id);
          const isOver = dragOverStage === stage.id;

          return (
            <div 
              key={stage.id} 
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={(e) => handleDragLeave(e, stage.id)}
              onDrop={(e) => handleDrop(e, stage)}
              className={`rounded-2xl border p-4 flex flex-col gap-3 min-w-[240px] backdrop-blur-xl shadow-lg transition-all duration-200 ${
                isOver 
                  ? 'border-orange-500 bg-orange-500/15 ring-2 ring-orange-500/40 scale-[1.02]' 
                  : stage.color
              }`}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <h3 className="font-bold text-xs text-slate-200 tracking-tight">{stage.title}</h3>
                <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${stage.badge}`}>
                  {appsInStage.length}
                </span>
              </div>

              {/* Candidate Cards List */}
              <div className="flex flex-col gap-3 min-h-[320px]">
                {appsInStage.length === 0 ? (
                  <div className={`text-center py-10 text-xs italic border border-dashed rounded-xl transition-colors ${
                    isOver 
                      ? 'border-orange-500/80 bg-orange-500/10 text-orange-300 font-bold' 
                      : 'border-slate-800/60 text-slate-600'
                  }`}>
                    {isOver ? '+ Thả hồ sơ vào đây' : 'Trống (0)'}
                  </div>
                ) : (
                  appsInStage.map((app) => {
                    const isDragging = draggedApp?.id === app.id;

                    return (
                      <div
                        key={app.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, app)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onSelectApplication(app)}
                        className={`zoho-card bg-slate-900/90 border rounded-xl p-3.5 flex flex-col gap-2.5 cursor-grab active:cursor-grabbing shadow-md group transition-all select-none hover:shadow-lg ${
                          isDragging 
                            ? 'opacity-40 border-dashed border-orange-500 scale-95 ring-2 ring-orange-500/30' 
                            : 'border-slate-800 hover:border-orange-500/50 hover:translate-y-[-2px]'
                        }`}
                      >
                        {/* Top Candidate Avatar & Score */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2">
                            <div className="text-slate-600 group-hover:text-slate-400">
                              <GripVertical className="w-3.5 h-3.5" />
                            </div>
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center font-bold text-orange-300 text-xs">
                              {app.candidate?.fullName ? app.candidate.fullName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-white group-hover:text-orange-400 transition-colors leading-tight">
                                {app.candidate?.fullName || 'Ứng viên'}
                              </h4>
                              <span className="text-[10px] text-slate-400 truncate max-w-[100px] block">
                                {app.job?.title || 'Job'}
                              </span>
                            </div>
                          </div>

                          {/* Match Score Badge */}
                          {app.matchScore !== null && (
                            <span className={`text-[10px] font-black font-mono px-1.5 py-0.5 rounded-md border ${
                              app.matchScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              app.matchScore >= 60 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>
                              {app.matchScore}%
                            </span>
                          )}
                        </div>

                        {/* Missing Skill preview */}
                        {app.missingSkills && (
                          <div className="text-[10px] text-rose-300 bg-rose-500/10 px-2 py-1 rounded-md truncate border border-rose-500/20">
                            ⚠️ {app.missingSkills.split(',')[0]}
                          </div>
                        )}

                        {/* Quick Stage Progression Buttons */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500 flex items-center gap-1 font-mono">
                            {app.job?.department?.slice(0, 4)}
                          </span>

                          <div className="flex items-center gap-1">
                            {stage.id === 'Applied' && (
                              <button
                                disabled={isUpdating}
                                onClick={(e) => handleMoveStage(app.id, 'Interview', e)}
                                className="bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-white px-2 py-0.5 rounded font-bold transition-colors"
                              >
                                Phỏng Vấn →
                              </button>
                            )}
                            {stage.id === 'AI_Screened' && (
                              <button
                                disabled={isUpdating}
                                onClick={(e) => handleMoveStage(app.id, 'Interview', e)}
                                className="bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-white px-2 py-0.5 rounded font-bold transition-colors"
                              >
                                Mời PV →
                              </button>
                            )}
                            {stage.id === 'Interview' && (
                              <button
                                disabled={isUpdating}
                                onClick={(e) => handleMoveStage(app.id, 'Offered', e)}
                                className="bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white px-2 py-0.5 rounded font-bold transition-colors"
                              >
                                Đề Xuất →
                              </button>
                            )}
                            {stage.id === 'Offered' && (
                              <button
                                disabled={isUpdating}
                                onClick={(e) => handleMoveStage(app.id, 'Hired', e)}
                                className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white px-2 py-0.5 rounded font-bold transition-colors"
                              >
                                Nhận Việc ✓
                              </button>
                            )}
                            {stage.id === 'Hired' && (
                              <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> Tuyển xong
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Drop placeholder highlight when dragging over non-empty column */}
                {isOver && appsInStage.length > 0 && (
                  <div className="py-2.5 border-2 border-dashed border-orange-500/80 bg-orange-500/10 text-orange-300 text-center text-xs font-bold rounded-xl animate-pulse">
                    + Thả vào đây
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PipelineKanbanView;
