using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace SmartATS.ViewModels
{
    public class ApplicationCreateDto
    {
        [Required(ErrorMessage = "Họ tên không được để trống")]
        public string FullName { get; set; } = string.Empty;

        [Required, EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; } = string.Empty;

        public string? Phone { get; set; }

        [Required(ErrorMessage = "Mã vị trí tuyển dụng không được để trống")]
        public int JobId { get; set; }

        [Required(ErrorMessage = "Vui lòng đính kèm file CV định dạng PDF")]
        public IFormFile CvFile { get; set; } = null!;
    }
}
