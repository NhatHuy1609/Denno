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
using server.Services.QueueHostedService;

namespace server.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;
        private readonly MailSettings _mailSettings;
        private readonly ApplicationDBContext _dbContext;
        private readonly IBackgroundTaskQueue _taskQueue;
        private readonly FrontendUrlsConfiguration _frontendUrlsConfig;
        private readonly Dictionary<string, Func<DennoAction, string>> _messageTemplates;

        public EmailService(
            ILogger<EmailService> logger,
            IOptions<MailSettings> mailSettings,
            IOptions<FrontendUrlsConfiguration> frontendUrls,
            ApplicationDBContext dbContext,
            IBackgroundTaskQueue taskQueue)
        {
            _mailSettings = mailSettings.Value;
            _logger = logger;
            _dbContext = dbContext;
            _taskQueue = taskQueue;
            _frontendUrlsConfig = frontendUrls.Value;

            _messageTemplates = new Dictionary<string, Func<DennoAction, string>>()
            {
                {
                    ActionTypes.AddMemberToWorkspace,
                    action => $"{action.MemberCreator?.FullName} added {action.TargetUser?.FullName} to workspace {action.Workspace?.Name}"
                },
                {
                    ActionTypes.JoinWorkspaceByLink,
                    action => $"{action.MemberCreator?.FullName} is now a member of the Workspace {action.Workspace?.Name}. Help them get started by adding them to a card in any board."
                },
                {
                    ActionTypes.ApproveWorkspaceJoinRequest,
                     action => $"{action.MemberCreator?.FullName} approved your request to join the workspace {action.Workspace?.Name}"
                },
                {
                    ActionTypes.RejectWorkspaceJoinRequest,
                     action => $"{action.MemberCreator?.FullName} rejected your request to join the workspace {action.Workspace?.Name}"
                }
            };
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

        public void SendConfirmationRegisterAccountEmail(string email, AppUser user)
        {
            _taskQueue.QueueBackgroundWorkItem(async (cancellationToken, serviceProvider) =>
            {
                var templatePath = GetTemplatePath("UserRegisterConfimationEmail.html");
                var userManager = serviceProvider.GetRequiredService<UserManager<AppUser>>();
                var token = await userManager.GenerateEmailConfirmationTokenAsync(user);

                var emailData = new EmailData()
                {
                    EmailToId = email,
                    EmailToName = email,
                    EmailSubject = "Denno: Registration Account Verification Code",
                    EmailBody = File.ReadAllText(templatePath).Replace("{VerificationCode}", token)
                };

                await SendEmailAsync(emailData, true);
            });
        }

        public async Task SendActionEmailAsync(DennoAction action)
        {
            await SendActionEmailInternalAsync(action, _dbContext);
        }

        public void SendActionEmailInBackgroundAsync(DennoAction action)
        {
            if (action != null)
            {
                _taskQueue.QueueBackgroundWorkItem(async (cancellationToken, serviceProvider) =>
                {
                    var dbContext = serviceProvider.GetRequiredService<ApplicationDBContext>();

                    await SendActionEmailInternalAsync(action, dbContext);
                });
            }
        }

        private async Task SendActionEmailInternalAsync(DennoAction action, ApplicationDBContext dbContext)
        {
            // Take notification recipients who will receive email about action
            var notification = await dbContext.Notifications
                .FirstOrDefaultAsync(n => n.ActionId == action.Id);

            if (notification == null)
                throw new ArgumentNullException("Notification Object can not be null");

            var recipients = await dbContext.NotificationRecipients
                .AsNoTracking()
                .Include(n => n.Recipient)
                .Where(n => n.NotificationId == notification.Id)
                .Select(n => n.Recipient.Email)
                .ToListAsync();

            // Send emails in parallel instead of waiting for each one sequentiall
            var emailTasks = recipients.Select(email =>
            {
                var mailData = BuildActionEmailData(email, action);
                return SendEmailAsync(mailData, true);
            });

            await Task.WhenAll(emailTasks);
        }

        private EmailData BuildActionEmailData(string recipientEmail, DennoAction action)
        {
            if (string.IsNullOrEmpty(recipientEmail))
                throw new ArgumentNullException("Recipient email cannot be null");

            // Creating message for email
            var message = this.BuildActionEmailMessage(action);

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
                case ActionTypes.ApproveWorkspaceJoinRequest:
                    templatePath = File.ReadAllText(GetTemplatePath("NotificationTemplate.cshtml"));
                    body = Engine.Razor.RunCompile(templatePath, "approveWorkspaceJoinRequestTemplate", typeof(NotificationTemplateModel), notificationEmailModel);
                    break;
                case ActionTypes.RejectWorkspaceJoinRequest:
                    templatePath = File.ReadAllText(GetTemplatePath("NotificationTemplate.cshtml"));
                    body = Engine.Razor.RunCompile(templatePath, "rejectWorkspaceJoinRequestTemplate", typeof(NotificationTemplateModel), notificationEmailModel);
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

        private string? BuildActionEmailMessage(DennoAction action)
        {
            if (_messageTemplates.TryGetValue(action.ActionType, out var template))
            {
                return template(action);
            }

            return null;
        }
    }
}
