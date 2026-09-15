using System.ComponentModel.DataAnnotations;

namespace SmartATS.Models.Entities
{
    public class Candidate
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(150)]
        public string FullName { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(256)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Phone { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property: Một ứng viên có thể ứng tuyển nhiều Job khác nhau
        public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}
