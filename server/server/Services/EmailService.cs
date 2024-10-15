using Google.Apis.Auth.OAuth2;
using Google.Apis.Util.Store;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using MimeKit;
using Polly;
using server.Infrastructure.Configurations;
using server.Interfaces;
using server.Models;

namespace server.Services
{
    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;
        private readonly MailSettings _mailSettings;
        private readonly UserManager<AppUser> _userManager;
        private readonly FrontendUrlsConfiguration _frontendUrlsConfig;

        public EmailService(
            ILogger<EmailService> logger,
            IOptions<MailSettings> mailSettings,
            UserManager<AppUser> userManager,
            IOptions<FrontendUrlsConfiguration> frontendUrls)
        {
            _mailSettings = mailSettings.Value;
            _logger = logger;
            _userManager = userManager;
            _frontendUrlsConfig = frontendUrls.Value;
        }

        public async Task<bool> SendEmailAsync(EmailData emailData, bool isHtmlBody)
        {
            var policy = Policy
                .Handle<Exception>()
                .RetryAsync(3, (exception, retryCount) =>
                {
                    _logger.LogInformation($"Retrying email send due to: {exception.Message}. Retry attempt {retryCount}");
                });

            try
            {
                return await policy.ExecuteAsync(async () =>
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
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to send email after retries: {ex.Message}", ex);
                return false;
            }
        }

        public async Task SendConfirmationRegisterAccountEmailAsync(string email, AppUser user)
        {
            var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Helpers", "HtmlTemplates", "UserRegisterConfimationEmail.html");
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            var emailData = new EmailData()
            {
                EmailToId = email,
                EmailToName = email,
                EmailSubject = "Denno: Registration Account Verification Code",
                EmailBody = File.ReadAllText(templatePath).Replace("{VerificationCode}", token)
            };

            await SendEmailAsync(emailData, true);
        }
    }
}
