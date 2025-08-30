using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Dtos.Response.Notification;
using server.Dtos.Response.Notification.Bases;
using server.Dtos.Response.Notification.Interfaces;
using server.Dtos.Response.Notification.Models;
using server.Dtos.Response.Users;
using server.Entities;
using server.Factories.NotificationResponseFactory.Interfaces;

namespace server.Factories.NotificationResponseFactory
{
    public class JoinWorkspaceWithLinkNotificationResponseFactory: INotificationResponseFactory
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly IMapper _mapper;
        private readonly ILogger<AddedMemberWorkspaceNotificationResponseFactory> _logger;

        public JoinWorkspaceWithLinkNotificationResponseFactory(
            ApplicationDBContext dbContext,
            IMapper mapper,
            ILogger<AddedMemberWorkspaceNotificationResponseFactory> logger)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _logger = logger;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.JoinWorkspaceByLink;
        }

        public async Task<INotificationResponseDto> CreateNotificationResponse(NotificationRecipient notification)
        {
            var notiDetails = await _dbContext.Notifications
                .Include(n => n.Action)
                    .ThenInclude(a => a.Workspace)
                .Include(n => n.Action)
                    .ThenInclude(a => a.MemberCreator)
                .FirstOrDefaultAsync(n => n.Id == notification.NotificationId);

            var notificationResponse = new JoinWorkspaceByLinkNotificationResponse()
            {
                Id = notiDetails.Id,
                IsRead = notification.IsRead,
                Date = notiDetails.Date,
                DateRead = notification.DateRead,
                MemberCreatorId = notiDetails.Action.MemberCreatorId,
                ActionId = notiDetails.ActionId,
                MemberCreator = _mapper.Map<GetUserResponseDto>(notiDetails.Action.MemberCreator),

                Data = new JoinWorkspaceByLinkData
                {
                    WorkspaceId = notiDetails.Action.WorkspaceId.Value,
                    JoinedMemberId = notiDetails.Action.MemberCreatorId
                },

                Display = new NotificationDisplay
                {
                    Entities = new Dictionary<string, EntityTypeDisplay>
                    {
                        { EntityTypes.Workspace, new EntityTypeDisplay
                            {
                                Type = EntityTypes.Workspace,
                                Id = notiDetails.Action.Workspace.Id,
                                Text = notiDetails.Action.Workspace.Name
                            }
                        },
                        { EntityTypes.JoinedMember, new EntityTypeDisplay
                            {
                                Type = EntityTypes.User,
                                Id = notiDetails.Action.MemberCreator.Id,
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
