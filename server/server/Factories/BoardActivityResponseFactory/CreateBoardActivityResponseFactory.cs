using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Dtos.Response.Board.BoardActivityRespones;
using server.Dtos.Response.Board.BoardActivityRespones.Bases;
using server.Dtos.Response.Board.BoardActivityRespones.Interfaces;
using server.Factories.BoardActivityResponseFactory.Interfaces;

namespace server.Factories.BoardActivityResponseFactory
{
    public class CreateBoardActivityResponseFactory : IBoardActivityResponseFactory
    {
        private readonly ApplicationDBContext _dbContext;

        public CreateBoardActivityResponseFactory(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.CreateBoard;
        }

        public async Task<IBoardActivityResponse> CreateBoardActivityResponseAsync(Guid boardActionId)
        {
            var boardAction = await _dbContext.Actions
                .Include(ba => ba.MemberCreator)
                .Include(ba => ba.Board)
                .Include(ba => ba.Workspace)
                .FirstOrDefaultAsync(a => a.Id == boardActionId);

            var response = new CreateBoardActivityResponse()
            {
                ActionId = boardAction.Id,
                Type = boardAction.ActionType,
                Date = boardAction.Date,
                MemberCreatorId = boardAction.MemberCreatorId,

                Data = new()
                {
                    BoardId = boardAction.Board.Id,
                    WorkspaceId = boardAction.Workspace.Id,
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
                        { EntityTypes.Workspace, new EntityTypeDisplay()
                            {
                                Id = boardAction.Workspace.Id,
                                Type = EntityTypes.Workspace,
                                Text = boardAction.Workspace.Name,
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
