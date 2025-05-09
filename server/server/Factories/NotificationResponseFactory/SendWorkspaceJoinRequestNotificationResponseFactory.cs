using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Dtos.Response.Notification;
using server.Dtos.Response.Notification.Interfaces;
using server.Dtos.Response.Notification.Models;
using server.Dtos.Response.Users;
using server.Entities;

namespace server.Factories.NotificationResponseFactory
{
    public class SendWorkspaceJoinRequestNotificationResponseFactory : INotificationResponseFactory
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly IMapper _mapper;

        public SendWorkspaceJoinRequestNotificationResponseFactory(
            ApplicationDBContext dbContext,
            IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<INotificationResponseDto> CreateNotificationResponse(NotificationRecipient notification)
        {
            var notiDetails = await _dbContext.Notifications
                .Include(n => n.Action)
                    .ThenInclude(a => a.Workspace)
                .Include(n => n.Action)
                    .ThenInclude(a => a.MemberCreator)
                .FirstOrDefaultAsync(n => n.Id == notification.NotificationId);

            var notificationResponse = new SendWorkspaceJoinRequestNotificationResponse()
            {
                Id = notiDetails.Id,
                IsRead = notification.IsRead,
                Date = notiDetails.Date,
                DateRead = notification.DateRead,
                MemberCreatorId = notiDetails.Action.MemberCreatorId,
                ActionId = notiDetails.ActionId,
                MemberCreator = _mapper.Map<GetUserResponseDto>(notiDetails.Action.MemberCreator),

                Data = new SendWorkspaceJoinRequestData
                {
                    WorkspaceId = notiDetails.Action.WorkspaceId.Value,
                    RequesterId = notiDetails.Action.MemberCreatorId,
                },

                Display = new NotificationDisplay
                {
                    TranslationKey = TranslationKeys.SendWorkspaceJoinRequest,
                    Entities = new Dictionary<string, EntityTypeDisplay>
                    {
                        { EntityTypes.Workspace, new EntityTypeDisplay
                            {
                                Type = EntityTypes.Workspace,
                                Id = notiDetails.Action.Workspace.Id,
                                Text = notiDetails.Action.Workspace.Name
                            }
                        },
                        { EntityTypes.Requester, new EntityTypeDisplay
                            {
                                Type = EntityTypes.Requester,
                                Id = notiDetails.Action.TargetUserId,
                                Text = notiDetails.Action.MemberCreator.FullName
                            }
                        }
                    }
                }
            };

            return notificationResponse;
        }
    }
}
