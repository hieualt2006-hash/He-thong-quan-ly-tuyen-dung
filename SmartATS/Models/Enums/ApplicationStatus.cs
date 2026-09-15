namespace SmartATS.Models.Enums
{
    public enum ApplicationStatus
    {
        NewApplied = 0,    // Mới nộp
        Screened = 1,      // Đã lọc
        Interview = 2,     // Phỏng vấn
        Offer = 3,         // Đề nghị nhận việc
        Rejected = 4,      // Từ chối
        Confirmed = 5      // Ứng viên đã xác nhận phỏng vấn qua Magic Link
    }
}
