using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Dtos.Response.Board.BoardActivityRespones;
using server.Dtos.Response.Board.BoardActivityRespones.Bases;
using server.Dtos.Response.Board.BoardActivityRespones.Interfaces;
using server.Factories.BoardActivityResponseFactory.Interfaces;
using server.Helpers;
using server.Models.DennoActionMetaData;

namespace server.Factories.BoardActivityResponseFactory
{
    public class UpdateBoardMemberActivityResponseFactory : IBoardActivityResponseFactory
    {
        private readonly ApplicationDBContext _dbContext;

        public UpdateBoardMemberActivityResponseFactory(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.UpdateBoardMemberRole;
        }

        public async Task<IBoardActivityResponse> CreateBoardActivityResponseAsync(Guid boardActionId)
        {
            var boardAction = await _dbContext.Actions
                .Include(ba => ba.MemberCreator)
                .Include(ba => ba.Board)
                .FirstOrDefaultAsync(a => a.Id == boardActionId);
            
            var metaData = JsonHelper.DeserializeData<UpdateBoardMemberRoleMetaData>(boardAction.MetaData);

            var response = new UpdateBoardMemberRoleActivityResponse()
            {
                ActionId = boardAction.Id,
                Type = boardAction.ActionType,
                Date = boardAction.Date,
                MemberCreatorId = boardAction.MemberCreatorId,

                Data = new()
                {
                    BoardId = boardAction.Board.Id,
                    MemberCreatorId = boardAction.MemberCreatorId,
                    UpdatedMemberId = boardAction.TargetUserId,
                    NewMemberRole = metaData.NewRole
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
                        },
                        {
                            EntityTypes.MemberRole, new EntityTypeDisplay()
                            {
                                Id = metaData.NewRole.ToString(),
                                Type = EntityTypes.MemberRole,
                                Text = metaData.NewRole.ToString(),
                            }
                        }
                    }
                }
            };

            return response;
        }
    }
}
