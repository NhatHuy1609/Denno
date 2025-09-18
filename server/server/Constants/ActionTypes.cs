namespace server.Constants
{
    public static class ActionTypes
    {
        public const string AddMemberToWorkspace = "addMemberToWorkspace";
        public const string JoinWorkspaceByLink = "joinWorkspaceByLink";
        public const string ApproveWorkspaceJoinRequest = "approveWorkspaceJoinRequest";
        public const string RejectWorkspaceJoinRequest = "rejectWorkspaceJoinRequest";
        public const string SendWorkspaceJoinRequest = "sendWorkspaceJoinRequest";
        public const string CreateBoard = "createBoard";
        public const string AddMemberToBoard = "addMemberToBoard";
        public const string JoinBoard = "joinBoard";
        public const string JoinBoardByLink = "joinBoardByLink";
        public const string SendBoardJoinRequest = "sendBoardJoinRequest";
        public const string ApproveBoardJoinRequest = "approveBoardJoinRequest";
        public const string RejectBoardJoinRequest = "rejectBoardJoinRequest";
        public const string UpdateBoardMemberRole = "updateBoardMemberRole";
        public const string RemoveBoardMember = "removeBoardMember";
        public const string UpdateWorkspaceMemberRole = "updateWorkspaceMemberRole";
        public const string RemoveWorkspaceMember = "removeWorkspaceMember";
        public const string RemoveWorkspaceGuest = "removeWorkspaceGuest";
        public const string CreateCardList = "createCardList";
        public const string CreateCard = "createCard";
        public const string AssignCardMember = "assignCardMember";
        public const string RemoveCardMember = "removeCardMember";
        public const string UpdateCardDates = "updateCardDates";
        public const string CompleteCard = "completeCard";
        public const string InCompleteCard = "IncompleteCard";
    }
}