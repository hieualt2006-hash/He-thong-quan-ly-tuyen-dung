import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Building2, 
  Plus, 
  Video, 
  MapPin, 
  BookOpen,
  Filter,
  Brain,
  Tag,
  ChevronRight
} from 'lucide-react';

const MOCK_QUESTIONS_BANK = [
  { id: 1, role: 'Fullstack Developer', category: 'Technical (React & Node.js)', difficulty: 'Medium', question: 'Giải thích cơ chế Event Loop trong Node.js và cách React Virtual DOM hoạt động khi so sánh diffing?' },
  { id: 2, role: 'Fullstack Developer', category: 'System Design & Database', difficulty: 'Hard', question: 'Thiết kế hệ thống bóc tách hàng nghìn CV PDF mỗi phút mà không làm nghẽn tiến trình Backend chính?' },
  { id: 3, role: 'AI / Data Engineer', category: 'AI & Prompt Engineering', difficulty: 'Hard', question: 'Làm thế nào để hạn chế Hallucination khi yêu cầu Gemini AI trích xuất dữ liệu JSON có cấu trúc từ CV tự do?' },
  { id: 4, role: 'General', category: 'Behavioral & Teamwork', difficulty: 'Easy', question: 'Hãy kể về một lần bạn gặp bất đồng ý kiến về kiến trúc kỹ thuật với đồng nghiệp và cách bạn giải quyết?' },
  { id: 5, role: 'Product & Design', category: 'Product Strategy', difficulty: 'Medium', question: 'Bạn sẽ tối ưu trải nghiệm nộp đơn ứng tuyển của ứng viên như thế nào để giảm tỉ lệ rời bỏ (Drop-off Rate)?' }
];

function InterviewScheduleView({ applications = [], onSelectApplication }) {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [customCategory, setCustomCategory] = useState('Technical');
  const [questionsBank, setQuestionsBank] = useState(MOCK_QUESTIONS_BANK);

  // Applications currently in Interview stage
  const interviewApps = applications.filter(a => a.status === 'Interview' || a.matchScore >= 60);

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    const newQ = {
      id: Date.now(),
      role: 'General',
      category: customCategory,
      difficulty: 'Custom',
      question: newQuestionText.trim()
    };
    setQuestionsBank([newQ, ...questionsBank]);
    setNewQuestionText('');
    alert('Đã thêm câu hỏi vào ngân hàng phỏng vấn AI!');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Sub-Tabs Navigation */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Quản Lý Phỏng Vấn & Ngân Hàng Câu Hỏi AI</h2>
            <span className="bg-orange-500/10 text-orange-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-orange-500/20">
              Lịch Phỏng Vấn & AI
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Lên lịch trình phỏng vấn và sử dụng bộ câu hỏi đánh giá chuyên sâu do Gemini AI gợi ý</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'schedule'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Lịch Trình Phỏng Vấn ({interviewApps.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bank'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Ngân Hàng Câu Hỏi AI ({questionsBank.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Interview Schedule */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Candidate Interview List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Danh Sách Ứng Viên Chờ Phỏng Vấn ({interviewApps.length})
              </span>
              <span className="text-[11px] text-slate-400">Đã vượt qua vòng lọc CV AI</span>
            </div>

            {interviewApps.length === 0 ? (
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-sm">
                Hiện chưa có ứng viên nào ở trạng thái "Mời Phỏng Vấn". Vui lòng chọn hồ sơ từ Tab Ứng viên!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interviewApps.map((app, idx) => (
                  <div 
                    key={app.id}
                    className="zoho-card bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 shadow-lg flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          {app.job?.department || 'Engineering'}
                        </span>
                        <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {app.matchScore || 85}% Match
                        </span>
                      </div>

                      <h3 className="font-extrabold text-white text-base">{app.candidate?.fullName || 'Ứng viên'}</h3>
                      <p className="text-xs text-slate-400">{app.job?.title}</p>

                      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mt-3 flex flex-col gap-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-orange-400" />
                          <span>Hôm nay: 14:30 - 15:30 (Online Google Meet)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-orange-400" />
                          <span>Hội đồng: Lead Tech & HR Manager</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => onSelectApplication(app)}
                        className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
                      >
                        Xem Đánh Giá AI <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => alert(`Đã gửi email nhắc lịch phỏng vấn tới: ${app.candidate?.email}`)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
                      >
                        Gửi Email Nhắc
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Quick Interview Tips & AI Tools */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 shadow-xl flex flex-col gap-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
              <Sparkles className="w-4 h-4 text-orange-400" />
              Công Cụ Đánh Giá Phỏng Vấn AI
            </div>

            <div className="flex flex-col gap-3 text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <p className="font-bold text-white flex items-center gap-1.5">
                💡 Lưu ý phỏng vấn chuẩn ATS:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                <li>Đối chiếu các thẻ <strong>Kỹ năng còn thiếu (Missing Skills)</strong> trong CV.</li>
                <li>Dùng bộ câu hỏi sinh tự động để kiểm tra tư duy thực chiến.</li>
                <li>Ghi chú nhận xét trực tiếp vào hồ sơ ứng viên để AI chấm điểm tổng kết.</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-500/15 via-amber-500/10 to-transparent p-5 rounded-2xl border border-orange-500/30 flex flex-col gap-3">
              <h4 className="font-extrabold text-sm text-white">Khởi tạo nhanh phòng họp phỏng vấn</h4>
              <p className="text-xs text-slate-300">Tạo liên kết Google Meet / Zoom và gửi thư mời tự động tới ứng viên.</p>
              <button 
                onClick={() => alert('Đã tạo phòng họp Google Meet và tạo link phỏng vấn tự động!')}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>Tạo Link Phỏng Vấn Nhanh</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Question Bank */}
      {activeTab === 'bank' && (
        <div className="flex flex-col gap-6">
          {/* Add Question Form */}
          <form onSubmit={handleAddQuestion} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Thêm Câu Hỏi Mới Vào Ngân Hàng Phỏng Vấn AI
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-3">
                <input
                  type="text"
                  required
                  placeholder="Nhập nội dung câu hỏi phỏng vấn cần thêm..."
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 flex-1"
                >
                  <option value="Technical">Technical</option>
                  <option value="System Design">System Design</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="Culture Fit">Culture Fit</option>
                </select>

                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shrink-0"
                >
                  Thêm
                </button>
              </div>
            </div>
          </form>

          {/* Question List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questionsBank.map((q) => (
              <div key={q.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between gap-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-orange-500/10 text-orange-300 border border-orange-500/20">
                    {q.category}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Độ khó: {q.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {q.question}
                </p>
                <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                  <span>Áp dụng cho: <strong>{q.role}</strong></span>
                  <span className="text-orange-400 font-semibold cursor-pointer hover:underline">Sao chép câu hỏi</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewScheduleView;
