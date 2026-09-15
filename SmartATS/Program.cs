using Microsoft.EntityFrameworkCore;
using SmartATS.Data;
using SmartATS.Models.Entities;
using SmartATS.Models.Enums;

var builder = WebApplication.CreateBuilder(args);

// 1. Đăng ký Database (SQLite cho môi trường Dev chạy ngay tức thì không cần cài thêm SQL Server)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=smart_ats.db";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// 2. Cấu hình Controllers và Views (Hybrid MVC + Web API)
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// 3. Cho phép CORS cho Public API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowPublicForm", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// 4. Khởi tạo Database và Seed dữ liệu mẫu khi chạy ứng dụng
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var env = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();

    db.Database.EnsureCreated();

    // Tạo thư mục lưu trữ CV nếu chưa tồn tại
    var uploadsPath = Path.Combine(env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads", "cvs");
    if (!Directory.Exists(uploadsPath))
    {
        Directory.CreateDirectory(uploadsPath);
    }

    // Tạo một file PDF mẫu nếu chưa có
    var sampleCvPath = Path.Combine(uploadsPath, "sample_resume.pdf");
    if (!File.Exists(sampleCvPath))
    {
        // Tạo file dummy đơn giản
        File.WriteAllText(sampleCvPath, "%PDF-1.4 ... Smart ATS Sample Candidate Resume ...");
    }

    // Seed Data
    if (!db.Users.Any())
    {
        db.Users.Add(new User
        {
            Username = "admin_hr",
            Email = "hr@company.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = "Admin"
        });
    }

    if (!db.Jobs.Any())
    {
        var job1 = new Job
        {
            Title = "Senior Full-Stack .NET Developer",
            Description = "Yêu cầu 4+ năm kinh nghiệm C#, ASP.NET Core, EF Core, RESTful API và React/Vue.",
            IsActive = true
        };
        var job2 = new Job
        {
            Title = "AI Engineer (Python / LLMs)",
            Description = "Nghiên cứu và phát triển các mô hình AI tích hợp cho hệ thống ATS tự động sàng lọc CV.",
            IsActive = true
        };

        db.Jobs.AddRange(job1, job2);
        db.SaveChanges();

        // Thêm các ứng viên mẫu
        var c1 = new Candidate { FullName = "Nguyễn Văn An", Email = "an.nguyen@example.com", Phone = "0901234567" };
        var c2 = new Candidate { FullName = "Trần Thị Bích", Email = "bich.tran@example.com", Phone = "0912345678" };
        var c3 = new Candidate { FullName = "Lê Hoàng Cường", Email = "cuong.le@example.com", Phone = "0987654321" };

        db.Candidates.AddRange(c1, c2, c3);
        db.SaveChanges();

        db.Applications.AddRange(
            new Application
            {
                CandidateId = c1.Id,
                JobId = job1.Id,
                Status = ApplicationStatus.NewApplied,
                CVFilePath = "/uploads/cvs/sample_resume.pdf",
                Rating = 4,
                HRNotes = "Hồ sơ ấn tượng, có kinh nghiệm với Microservices."
            },
            new Application
            {
                CandidateId = c2.Id,
                JobId = job1.Id,
                Status = ApplicationStatus.Screened,
                CVFilePath = "/uploads/cvs/sample_resume.pdf",
                Rating = 5,
                HRNotes = "Kỹ năng ASP.NET vững, tiếng Anh giao tiếp tốt."
            },
            new Application
            {
                CandidateId = c3.Id,
                JobId = job1.Id,
                Status = ApplicationStatus.Interview,
                CVFilePath = "/uploads/cvs/sample_resume.pdf",
                Rating = 4
            }
        );
        db.SaveChanges();
    }
}

// 5. Middleware Pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseCors("AllowPublicForm");

app.UseAuthorization();

// Đặt Controller mặc định là Pipeline
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Pipeline}/{action=Index}/{id?}");

app.Run();
