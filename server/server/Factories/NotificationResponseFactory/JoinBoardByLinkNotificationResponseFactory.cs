using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Dtos.Response.Notification;
using server.Dtos.Response.Notification.Bases;
using server.Dtos.Response.Notification.Interfaces;
using server.Dtos.Response.Users;
using server.Entities;
using server.Factories.NotificationResponseFactory.Interfaces;

namespace server.Factories.NotificationResponseFactory
{
    public class JoinBoardByLinkNotificationResponseFactory : INotificationResponseFactory
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly IMapper _mapper;
        private readonly ILogger<JoinBoardByLinkNotificationResponseFactory> _logger;

        public JoinBoardByLinkNotificationResponseFactory(
            ApplicationDBContext dbContext,
            IMapper mapper,
            ILogger<JoinBoardByLinkNotificationResponseFactory> logger)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _logger = logger;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.JoinBoardByLink;
        }

        public async Task<INotificationResponseDto> CreateNotificationResponse(NotificationRecipient notification)
        {
            var notiDetails = await _dbContext.Notifications
                .Include(n => n.Action)
                    .ThenInclude(a => a.Board)
                .Include(n => n.Action)
                    .ThenInclude(a => a.MemberCreator)
                .FirstOrDefaultAsync(n => n.Id == notification.NotificationId);

            var notificationResponse = new JoinBoardByLinkNotificationResponse()
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
                    MemberCreatorId = notiDetails.Action.MemberCreatorId
                },

                Display = new()
                {
                    Entities = new Dictionary<string, EntityTypeDisplay>
                    {
                        { EntityTypes.Board, new EntityTypeDisplay
                            {
                                Type = EntityTypes.Board,
                                Id = notiDetails.Action.Board.Id,
                                Text = notiDetails.Action.Board.Name,
                                ImageUrl = notiDetails.Action.Board.Background
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
