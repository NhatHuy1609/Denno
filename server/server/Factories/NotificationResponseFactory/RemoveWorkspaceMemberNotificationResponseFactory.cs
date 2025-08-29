using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Dtos.Response.Notification;
using server.Dtos.Response.Notification.Interfaces;
using server.Dtos.Response.Notification.Models;
using server.Dtos.Response.Users;
using server.Entities;
using server.Factories.NotificationResponseFactory.Interfaces;

namespace server.Factories.NotificationResponseFactory
{
    public class RemoveWorkspaceMemberNotificationResponseFactory : INotificationResponseFactory
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly IMapper _mapper;

        public RemoveWorkspaceMemberNotificationResponseFactory(
            ApplicationDBContext dbContext,
            IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.RemoveWorkspaceMember;
        }

        public async Task<INotificationResponseDto> CreateNotificationResponse(NotificationRecipient notification)
        {
            var notiDetails = await _dbContext.Notifications
                .Include(n => n.Action)
                    .ThenInclude(a => a.Workspace)
                .Include(n => n.Action)
                    .ThenInclude(a => a.MemberCreator)
                .Include(n => n.Action)
                    .ThenInclude(a => a.TargetUser)
                .FirstOrDefaultAsync(n => n.Id == notification.NotificationId);

            var notificationResponse = new RemoveWorkspaceMemberNotificationResponse()
            {
                Id = notiDetails.Id,
                IsRead = notification.IsRead,
                Date = notiDetails.Date,
                DateRead = notification.DateRead,
                MemberCreatorId = notiDetails.Action.MemberCreatorId,
                ActionId = notiDetails.ActionId,
                MemberCreator = _mapper.Map<GetUserResponseDto>(notiDetails.Action.MemberCreator),

                Data = new()
                {
                    WorkspaceId = notiDetails.Action.WorkspaceId.Value,
                    MemberCreatorId = notiDetails.Action.MemberCreatorId,
                    RemovedMemberId = notiDetails.Action.TargetUserId
                },

                Display = new()
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
                        { EntityTypes.MemberCreator, new EntityTypeDisplay
                            {
                                Type = EntityTypes.MemberCreator,
                                Id = notiDetails.Action.MemberCreatorId,
                                Text = notiDetails.Action.MemberCreator.FullName
                            }
                        },
                        { EntityTypes.RemovedMember, new EntityTypeDisplay
                            {
                                Type = EntityTypes.UpdatedMember,
                                Id = notiDetails.Action.TargetUserId,
                                Text = notiDetails.Action.TargetUser.FullName
                            }
                        }
                    }
                }
            };

            return notificationResponse;
        }
    }
}
