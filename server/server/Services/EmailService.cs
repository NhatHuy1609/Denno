using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MimeKit;
using Polly;
using RazorEngine;
using RazorEngine.Templating;
using server.Constants;
using server.Data;
using server.Entities;
using server.Enums;
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
        private readonly INotificationService _notificationService;
        private readonly ApplicationDBContext _dbContext;
        private readonly FrontendUrlsConfiguration _frontendUrlsConfig;

        public EmailService(
            ILogger<EmailService> logger,
            IOptions<MailSettings> mailSettings,
            UserManager<AppUser> userManager,
            IOptions<FrontendUrlsConfiguration> frontendUrls,
            INotificationService notificationService,
            ApplicationDBContext dbContext)
        {
            _mailSettings = mailSettings.Value;
            _logger = logger;
            _userManager = userManager;
            _notificationService = notificationService;
            _dbContext = dbContext;
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
            var templatePath = GetTemplatePath("UserRegisterConfimationEmail.html");
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

        public async Task SendActionEmailAsync(DennoAction action)
        {
            // Take notification recipients who will receive email about action
            var notification = await _dbContext.Notifications
                .FirstOrDefaultAsync(n => n.ActionId == action.Id);

            if (notification == null)
                throw new ArgumentNullException("");

            var recipients = await _dbContext.NotificationRecipients
                .Include(n => n.Recipient)
                .Where(n => n.NotificationId == notification.Id)
                .ToListAsync();

            // Send emails in parallel instead of waiting for each one sequentiall
            var emailTasks = recipients.Select(recipient =>
            {
                var mailData = BuildNotificationEmailData(recipient.Recipient.Email, action);
                return SendEmailAsync(mailData, true);
            });

            await Task.WhenAll(emailTasks);
        }

        private EmailData BuildNotificationEmailData(string recipientEmail, DennoAction action)
        {
            if (string.IsNullOrEmpty(recipientEmail))
                throw new ArgumentNullException("Recipient email cannot be null");

            // Creating message for email
            var message = _notificationService?.BuildActionNotificationMessage(action)
                ?? throw new ArgumentNullException(nameof(_notificationService), "Notification service cannot be null");

            string id = recipientEmail;
            string name = recipientEmail;
            string subject = message;
            string body = "";

            var notificationEmailModel = new NotificationTemplateModel
            {
                Message = message,
                SenderName = action.MemberCreator?.FullName ?? "Unknown Sender"
            };

            var templatePath = "";

            switch (action.ActionType)
            {
                case ActionTypes.AddMemberToWorkspace:
                    templatePath = File.ReadAllText(GetTemplatePath("NotificationTemplate.cshtml"));
                    body = Engine.Razor.RunCompile(templatePath, "addMemberToWorkspaceTemplate", typeof(NotificationTemplateModel), notificationEmailModel);
                    break;
                case ActionTypes.JoinWorkspaceByLink:
                    templatePath = File.ReadAllText(GetTemplatePath("LatestNewsEmailTemplate.cshtml"));
                    body = Engine.Razor.RunCompile(templatePath, "joinWorkspaceByLink", typeof(NotificationTemplateModel), notificationEmailModel);
                    break;
                default:
                    throw new ArgumentException("Failed to build notification email due to action not being found.");
            }

            return new EmailData()
            {
                EmailToId = id,
                EmailToName = name,
                EmailSubject = subject,
                EmailBody = body
            };
        }

        public static string GetTemplatePath(string templateFileName)
        {
            return Path.Combine(Directory.GetCurrentDirectory(), "Helpers", "HtmlTemplates", templateFileName);
        }
    }
}
