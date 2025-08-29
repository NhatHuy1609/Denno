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
    public class ApproveBoardJoinRequestNotificationResponseFactory : INotificationResponseFactory
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly IMapper _mapper;

        public ApproveBoardJoinRequestNotificationResponseFactory(
            ApplicationDBContext dbContext,
            IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.ApproveBoardJoinRequest;
        }

        public async Task<INotificationResponseDto> CreateNotificationResponse(NotificationRecipient notification)
        {
            var notiDetails = await _dbContext.Notifications
                .Include(n => n.Action)
                    .ThenInclude(a => a.Board)
                .Include(n => n.Action)
                    .ThenInclude(a => a.MemberCreator)
                .Include(n => n.Action)
                    .ThenInclude(a => a.TargetUser)
                .FirstOrDefaultAsync(n => n.Id == notification.NotificationId);

            var notificationResponse = new ApproveBoardJoinRequestNotificationResponse()
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
                    BoardId = notiDetails.Action.BoardId.Value,
                    MemberCreatorId = notiDetails.Action.MemberCreatorId,
                    AddedMemberId = notiDetails.Action.TargetUserId
                },

                Display = new()
                {
                    TranslationKey = TranslationKeys.SendWorkspaceJoinRequest,
                    Entities = new Dictionary<string, EntityTypeDisplay>
                    {
                        { EntityTypes.Board, new EntityTypeDisplay
                            {
                                Type = EntityTypes.Board,
                                Id = notiDetails.Action.Board.Id,
                                Text = notiDetails.Action.Board.Name
                            }
                        },
                        { EntityTypes.MemberCreator, new EntityTypeDisplay
                            {
                                Type = EntityTypes.MemberCreator,
                                Id = notiDetails.Action.MemberCreatorId,
                                Text = notiDetails.Action.MemberCreator.FullName
                            }
                        },
                        { EntityTypes.AddedMember, new EntityTypeDisplay
                            {
                                Type = EntityTypes.AddedMember,
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
