using server.Constants;

namespace server.Dtos.Response.Notification
{
    public class AddedToWorkspaceNotificationResponseDto : NotificationResponseDto
    {
        public AddedToWorkspaceNotificationResponseDto()
        {
            Type = ActionTypes.AddMemberToWorkspace;
        }

        public required NotificationData Data { get; set; }
        public required NotificationDisplay Display { get; set; }
    }

    public class NotificationData
    {
        public Workspace Workspace { get; set; }
        public string AddedMemberId { get; set; }
        public string MemberCreatorId { get; set; }
    }

    public class Workspace
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }

    public class NotificationDisplay
    {
        public string TranslationKey { get; set; }
        public Dictionary<string, EntityType> Entities { get; set; }
    }

    public class EntityType
    {
        public object Id { get; set; } // string or Guid type
        public string Type { get; set; }
        public string Text { get; set; }
    }
}
