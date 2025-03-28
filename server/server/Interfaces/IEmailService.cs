using server.Entities;
using server.Enums;
using server.Models;

namespace server.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(EmailData mailData, bool isHtmlBody);
        Task SendActionEmailAsync(DennoAction action);
        Task SendConfirmationRegisterAccountEmailAsync(string email, AppUser user);
    }
}
