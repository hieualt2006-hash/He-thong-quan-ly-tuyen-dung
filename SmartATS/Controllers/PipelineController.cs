using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartATS.Data;
using SmartATS.Models.Entities;
using SmartATS.Models.Enums;

namespace SmartATS.Controllers
{
    public class PipelineController : Controller
    {
        private readonly AppDbContext _context;
        private readonly ILogger<PipelineController> _logger;

        public PipelineController(AppDbContext context, ILogger<PipelineController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: /Pipeline?jobId=1
        public async Task<IActionResult> Index(int? jobId)
        {
            var jobs = await _context.Jobs.Where(j => j.IsActive).ToListAsync();
            ViewBag.Jobs = jobs;

            var selectedJobId = jobId ?? jobs.FirstOrDefault()?.Id ?? 0;
            ViewBag.SelectedJobId = selectedJobId;

            var applications = await _context.Applications
                .Include(a => a.Candidate)
                .Where(a => a.JobId == selectedJobId)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();

            return View(applications);
        }

        // POST: AJAX cập nhật trạng thái phễu kéo thả và sinh Magic Link
        [HttpPost]
        public async Task<IActionResult> UpdateStatus(int applicationId, ApplicationStatus newStatus)
        {
            var app = await _context.Applications
                .Include(a => a.Candidate)
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.Id == applicationId);

            if (app == null) 
                return NotFound(new { success = false, message = "Không tìm thấy hồ sơ ứng tuyển." });

            var oldStatus = app.Status;
            app.Status = newStatus;

            string? generatedMagicLink = null;

            // [Module D]: Khi chuyển trạng thái sang Interview -> Tạo Magic Link dùng 1 lần
            if (newStatus == ApplicationStatus.Interview && oldStatus != ApplicationStatus.Interview)
            {
                var token = new InterviewToken
                {
                    ApplicationId = app.Id,
                    TokenString = Guid.NewGuid(),
                    ExpirationDate = DateTime.UtcNow.AddDays(3), // Token hiệu lực 3 ngày
                    IsUsed = false
                };

                _context.InterviewTokens.Add(token);
                await _context.SaveChangesAsync();

                var request = HttpContext.Request;
                generatedMagicLink = $"{request.Scheme}://{request.Host}/CandidatePortal/ConfirmInterview?token={token.TokenString}";

                // Giả lập gửi email thông báo cho ứng viên
                _logger.LogInformation("---------------------------------------------------------------");
                _logger.LogInformation("[EMAIL SERVICE GIẢ LẬP] Gửi tới: {Email}", app.Candidate.Email);
                _logger.LogInformation("Vị trí: {JobTitle}", app.Job.Title);
                _logger.LogInformation("Magic Link phỏng vấn: {Link}", generatedMagicLink);
                _logger.LogInformation("---------------------------------------------------------------");
            }

            await _context.SaveChangesAsync();

            return Json(new
            {
                success = true,
                message = "Cập nhật trạng thái thành công!",
                magicLink = generatedMagicLink,
                candidateName = app.Candidate.FullName
            });
        }
    }
}
