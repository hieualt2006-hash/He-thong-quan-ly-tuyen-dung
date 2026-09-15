using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartATS.Data;
using SmartATS.Models.Entities;
using SmartATS.Models.Enums;
using SmartATS.ViewModels;

namespace SmartATS.Controllers.Api
{
    [ApiController]
    [Route("api/applications")]
    public class ApplicationsApiController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<ApplicationsApiController> _logger;

        public ApplicationsApiController(AppDbContext context, IWebHostEnvironment env, ILogger<ApplicationsApiController> logger)
        {
            _context = context;
            _env = env;
            _logger = logger;
        }

        /// <summary>
        /// [Module A & B]: Public API tiếp nhận hồ sơ ứng tuyển từ form bên ngoài.
        /// Áp dụng thuật toán Smart Deduplication kiểm tra email trùng lặp.
        /// </summary>
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> SubmitApplication([FromForm] ApplicationCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // 1. Kiểm tra Job có tồn tại và đang mở không
            var job = await _context.Jobs.FindAsync(dto.JobId);
            if (job == null || !job.IsActive)
                return BadRequest(new { message = "Vị trí tuyển dụng không tồn tại hoặc đã ngừng nhận hồ sơ." });

            // 2. Validate định dạng file CV (bắt buộc định dạng .pdf)
            if (dto.CvFile == null || dto.CvFile.Length == 0)
                return BadRequest(new { message = "Vui lòng đính kèm file CV." });

            var extension = Path.GetExtension(dto.CvFile.FileName).ToLowerInvariant();
            if (extension != ".pdf")
                return BadRequest(new { message = "Hệ thống chỉ hỗ trợ tiếp nhận CV định dạng .pdf." });

            // 3. Lưu file CV vào thư mục wwwroot/uploads/cvs
            var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads", "cvs");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(dto.CvFile.FileName)}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.CvFile.CopyToAsync(stream);
            }

            var relativePath = $"/uploads/cvs/{uniqueFileName}";

            // 4. [Module B]: Logic chống trùng lặp (Smart Deduplication)
            var cleanEmail = dto.Email.Trim().ToLowerInvariant();
            var candidate = await _context.Candidates
                .FirstOrDefaultAsync(c => c.Email.ToLower() == cleanEmail);

            if (candidate == null)
            {
                // Nếu CHƯA có: Tạo bản ghi Candidate mới
                candidate = new Candidate
                {
                    FullName = dto.FullName.Trim(),
                    Email = cleanEmail,
                    Phone = dto.Phone?.Trim(),
                    CreatedAt = DateTime.UtcNow
                };
                _context.Candidates.Add(candidate);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Tạo mới Candidate: {Email}", candidate.Email);
            }
            else
            {
                // Nếu ĐÃ CÓ: Cập nhật thông tin mới nhất và giữ nguyên ID
                candidate.FullName = dto.FullName.Trim();
                if (!string.IsNullOrEmpty(dto.Phone)) candidate.Phone = dto.Phone.Trim();
                _logger.LogInformation("Candidate {Email} đã tồn tại trong CRM, tái sử dụng CandidateId: {Id}", candidate.Email, candidate.Id);
            }

            // 5. Tạo bản ghi Application (Hồ sơ ứng tuyển)
            var application = new Application
            {
                CandidateId = candidate.Id,
                JobId = dto.JobId,
                Status = ApplicationStatus.NewApplied,
                CVFilePath = relativePath,
                AppliedAt = DateTime.UtcNow
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Hồ sơ ứng tuyển đã được tiếp nhận thành công!",
                applicationId = application.Id,
                candidateId = candidate.Id
            });
        }
    }
}
