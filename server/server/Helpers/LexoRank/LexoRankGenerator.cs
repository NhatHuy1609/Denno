namespace server.Helpers.LexoRank
{
    public class LexoRankGenerator
    {
        public string GenerateInitialRank()
        {
            return LexoRankConstants.START_POSITION;
        }

        public string GenerateNewRank(object? rankBefore, object? rankAfter)
        {
            LexoRankCore newRank = LexoRankCore.Between(rankBefore, rankAfter);

            return newRank.ToString();
        }
    }
}
