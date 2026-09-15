using System.ComponentModel.DataAnnotations;

namespace SmartATS.Models.Entities
{
    public class InterviewToken
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ApplicationId { get; set; }

        [Required]
        public Guid TokenString { get; set; } = Guid.NewGuid();

        [Required]
        public DateTime ExpirationDate { get; set; }

        public bool IsUsed { get; set; } = false;

        public DateTime? UsedAt { get; set; }

        public virtual Application Application { get; set; } = null!;
    }
}
