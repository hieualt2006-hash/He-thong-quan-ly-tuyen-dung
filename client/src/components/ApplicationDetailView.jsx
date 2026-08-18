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
  Award,
  Mail,
  Phone,
  Briefcase
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
      alert(`🎉 Đã cập nhật trạng thái đơn thành '${newStatus}'!`);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors bg-slate-900/60 px-3.5 py-2 rounded-xl border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4 text-orange-400" />
          <span>Quay lại Danh sách Đơn ứng tuyển</span>
        </button>

        {/* Status Change Toolbar (OrangeHRM Action Bar) */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-bold px-2 hidden sm:inline">Cập nhật HR:</span>
          {[
            { id: 'Applied', label: 'Applied', color: 'bg-slate-800 hover:bg-slate-700 text-slate-200' },
            { id: 'Interview', label: 'Mời Phỏng Vấn', color: 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white' },
            { id: 'Hired', label: 'Nhận Việc (Hired)', color: 'bg-emerald-600 hover:bg-emerald-500 text-white' },
            { id: 'Rejected', label: 'Từ Chối', color: 'bg-rose-600 hover:bg-rose-500 text-white' }
          ].map((btn) => (
            <button
              key={btn.id}
              disabled={isUpdating || status === btn.id}
              onClick={() => handleStatusChange(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${btn.color} ${
                status === btn.id ? 'ring-2 ring-orange-400 shadow-md scale-105 opacity-100' : 'opacity-80 hover:opacity-100'
              } disabled:opacity-40`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Candidate Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-8 backdrop-blur-xl">
        {/* Candidate Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-orange-500/25 shrink-0">
              {candidate?.fullName ? candidate.fullName.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold text-white">{candidate?.fullName || 'Ứng viên'}</h1>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  status === 'Hired' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                  status === 'Interview' ? 'bg-orange-500/10 text-orange-300 border-orange-500/30' :
                  status === 'Rejected' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' :
                  'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  Trạng thái: {status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-orange-400" />
                  <strong className="text-slate-200">{candidate?.email}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                  <strong className="text-slate-200">{candidate?.phone || 'Chưa có SĐT'}</strong>
                </span>
              </div>

              <p className="text-xs text-orange-400 font-semibold mt-2 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-orange-400" />
                Vị trí ứng tuyển: <strong className="text-white ml-1">{job?.title}</strong> ({job?.department})
              </p>
            </div>
          </div>

          {/* AI Match Score Badge Card */}
          <div className={`p-5 rounded-2xl border ${scoreInfo.color} flex flex-col items-center justify-center text-center shrink-0 min-w-[200px] shadow-lg`}>
            <span className="text-[11px] uppercase font-bold tracking-wider opacity-90 mb-1 flex items-center gap-1 text-orange-400">
              <Sparkles className="w-3.5 h-3.5" /> AI Match Score
            </span>
            <span className="text-4xl font-extrabold font-mono tracking-tight my-1">
              {matchScore !== null ? `${matchScore}%` : 'N/A'}
            </span>
            <span className="text-[11px] font-bold opacity-90">{scoreInfo.label}</span>
          </div>
        </div>

        {/* AI Analysis Summary & Skills Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: AI Summary & Missing Skills */}
          <div className="flex flex-col gap-5">
            <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
                <Brain className="w-4 h-4 text-orange-400" />
                Tóm Tắt Đánh Giá Của Google Gemini AI
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {matchSummary || 'Chưa có tóm tắt đánh giá.'}
              </p>
            </div>

            {/* Missing Skills Tag */}
            <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Kỹ Năng Cần Bổ Sung / Còn Thiếu (Missing Skills)
              </h3>
              {missingSkills ? (
                <div className="flex flex-wrap gap-2">
                  {missingSkills.split(',').map((skill, idx) => (
                    <span key={idx} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      ⚠️ {skill.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Ứng viên đáp ứng cơ bản đầy đủ các yêu cầu chính của vị trí này.</p>
              )}
            </div>
          </div>

          {/* Right Column: CV Raw Text & File Viewer */}
          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between gap-4">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-400" />
                  Nội Dung Bóc Tách CV (pdf-parse)
                </h3>
                {candidate?.cvPath && (
                  <a
                    href={`http://localhost:5000${candidate.cvPath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-orange-400 hover:text-white font-bold flex items-center gap-1 bg-orange-500/10 hover:bg-orange-500 px-3 py-1 rounded-xl border border-orange-500/20 transition-all"
                  >
                    <span>Xem PDF gốc</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="bg-slate-900 p-4 rounded-xl text-xs text-slate-300 font-mono overflow-y-auto max-h-48 border border-slate-800/80 whitespace-pre-wrap leading-relaxed">
                {candidate?.rawCvText || 'Không có văn bản rawCvText.'}
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggested Interview Questions Section */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-orange-400 flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5 text-orange-400" />
            Bộ Câu Hỏi Phỏng Vấn Gợi Ý Bởi AI (Suggested Interview Questions)
          </h3>

          {questions.length === 0 ? (
            <p className="text-xs text-slate-400 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              Chưa tạo câu hỏi phỏng vấn.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {questions.map((q, idx) => (
                <div key={q.id || idx} className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 flex items-start gap-3 hover:border-orange-500/30 transition-all">
                  <span className="w-7 h-7 rounded-xl bg-orange-500/20 text-orange-400 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-orange-500/30">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-200 font-medium leading-relaxed">{q.questionText}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold text-orange-300 bg-orange-500/10 px-2.5 py-0.5 rounded-md border border-orange-500/20">
                      Chủ đề: {q.category || 'Phỏng vấn'}
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

