using server.Enums;
using server.Models;

namespace server.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(EmailData mailData, bool isHtmlBody);
        Task SendNotificationEmailAsync(int notificationObjectId, string notifierId, string senderId, string? noteFromSender);
        Task SendConfirmationRegisterAccountEmailAsync(string email, AppUser user);
    }
}
