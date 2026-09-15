using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartATS.Data;

namespace SmartATS.Controllers
{
    public class CandidatesController : Controller
    {
        private readonly AppDbContext _context;

        public CandidatesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /Candidates/Detail/5 (Màn hình chia đôi: Trái xem PDF, Phải đánh giá & AI)
        public async Task<IActionResult> Detail(int id)
        {
            var application = await _context.Applications
                .Include(a => a.Candidate)
                    .ThenInclude(c => c.Applications)
                        .ThenInclude(sub => sub.Job)
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
                return NotFound("Không tìm thấy hồ sơ ứng tuyển.");

            return View(application);
        }

        // POST: /Candidates/SaveNotes (Lưu ghi chú và chấm điểm ứng viên)
        [HttpPost]
        public async Task<IActionResult> SaveNotes(int applicationId, int? rating, string? hrNotes)
        {
            var application = await _context.Applications.FindAsync(applicationId);
            if (application == null)
                return NotFound("Không tìm thấy hồ sơ.");

            application.Rating = rating;
            application.HRNotes = hrNotes;

            await _context.SaveChangesAsync();
            TempData["SuccessMessage"] = "Đã lưu đánh giá và ghi chú thành công!";

            return RedirectToAction(nameof(Detail), new { id = applicationId });
        }
    }
}
