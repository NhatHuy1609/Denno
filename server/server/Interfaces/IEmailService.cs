using server.Models;

namespace server.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(EmailData mailData, bool isHtmlBody);
        Task SendConfirmationRegisterAccountEmailAsync(string email, AppUser user);
    }
}
