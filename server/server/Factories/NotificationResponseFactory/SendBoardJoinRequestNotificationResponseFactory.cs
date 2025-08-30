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
using server.Interfaces;

namespace server.Factories.NotificationResponseFactory
{
    public class SendBoardJoinRequestNotificationResponseFactory : INotificationResponseFactory
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IWorkspaceService _workspaceService;

        public SendBoardJoinRequestNotificationResponseFactory(
            ApplicationDBContext dbContext,
            IMapper mapper,
            IWorkspaceService workspaceService)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _workspaceService = workspaceService;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.SendBoardJoinRequest;
        }

        public async Task<INotificationResponseDto> CreateNotificationResponse(NotificationRecipient notification)
        {
            var notiDetails = await _dbContext.Notifications
                .Include(n => n.Action)
                    .ThenInclude(a => a.Board)
                .Include(n => n.Action)
                    .ThenInclude(a => a.MemberCreator)
                .FirstOrDefaultAsync(n => n.Id == notification.NotificationId);

            var workspace = await _dbContext.Workspaces.FindAsync(notiDetails.Action.Board.WorkspaceId);

            var isWorksapceMember = await _workspaceService.IsWorkspaceMemberAsync(
                notiDetails.Action.Board.WorkspaceId,
                notiDetails.Action.MemberCreatorId);

            var notificationResponse = new SendBoardJoinRequestNotificationResponse()
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
                    RequesterId = notiDetails.Action.MemberCreatorId,
                    IsWorkspaceMember = isWorksapceMember
                },

                Display = new NotificationDisplay
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
                        { EntityTypes.Workspace, new EntityTypeDisplay
                            {
                                Type = EntityTypes.Workspace,
                                Id = workspace.Id,
                                Text = workspace.Name
                            }
                        },
                        { EntityTypes.Requester, new EntityTypeDisplay
                            {
                                Type = EntityTypes.Requester,
                                Id = notiDetails.Action.MemberCreatorId,
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
