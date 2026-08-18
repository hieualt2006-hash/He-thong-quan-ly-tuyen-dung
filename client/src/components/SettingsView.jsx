import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Mail, 
  Server, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Bot, 
  Database,
  Cpu
} from 'lucide-react';

function SettingsView({ serverStatus }) {
  const [minMatchThreshold, setMinMatchThreshold] = useState(60);
  const [aiModel, setAiModel] = useState('gemini-1.5-flash');
  const [autoEmailInterview, setAutoEmailInterview] = useState(true);
  const [emailSubject, setEmailSubject] = useState('[Smart ATS] Thư mời tham gia phỏng vấn tuyển dụng');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Cài Đặt Hệ Thống & Trọng Số AI</h2>
            <span className="bg-orange-500/10 text-orange-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-orange-500/20">
              Settings & Config
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Cấu hình ngưỡng lọc hồ sơ tự động của Google Gemini AI và mẫu thư phản hồi ứng viên</p>
        </div>

        {isSaved && (
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" /> Đã lưu cấu hình!
          </span>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">
        {/* Card 1: AI Scoring & Screening Parameters */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-5">
          <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-orange-400" />
              Cấu Hình Trọng Số Đánh Giá AI (Gemini ATS Scoring)
            </h3>
            <span className="text-[11px] text-orange-300 font-mono">Google Generative AI</span>
          </div>

          <div className="flex flex-col gap-4">
            {/* Slider: Minimum Threshold */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-300">Ngưỡng điểm AI tối thiểu để đề xuất phỏng vấn (Threshold):</span>
                <span className="text-orange-400 font-mono text-sm font-extrabold">{minMatchThreshold}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="90"
                step="5"
                value={minMatchThreshold}
                onChange={(e) => setMinMatchThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>40% (Linh hoạt)</span>
                <span>60% (Tiêu chuẩn đề xuất)</span>
                <span>90% (Khắt khe)</span>
              </div>
            </div>

            {/* AI Model Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mô hình AI xử lý (Model Engine)</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Tốc độ siêu nhanh & Chuẩn xác)</option>
                  <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Phân tích chuyên sâu)</option>
                  <option value="gemini-2.0-flash">Google Gemini 2.0 Flash</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Bộ trích xuất văn bản CV</label>
                <input
                  type="text"
                  disabled
                  value="PDF-Parse (Local Engine Fast Buffer)"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Email Automation Templates */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-5">
          <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-orange-400" />
              Mẫu Email Tự Động Phản Hồi Ứng Viên (Email Automation)
            </h3>
            <span className="text-[11px] text-emerald-400 font-medium">Mẫu Thư Tự Động</span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="autoEmail"
                checked={autoEmailInterview}
                onChange={(e) => setAutoEmailInterview(e.target.checked)}
                className="w-4 h-4 rounded accent-orange-500"
              />
              <label htmlFor="autoEmail" className="text-xs font-bold text-slate-200 cursor-pointer">
                Tự động tạo bản nháp thư mời phỏng vấn khi chuyển trạng thái sang "Interview"
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Tiêu đề Thư mời phỏng vấn</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Nội dung mẫu thư mời (Template Preview)</label>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed">
                Chào {'{Candidate_Name}'},<br/><br/>
                Chúc mừng bạn! Hồ sơ ứng tuyển vị trí <strong>{'{Job_Title}'}</strong> của bạn đã đạt điểm tương thích cao qua vòng sơ loại AI ({'{Match_Score}'}%).<br/>
                Bộ phận Tuyển dụng trân trọng mời bạn tham dự buổi phỏng vấn kỹ thuật trực tuyến.<br/><br/>
                Trân trọng,<br/>
                Hội đồng Tuyển dụng Smart ATS.
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Backend & Database Health */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Server className="w-5 h-5 text-orange-400" />
            Thông Tin Máy Chủ & Kết Nối Hệ Thống
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-1">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Node.js Express API</span>
              <span className="font-mono text-emerald-400 font-bold">http://localhost:5000</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-1">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Cơ sở dữ liệu ORM</span>
              <span className="font-mono text-orange-300 font-bold">SQLite + Prisma ORM</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-1">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Trạng Thái Kết Nối</span>
              <span className={`font-bold flex items-center gap-1 ${serverStatus === 'online' ? 'text-emerald-400' : 'text-amber-400'}`}>
                <span className={`w-2 h-2 rounded-full ${serverStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {serverStatus === 'online' ? 'Hoạt động tốt (Online)' : 'Đang kiểm tra...'}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-3 rounded-2xl text-xs transition-all shadow-xl shadow-orange-500/25 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Cấu Hình Hệ Thống</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default SettingsView;
