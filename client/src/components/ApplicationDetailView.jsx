import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  UserCheck, 
  XCircle, 
  Clock, 
  Download, 
  ExternalLink,
  Brain,
  HelpCircle,
  Award
} from 'lucide-react';
import api from '../services/api';

function ApplicationDetailView({ application, onBack, onStatusUpdated }) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!application) return null;

  const { candidate, job, questions = [], matchScore, matchSummary, missingSkills, status } = application;

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdating(true);
      const res = await api.patch(`/applications/${application.id}/status`, { status: newStatus });
      alert(`Đã cập nhật trạng thái đơn thành '${newStatus}'!`);
      if (onStatusUpdated) {
        onStatusUpdated(res.data);
      }
    } catch (err) {
      alert('Lỗi cập nhật trạng thái: ' + (err.message || 'Thao tác thất bại'));
    } finally {
      setIsUpdating(false);
    }
  };

  // Color code helper for Match Score
  const getScoreBadge = (score) => {
    if (score === null || score === undefined) {
      return { color: 'bg-slate-800 text-slate-400 border-slate-700', label: 'Chờ Phân Tích AI' };
    }
    if (score >= 80) {
      return { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', ring: 'ring-emerald-500/30', label: 'Rất Phù Hợp (High Match)' };
    }
    if (score >= 60) {
      return { color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', ring: 'ring-amber-500/30', label: 'Khá Phù Hợp (Medium Match)' };
    }
    return { color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', ring: 'ring-rose-500/30', label: 'Cân Nhắc (Low Match)' };
  };

  const scoreInfo = getScoreBadge(matchScore);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Top Header & Back Button */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Danh sách Đơn ứng tuyển</span>
        </button>

        {/* Status Change Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Đổi trạng thái:</span>
          {[
            { id: 'Applied', label: 'Applied', color: 'bg-slate-800 hover:bg-slate-700 text-slate-200' },
            { id: 'Interview', label: 'Mời Phỏng Vấn', color: 'bg-indigo-600 hover:bg-indigo-500 text-white' },
            { id: 'Hired', label: 'Nhận Việc (Hired)', color: 'bg-emerald-600 hover:bg-emerald-500 text-white' },
            { id: 'Rejected', label: 'Từ Chối', color: 'bg-rose-600 hover:bg-rose-500 text-white' }
          ].map((btn) => (
            <button
              key={btn.id}
              disabled={isUpdating || status === btn.id}
              onClick={() => handleStatusChange(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border border-slate-700/50 ${btn.color} ${
                status === btn.id ? 'ring-2 ring-white/40 opacity-90 scale-105' : 'opacity-80 hover:opacity-100'
              } disabled:opacity-40`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Candidate Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-8 backdrop-blur-xl">
        {/* Candidate Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/25 shrink-0">
              {candidate?.fullName ? candidate.fullName.charAt(0) : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{candidate?.fullName || 'Ứng viên'}</h1>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                  Trạng thái: {status}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">Email: <span className="text-slate-200">{candidate?.email}</span> | SĐT: <span className="text-slate-200">{candidate?.phone || 'Chưa cập nhật'}</span></p>
              <p className="text-xs text-indigo-400 font-medium mt-1">Ứng tuyển vị trí: <strong className="text-white">{job?.title}</strong> ({job?.department})</p>
            </div>
          </div>

          {/* AI Match Score Badge Card */}
          <div className={`p-5 rounded-2xl border ${scoreInfo.color} flex flex-col items-center justify-center text-center shrink-0 min-w-[200px]`}>
            <span className="text-xs uppercase font-bold tracking-wider opacity-80 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI Match Score
            </span>
            <span className="text-4xl font-black font-mono tracking-tight my-1">
              {matchScore !== null ? `${matchScore}%` : 'N/A'}
            </span>
            <span className="text-[11px] font-semibold opacity-90">{scoreInfo.label}</span>
          </div>
        </div>

        {/* AI Analysis Summary & Skills Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: AI Summary & Missing Skills */}
          <div className="flex flex-col gap-5">
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-400" />
                Tóm Tắt Đánh Giá Của AI
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {matchSummary || 'Chưa có tóm tắt đánh giá.'}
              </p>
            </div>

            {/* Missing Skills Tag */}
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Kỹ Năng Cần Bổ Sung / Còn Thiếu (Missing Skills)
              </h3>
              {missingSkills ? (
                <div className="flex flex-wrap gap-2">
                  {missingSkills.split(',').map((skill, idx) => (
                    <span key={idx} className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      ⚠️ {skill.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Ứng viên đáp ứng cơ bản đầy đủ các yêu cầu chính.</p>
              )}
            </div>
          </div>

          {/* Right Column: CV Raw Text & File Viewer */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between gap-4">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  Nội Dung Văn Bản Trích Xuất Từ CV (pdf-parse)
                </h3>
                {candidate?.cvPath && (
                  <a
                    href={`http://localhost:5000${candidate.cvPath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20"
                  >
                    Xem PDF <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="bg-slate-900 p-4 rounded-xl text-xs text-slate-300 font-mono overflow-y-auto max-h-48 border border-slate-800 whitespace-pre-wrap">
                {candidate?.rawCvText || 'Không có văn bản rawCvText.'}
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggested Interview Questions Section */}
        <div className="border-t border-slate-800 pt-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5 text-indigo-400" />
            Bộ Câu Hỏi Phỏng Vấn Gợi Ý Bởi AI (Suggested Interview Questions)
          </h3>

          {questions.length === 0 ? (
            <p className="text-xs text-slate-400 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
              Chưa tạo câu hỏi phỏng vấn.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {questions.map((q, idx) => (
                <div key={q.id || idx} className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition-all">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-200 font-medium leading-relaxed">{q.questionText}</p>
                    <span className="inline-block mt-2 text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                      Danh mục: {q.category || 'Phỏng vấn'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetailView;
