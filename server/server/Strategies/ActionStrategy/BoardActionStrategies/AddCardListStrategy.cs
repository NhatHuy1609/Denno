using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;
using server.Helpers;
using server.Helpers.LexoRank;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy.BoardActionStrategies
{
    public class AddCardListStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public AddCardListStrategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool CanHandle(string actionType)
        {
            return ActionTypes.CreateCardList == actionType;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            var createContext = context as CreateCardListContext ??
                                throw new ArgumentException("Invalid context type for CreateCardListContext");

            ArgumentException.ThrowIfNullOrWhiteSpace(createContext.MemberCreatorId);
            ArgumentException.ThrowIfNullOrWhiteSpace(createContext.CardListName);
            ArgumentNullException.ThrowIfNull(createContext.BoardId);

            var boardId = createContext.BoardId;

            var newCardList = new CardList()
            {
                Name = createContext.CardListName,
                BoardId = boardId.Value
            };

            // Calculate rank for new created cardList
            var cardLists = await _dbContext.CardLists
                .Where(cl => cl.BoardId == boardId)
                .OrderBy(cl => cl.Rank)
                .ToListAsync();

            var lexoRankGen = new LexoRankGenerator();

            if (cardLists.Count() == 0)
            {
                newCardList.Rank = lexoRankGen.GenerateInitialRank();
            }
            else
            {
                var lastCardList = cardLists.Last();
                var newRank = lexoRankGen.GenerateNewRank(lastCardList.Rank, null);
                newCardList.Rank = newRank;
            }

            _dbContext.CardLists.Add(newCardList);

            // Create new action
            var action = new DennoAction()
            {
                MemberCreatorId = createContext.MemberCreatorId,
                ActionType = ActionTypes.CreateCardList,
                BoardId = boardId,
                List = newCardList,
                IsBoardActivity = true,
                MetaData = JsonHelper.SerializeData(newCardList)
            };

            _dbContext.Actions.Add(action);

            return action;
        }
    }
}
