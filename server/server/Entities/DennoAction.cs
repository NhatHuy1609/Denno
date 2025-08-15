using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace server.Entities
{
    public class DennoAction
    {
        [Key]
        public Guid Id { get; set; }
        public string ActionType { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public bool IsBoardActivity { get; set; } = false;
        public string? MetaData { get; set; } // metadata json

        public string? MemberCreatorId { get; set; }
        [JsonIgnore]
        public AppUser? MemberCreator { get; set; }

        public Guid? CardId { get; set; }
        [JsonIgnore]
        public Card? Card { get; set; }

        public Guid? BoardId { get; set; }
        [JsonIgnore]
        public Board? Board { get; set; }

        public Guid? ListId { get; set; }
        [JsonIgnore]
        public CardList? List { get; set; }

        public Guid? WorkspaceId { get; set; }
        [JsonIgnore]
        public Workspace? Workspace { get; set; }

        public string? TargetUserId { get; set; }
        [JsonIgnore]
        public AppUser? TargetUser { get; set; }

        public Guid? TargetCardId { get; set; }
        [JsonIgnore]
        public Card? TargetCard { get; set; }

        public Guid? TargetBoardId { get; set; }
        [JsonIgnore]
        public Board? TargetBoard { get; set; }

        public Guid? TargetListId { get; set; }
        [JsonIgnore]
        public CardList? TargetList { get; set; }

        public Guid? CommentId { get; set; }
        [JsonIgnore]
        public CardComment? Comment { get; set; }
    }
}
