using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Dtos.Response.Board.BoardActivityRespones;
using server.Dtos.Response.Board.BoardActivityRespones.Bases;
using server.Dtos.Response.Board.BoardActivityRespones.Interfaces;
using server.Factories.BoardActivityResponseFactory.Interfaces;

namespace server.Factories.BoardActivityResponseFactory
{
    public class AddBoardMemberActivityResponseFactory : IBoardActivityResponseFactory
    {
        private readonly ApplicationDBContext _dbContext;

        public AddBoardMemberActivityResponseFactory(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.AddMemberToBoard;
        }

        public async Task<IBoardActivityResponse> CreateBoardActivityResponseAsync(Guid boardActionId)
        {
            var boardAction = await _dbContext.Actions
                .Include(ba => ba.MemberCreator)
                .Include(ba => ba.Board)
                .Include(ba => ba.TargetUser)
                .FirstOrDefaultAsync(ba => ba.Id == boardActionId);

            var response = new AddBoardMemberActivityResponse()
            {
                ActionId = boardAction.Id,
                Type = boardAction.ActionType,
                Date = boardAction.Date,
                MemberCreatorId = boardAction.MemberCreatorId,

                Data = new()
                {
                    BoardId = boardAction.Board.Id,
                    AddedMember = boardAction.TargetUserId,
                    MemberCreatorId = boardAction.MemberCreatorId
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
                        { EntityTypes.AddedMember, new EntityTypeDisplay()
                            {
                                Id = boardAction.TargetUser.Id,
                                Type = EntityTypes.AddedMember,
                                Text = boardAction.TargetUser.FullName,
                            }
                        },
                        { EntityTypes.MemberCreator, new EntityTypeDisplay()
                            {
                                Id = boardAction.MemberCreator.Id,
                                Type = EntityTypes.MemberCreator,
                                Text = boardAction.MemberCreator.FullName,
                            }
                        }
                    }
                }
            };

            return response;
        }
    }
}
