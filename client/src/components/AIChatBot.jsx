import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Minus, 
  Sparkles, 
  MessageSquare, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Gift, 
  FileText,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import api from '../services/api';

const QUICK_SUGGESTIONS = [
  { label: '💼 Vị trí đang tuyển dụng?', text: 'Hiện công ty đang tuyển những vị trí công việc nào và yêu cầu ra sao?' },
  { label: '💰 Mức lương & Đãi ngộ?', text: 'Mức lương và chế độ đãi ngộ, phúc lợi của công ty như thế nào?' },
  { label: '⏰ Thời gian làm việc?', text: 'Thời gian làm việc thế nào? Có chế độ làm việc từ xa (Remote / Hybrid) không?' },
  { label: '📄 Đánh giá độ phù hợp CV?', text: 'Làm thế nào để biết CV của tôi có phù hợp với vị trí tuyển dụng không?' }
];

const OFF_TOPIC_REPLY = 'Xin lỗi, tôi chỉ hỗ trợ giải đáp các câu hỏi liên quan đến công việc, vị trí tuyển dụng, mức lương, thời gian làm việc, đãi ngộ và đánh giá hồ sơ.';

function AIChatBot({ theme = 'dark' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ Lý Tuyển Dụng AI. Tôi có thể hỗ trợ bạn tìm hiểu về các vị trí đang tuyển, mức lương, thời gian làm việc, đãi ngộ hoặc đánh giá độ phù hợp CV.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [offTopicCount, setOffTopicCount] = useState(0);

  const messagesEndRef = useRef(null);
  const isLight = theme === 'light';

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Check if user question is related to job/recruitment
  const checkIsOffTopic = (text) => {
    const lower = text.toLowerCase().trim();
    const allowedKeywords = [
      'việc', 'job', 'vị trí', 'lương', 'salary', 'thu nhập', 'thời gian', 'giờ làm', 'remote', 
      'hybrid', 'on-site', 'đãi ngộ', 'phúc lợi', 'thưởng', 'bảo hiểm', 'benefit', 'phỏng vấn', 
      'interview', 'cv', 'hồ sơ', 'kỹ năng', 'skill', 'kinh nghiệm', 'yêu cầu', 'tuyển', 'ứng tuyển',
      'apply', 'công ty', 'smartats', 'bảo mật', 'react', 'node', 'fullstack', 'frontend', 'backend',
      'developer', 'lập trình', 'onboard', 'thử việc', 'chế độ', 'phù hợp', 'chào', 'hello', 'hi',
      'cảm ơn', 'thanks', 'địa chỉ', 'văn phòng', 'jd', 'quy trình'
    ];
    return !allowedKeywords.some(k => lower.includes(k));
  };

  const handleSendMessage = async (textToSend = inputText) => {
    const text = (typeof textToSend === 'string' ? textToSend : inputText).trim();
    if (!text) return;

    // Add candidate message
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Rule: Nếu đã vượt quá 3 lần hỏi ngoài lề, hoàn toàn ngưng trả lời không cần cảnh báo
    if (offTopicCount >= 3) {
      return;
    }

    setIsTyping(true);

    // Check client-side off-topic heuristic
    const isOff = checkIsOffTopic(text);

    if (isOff) {
      setTimeout(() => {
        setIsTyping(false);
        const newOffCount = offTopicCount + 1;
        setOffTopicCount(newOffCount);

        if (newOffCount <= 3) {
          const aiMsg = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: OFF_TOPIC_REPLY,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, aiMsg]);
        }
      }, 500);
      return;
    }

    // Call API backend for intelligent answer
    try {
      const response = await api.post('/chat', {
        message: text,
        history: messages.slice(-6).map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text
        }))
      });

      setIsTyping(false);

      if (response.success && response.data?.reply) {
        if (response.data.isOffTopic) {
          const newOffCount = offTopicCount + 1;
          setOffTopicCount(newOffCount);
          if (newOffCount > 3) return; // Silent stop
        }

        const aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: response.data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        const fallbackMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Vị trí tại công ty mở tuyển đa dạng kèm chế độ đãi ngộ cạnh tranh. Bạn có thể nộp CV trực tiếp tại mục Tin Tuyển Dụng để AI phân tích độ phù hợp nhé!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }
    } catch (err) {
      setIsTyping(false);
      const fallbackMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Công ty hiện tuyển nhiều vị trí Fullstack & AI với mức lương $1,000 - $3,500/tháng, làm việc từ Thứ 2 - Thứ 6 và hỗ trợ làm việc từ xa Hybrid. Bạn có thể xem chi tiết ở mục Tin Tuyển Dụng!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chatbot Window */}
      {isOpen && (
        <div 
          className={`w-96 max-w-[calc(100vw-2rem)] h-[520px] rounded-3xl border shadow-2xl flex flex-col overflow-hidden mb-3 animate-fade-in transition-all ${
            isLight
              ? 'bg-white border-slate-200 text-slate-800'
              : 'bg-slate-900/95 border-slate-800 text-slate-100 backdrop-blur-2xl'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-tight flex items-center gap-1.5">
                  Trợ Lý Tuyển Dụng AI
                </h3>
                <p className="text-[10px] text-orange-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Sẵn sàng giải đáp 24/7
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white/90 hover:text-white transition-colors"
                title="Thu nhỏ"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white/90 hover:text-white transition-colors"
                title="Đóng chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className={`p-2.5 border-b overflow-x-auto flex gap-1.5 no-scrollbar ${
            isLight ? 'bg-slate-50 border-slate-100' : 'bg-slate-950/70 border-slate-800/80'
          }`}>
            {QUICK_SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.text)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl whitespace-nowrap transition-all duration-200 shrink-0 border ${
                  isLight
                    ? 'bg-white hover:bg-orange-50 hover:text-orange-600 border-slate-200 text-slate-700'
                    : 'bg-slate-800 hover:bg-orange-500/20 hover:text-orange-300 border-slate-700 text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-br-none shadow-md'
                      : isLight
                        ? 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                        : 'bg-slate-800/90 text-slate-200 rounded-bl-none border border-slate-700/60'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1 font-mono">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-2 rounded-2xl w-fit border border-slate-700/40">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className={`p-3 border-t flex items-center gap-2 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <input
              type="text"
              placeholder="Hỏi về vị trí, lương, đãi ngộ, thời gian..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={`flex-1 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors border ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-orange-500'
                  : 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-orange-500'
              }`}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-md shadow-orange-500/20 active:scale-95 shrink-0"
              title="Gửi tin nhắn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center justify-center w-14 h-14 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white rounded-full shadow-2xl shadow-orange-500/40 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/25"
        title="Trợ lý Tuyển Dụng AI (Hỏi đáp việc làm, lương, đãi ngộ & CV)"
      >
        {/* Online Green Pulsing Indicator */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900" />
        </span>

        {/* Bot Icon */}
        <Bot className="w-7 h-7 transition-transform group-hover:scale-110" />

        {/* Small Speech Bubble / Question Badge */}
        <div className="absolute -bottom-1 -right-1 bg-white text-orange-600 rounded-full p-1 shadow-md border border-orange-200 group-hover:scale-110 transition-transform">
          <MessageSquare className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
        </div>
      </button>
    </div>
  );
}

export default AIChatBot;
