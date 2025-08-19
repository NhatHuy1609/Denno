using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Dtos.Response.Notification;
using server.Dtos.Response.Notification.Interfaces;
using server.Dtos.Response.Notification.Models;
using server.Dtos.Response.Users;
using server.Entities;
using server.Helpers;

namespace server.Factories.NotificationResponseFactory
{
    public class UpdateWorkspaceMemberRoleNotificationResponseFactory : INotificationResponseFactory

    {
        private readonly IMapper _mapper;
        private readonly ApplicationDBContext _dbContext;

        public UpdateWorkspaceMemberRoleNotificationResponseFactory(
            IMapper mapper,
            ApplicationDBContext dbContext)
        {
            _mapper = mapper;
            _dbContext = dbContext;
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

            var actionMetaData = JsonHelper.DeserializeData<UpdateWorkspaceMemberRoleData>(notiDetails.Action.MetaData);

            var notificationResponse = new UpdateWorkspaceMemberRoleNotificationResponse()
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
                    WorkspaceIde = notiDetails.Action.WorkspaceId.Value,
                    MemberCreatorId = notiDetails.Action.MemberCreatorId,
                    UpdatedMemberId = notiDetails.Action.TargetUserId,
                    NewMemberRole = actionMetaData.NewMemberRole
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
                        { EntityTypes.UpdatedMember, new EntityTypeDisplay
                            {
                                Type = EntityTypes.UpdatedMember,
                                Id = notiDetails.Action.TargetUserId,
                                Text = notiDetails.Action.TargetUser.FullName
                            }
                        },
                        { EntityTypes.MemberRole, new EntityTypeDisplay
                            {
                                Type = EntityTypes.MemberRole,
                                Text = actionMetaData.NewMemberRole.ToString()
                            }
                        }
                    }
                }
            };

            return notificationResponse;
        }
    }
}
