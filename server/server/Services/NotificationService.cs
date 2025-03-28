using Microsoft.EntityFrameworkCore;
using Serilog.Events;
using server.Constants;
using server.Data;
using server.Entities;
using server.Enums;
using server.Interfaces;

namespace server.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDBContext _context;
        private readonly Dictionary<string, Func<DennoAction, string>> _messageTemplates;

        public NotificationService(ApplicationDBContext context)
        {
            _context = context;
            _messageTemplates = new Dictionary<string, Func<DennoAction, string>>()
            {
                { 
                    ActionTypes.AddMemberToWorkspace,
                    action => $"{action.MemberCreator?.FullName} added {action.TargetUser?.FullName} to workspace {action.Workspace?.Name}"
                }
            };
        }

        public string? BuildActionNotificationMessage(DennoAction action)
        {
            if (_messageTemplates.TryGetValue(action.ActionType, out var template))
            {
                return template(action);
            }

            return null;
        }
    }
}
