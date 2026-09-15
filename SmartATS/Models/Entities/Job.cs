using System.ComponentModel.DataAnnotations;

namespace SmartATS.Models.Entities
{
    public class Job
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(250)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}
