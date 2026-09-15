using Microsoft.EntityFrameworkCore;
using SmartATS.Models.Entities;

namespace SmartATS.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Candidate> Candidates => Set<Candidate>();
        public DbSet<Job> Jobs => Set<Job>();
        public DbSet<Application> Applications => Set<Application>();
        public DbSet<InterviewToken> InterviewTokens => Set<InterviewToken>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Email ứng viên là Unique Index
            modelBuilder.Entity<Candidate>()
                .HasIndex(c => c.Email)
                .IsUnique();

            // 2. Quan hệ Application - Candidate và Application - Job
            modelBuilder.Entity<Application>()
                .HasOne(a => a.Candidate)
                .WithMany(c => c.Applications)
                .HasForeignKey(a => a.CandidateId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Application>()
                .HasOne(a => a.Job)
                .WithMany(j => j.Applications)
                .HasForeignKey(a => a.JobId)
                .OnDelete(DeleteBehavior.Restrict);

            // 3. Quan hệ InterviewToken - Application
            modelBuilder.Entity<InterviewToken>()
                .HasOne(it => it.Application)
                .WithMany(a => a.InterviewTokens)
                .HasForeignKey(it => it.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
