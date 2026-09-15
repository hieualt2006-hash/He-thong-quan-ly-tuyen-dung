using System.ComponentModel.DataAnnotations;
using SmartATS.Models.Enums;

namespace SmartATS.Models.Entities
{
    public class Application
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CandidateId { get; set; }

        [Required]
        public int JobId { get; set; }

        public ApplicationStatus Status { get; set; } = ApplicationStatus.NewApplied;

        [Required, MaxLength(500)]
        public string CVFilePath { get; set; } = string.Empty;

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        // Ghi chú và đánh giá của HR
        public string? HRNotes { get; set; }
        
        [Range(1, 5)]
        public int? Rating { get; set; }

        // Navigation Properties
        public virtual Candidate Candidate { get; set; } = null!;
        public virtual Job Job { get; set; } = null!;
        public virtual ICollection<InterviewToken> InterviewTokens { get; set; } = new List<InterviewToken>();
    }
}
