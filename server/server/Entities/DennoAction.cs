using server.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class DennoAction
    {
        [Key]
        public Guid Id { get; set; }
        public string ActionType { get; set; }
        public DateTime Date { get; set; }

        public string? MemberCreatorId { get; set; }
        public AppUser? MemberCreator { get; set; }

        public Guid? CardId { get; set; }
        public Card? Card { get; set; }

        public Guid? BoardId { get; set; }
        public Board? Board { get; set; }

        public Guid? ListId { get; set; }
        public CardList? List { get; set; }

        public Guid? WorkspaceId { get; set; }
        public Workspace? Workspace { get; set; }

        public string? TargetUserId { get; set; }
        public AppUser? TargetUser { get; set; }

        public Guid? TargetCardId { get; set; }
        public virtual Card? TargetCard { get; set; }

        public Guid? TargetBoardId { get; set; }
        public virtual Board? TargetBoard { get; set; }

        public Guid? TargetListId { get; set; }
        public virtual CardList? TargetList { get; set; }

        public Guid? CommentId { get; set; }
        public CardComment? Comment { get; set; }
    }
}
