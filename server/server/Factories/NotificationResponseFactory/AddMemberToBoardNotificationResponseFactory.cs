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
    public class AddMemberToBoardNotificationResponseFactory : INotificationResponseFactory
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly IMapper _mapper;
        private readonly ILogger<AddMemberToBoardNotificationResponseFactory> _logger;

        public AddMemberToBoardNotificationResponseFactory(
            ApplicationDBContext dbContext,
            IMapper mapper,
            ILogger<AddMemberToBoardNotificationResponseFactory> logger)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _logger = logger;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.AddMemberToBoard;
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

            if (notiDetails == null)
            {
                throw new ArgumentException("Not found notification to create response");
            }

            if (notiDetails?.Action == null)
            {
                throw new Exception("Action is null");
            }

            if (notiDetails.Action?.Board == null)
            {
                throw new Exception("Board is null");
            }

            if (notiDetails.Action?.MemberCreator == null)
            {
                throw new Exception("MemberCreator is null");
            }

            if (notiDetails.Action?.TargetUser == null)
            {
                throw new Exception("TargetUser is null");
            }

            var notificationResponse = new AddMemberToBoardNotificationResponseDto()
            {
                Id = notiDetails.Id,
                IsRead = notification.IsRead,
                Date = notiDetails.Date,
                DateRead = notification.DateRead,
                MemberCreatorId = notiDetails.Action.MemberCreatorId,
                ActionId = notiDetails.ActionId,
                MemberCreator = _mapper.Map<GetUserResponseDto>(notiDetails.Action.MemberCreator),

                Data = new AddMemberToBoardData
                {
                    BoardId = notiDetails.Action.BoardId.Value,
                    AddedMemberId = notiDetails.Action.TargetUserId,
                    MemberCreatorId = notiDetails.Action.MemberCreatorId
                },

                Display = new NotificationDisplay
                {
                    TranslationKey = TranslationKeys.AddMemberToBoard,
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
                                Type = EntityTypes.User,
                                Id = notiDetails.Action.MemberCreatorId,
                                Text = notiDetails.Action.MemberCreator.FullName
                            }
                        },
                        { EntityTypes.AddedMember, new EntityTypeDisplay
                            {
                                Type = EntityTypes.User,
                                Id = notiDetails.Action.TargetUser.Id,
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
