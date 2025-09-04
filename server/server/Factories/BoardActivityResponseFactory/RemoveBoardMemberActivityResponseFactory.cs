using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Dtos.Response.Board.BoardActivityRespones;
using server.Dtos.Response.Board.BoardActivityRespones.Bases;
using server.Dtos.Response.Board.BoardActivityRespones.Interfaces;
using server.Factories.BoardActivityResponseFactory.Interfaces;

namespace server.Factories.BoardActivityResponseFactory
{
    public class RemoveBoardMemberActivityResponseFactory : IBoardActivityResponseFactory
    {
        private readonly ApplicationDBContext _dbContext;

        public RemoveBoardMemberActivityResponseFactory(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.RemoveBoardMember;
        }

        public async Task<IBoardActivityResponse> CreateBoardActivityResponseAsync(Guid boardActionId)
        {
            var boardAction = await _dbContext.Actions
                .Include(ba => ba.MemberCreator)
                .Include(ba => ba.Board)
                .FirstOrDefaultAsync(a => a.Id == boardActionId);

            var response = new RemoveBoardMemberActivityResponse()
            {
                ActionId = boardAction.Id,
                Type = boardAction.ActionType,
                Date = boardAction.Date,
                MemberCreatorId = boardAction.MemberCreatorId,

                Data = new()
                {
                    BoardId = boardAction.Board.Id,
                    MemberCreatorId = boardAction.MemberCreatorId,
                    RemovedUserId = boardAction.TargetUserId
                },

                Display = new()
                {
                    Entities = new()
                    {
                        { EntityTypes.Board, new EntityTypeDisplay()
                            {
                                Id = boardAction.Board.Id,
                                Type = EntityTypes.Board,
                                Text = boardAction.Board.Name,
                            }
                        },
                        { EntityTypes.MemberCreator, new EntityTypeDisplay()
                            {
                                Id = boardAction.MemberCreator.Id,
                                Type = EntityTypes.MemberCreator,
                                Text = boardAction.MemberCreator.FullName,
                            }
                        },
                        { EntityTypes.UpdatedMember, new EntityTypeDisplay()
                            {
                                Id = boardAction.TargetUserId,
                                Type = EntityTypes.UpdatedMember,
                                Text = boardAction.TargetUser?.FullName ?? "Unknown Member",
                            }
                        }
                    }
                }
            };

            return response;
        }
    }
}
