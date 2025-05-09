﻿using server.Data;
using server.Entities;
using server.Enums;
using server.Models;

namespace server.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(EmailData mailData, bool isHtmlBody);
        Task SendActionEmailAsync(DennoAction action);
        void SendActionEmailInBackgroundAsync(DennoAction action);
        void SendConfirmationRegisterAccountEmail(string email, AppUser user);
    }
}
