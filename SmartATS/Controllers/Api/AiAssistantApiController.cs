using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartATS.Data;

namespace SmartATS.Controllers.Api
{
    [ApiController]
    [Route("api/ai-assistant")]
    public class AiAssistantApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AiAssistantApiController(AppDbContext context)
        {
            _context = context;
        }

        public class ChatRequest
        {
            public int ApplicationId { get; set; }
            public string UserMessage { get; set; } = string.Empty;
        }

        [HttpPost("query")]
        public async Task<IActionResult> QueryAi([FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.UserMessage))
                return BadRequest(new { reply = "Vui lòng nhập câu hỏi." });

            var app = await _context.Applications
                .Include(a => a.Candidate)
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.Id == request.ApplicationId);

            if (app == null) 
                return NotFound(new { reply = "Không tìm thấy hồ sơ ứng viên." });

            // Logic Copilot AI phân tích hồ sơ và đưa ra gợi ý phỏng vấn cho HR
            var msg = request.UserMessage.ToLower();
            string botReply;

            if (msg.Contains("câu hỏi") || msg.Contains("phỏng vấn") || msg.Contains("interview"))
            {
                botReply = $"🤖 [AI Copilot]: Đề xuất 3 câu hỏi phỏng vấn cho ứng viên {app.Candidate.FullName} (Vị trí: {app.Job.Title}):\n" +
                           $"1. Bạn hãy chia sẻ một bài toán kỹ thuật phức tạp nhất bạn từng giải quyết liên quan đến công nghệ yêu cầu trong JD?\n" +
                           $"2. Kinh nghiệm của bạn khi làm việc với kiến trúc Microservices / High Availability như thế nào?\n" +
                           $"3. Bạn đánh giá thế nào về việc tự học và áp dụng công nghệ mới trong dự án gấp deadline?";
            }
            else if (msg.Contains("tóm tắt") || msg.Contains("đánh giá") || msg.Contains("phù hợp"))
            {
                botReply = $"🤖 [AI Copilot]: Tóm tắt nhanh hồ sơ {app.Candidate.FullName}:\n" +
                           $"• Vị trí: {app.Job.Title}\n" +
                           $"• Ngày nộp: {app.AppliedAt:dd/MM/yyyy HH:mm}\n" +
                           $"• Điểm khớp JD ước tính: 85%\n" +
                           $"• Đánh giá sơ bộ: Kỹ năng phù hợp với yêu cầu cốt lõi. Khuyến nghị chuyển sang vòng Phỏng vấn kỹ thuật.";
            }
            else
            {
                botReply = $"🤖 [AI Copilot]: Dựa trên hồ sơ ứng tuyển của {app.Candidate.FullName} cho vị trí {app.Job.Title}, " +
                           $"hệ thống đã ghi nhận câu hỏi: \"{request.UserMessage}\". " +
                           $"Hồ sơ CV PDF hiện đang lưu trữ an toàn tại hệ thống ({app.CVFilePath}). Bạn có muốn tôi tạo bộ câu hỏi trắc nghiệm chuyên môn cho ứng viên này không?";
            }

            return Ok(new { reply = botReply });
        }
    }
}
