namespace server.Helpers
{
    public static class SignalRGroupNames
    {
        public static string GetBoardGroupName(Guid boardId)
        {
            return $"board_{boardId}";
        }

        public static string GetWorkspaceGroupName(Guid workspaceId) 
        {
            return $"workspace_{workspaceId}";
        }
    }
}
