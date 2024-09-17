using Google.Apis.Auth.OAuth2;
using Google.Apis.Util.Store;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using MimeKit;
using server.Infrastructure.Configurations;
using server.Interfaces;
using server.Models;

namespace server.Services
{
    public class EmailService : IEmailService
    {
        private readonly MailSettings _mailSettings;
        private readonly UserManager<AppUser> _userManager;
        private readonly FrontendUrlsConfiguration _frontendUrlsConfig;

        public EmailService(IOptions<MailSettings> mailSettings, UserManager<AppUser> userManager, IOptions<FrontendUrlsConfiguration> frontendUrls)
        {
            _mailSettings = mailSettings.Value;
            _userManager = userManager;
            _frontendUrlsConfig = frontendUrls.Value;
        }

        public async Task<bool> SendEmailAsync(EmailData emailData, bool isHtmlBody)
        {
            try
            {
                MimeMessage emailMessage = new MimeMessage();
                MailboxAddress emailFrom = new MailboxAddress(_mailSettings.Name, _mailSettings.EmailId);
                emailMessage.From.Add(emailFrom);
                MailboxAddress emailTo = new MailboxAddress(emailData.EmailToName, emailData.EmailToId);
                emailMessage.To.Add(emailTo);

                emailMessage.Subject = emailData.EmailSubject;

                BodyBuilder emailBodyBuilder = new BodyBuilder();

                if (isHtmlBody)
                {
                    emailBodyBuilder.HtmlBody = emailData.EmailBody;
                }
                else
                {
                    emailBodyBuilder.TextBody = emailData.EmailBody;
                }

                emailMessage.Body = emailBodyBuilder.ToMessageBody();

                SmtpClient smtpClient = new SmtpClient();
                smtpClient.Connect(_mailSettings.Host, _mailSettings.Port, _mailSettings.UseSSL);
                smtpClient.Authenticate(_mailSettings.EmailId, _mailSettings.Password);
                await smtpClient.SendAsync(emailMessage);

                smtpClient.Disconnect(true);
                smtpClient.Dispose();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task SendConfirmationRegisterAccountEmailAsync(string email, AppUser user)
        {
            var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Helpers", "HtmlTemplates", "UserRegisterConfimationEmail.html");
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            var confirmationLinkBuilder = new UriBuilder(_frontendUrlsConfig.BaseUrl)
            {
                Path = _frontendUrlsConfig.EmailConfirmation,
                Query = QueryString.Create(new Dictionary<string, string?>
                {
                    { "Email", email},
                    { "Token", token }
                }).ToString()
            };

            var emailData = new EmailData()
            {
                EmailToId = email,
                EmailToName = email,
                EmailSubject = "Xác thực email đăng ký tài khoản",
                EmailBody = File.ReadAllText(templatePath).Replace("{VerificationLink}", confirmationLinkBuilder.ToString())
            };

            await SendEmailAsync(emailData, true);
        }
    }
}
