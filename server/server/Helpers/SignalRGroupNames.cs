namespace server.Helpers
{
    public static class SignalRGroupNames
    {
        public static string GetBoardGroupName(Guid boardId)
        {
            return $"board_{boardId}";
        }
    }
}
