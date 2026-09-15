using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartATS.Data;
using SmartATS.Models.Enums;

namespace SmartATS.Controllers
{
    public class CandidatePortalController : Controller
    {
        private readonly AppDbContext _context;

        public CandidatePortalController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /CandidatePortal/ConfirmInterview?token=GUID
        public async Task<IActionResult> ConfirmInterview(Guid token)
        {
            var inviteToken = await _context.InterviewTokens
                .Include(t => t.Application)
                    .ThenInclude(a => a.Job)
                .Include(t => t.Application)
                    .ThenInclude(a => a.Candidate)
                .FirstOrDefaultAsync(t => t.TokenString == token);

            if (inviteToken == null)
            {
                ViewBag.Error = "Đường link xác nhận không tồn tại hoặc đã bị xóa.";
                return View("Error");
            }

            if (inviteToken.IsUsed)
            {
                ViewBag.Error = "Đường link này đã được bạn xác nhận trước đó.";
                return View("Error");
            }

            if (DateTime.UtcNow > inviteToken.ExpirationDate)
            {
                ViewBag.Error = "Đường link xác nhận đã hết hạn (chỉ có hiệu lực trong 3 ngày). Vui lòng liên hệ HR để được gửi lại link mới.";
                return View("Error");
            }

            return View(inviteToken);
        }

        // POST: /CandidatePortal/ProcessConfirmation
        [HttpPost]
        public async Task<IActionResult> ProcessConfirmation(Guid token)
        {
            var inviteToken = await _context.InterviewTokens
                .Include(t => t.Application)
                    .ThenInclude(a => a.Job)
                .Include(t => t.Application)
                    .ThenInclude(a => a.Candidate)
                .FirstOrDefaultAsync(t => t.TokenString == token);

            if (inviteToken == null || inviteToken.IsUsed || DateTime.UtcNow > inviteToken.ExpirationDate)
            {
                ViewBag.Error = "Yêu cầu không hợp lệ hoặc link đã hết hạn.";
                return View("Error");
            }

            // Đánh dấu token đã sử dụng
            inviteToken.IsUsed = true;
            inviteToken.UsedAt = DateTime.UtcNow;

            // Cập nhật trạng thái ứng tuyển sang "Confirmed"
            inviteToken.Application.Status = ApplicationStatus.Confirmed;

            await _context.SaveChangesAsync();

            return View("Success", inviteToken);
        }
    }
}
