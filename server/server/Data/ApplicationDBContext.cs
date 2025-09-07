using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Workspace> Workspaces { get; set; }
        public DbSet<WorkspaceMember> WorkspaceMembers { get; set; }
        public DbSet<Board> Boards { get; set; }
        public DbSet<BoardMember> BoardMembers { get; set; }
        public DbSet<Restriction> Restrictions { get; set; }
        public DbSet<BoardRestriction> BoardRestrictions { get; set; }
        public DbSet<CardList> CardLists { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<CardMember> CardMembers { get; set; }
        public DbSet<BoardLabel> BoardLabels { get; set; }
        public DbSet<CardLabel> CardLabels { get; set; }
        public DbSet<CardCheckList> CardCheckLists { get; set; }
        public DbSet<CardCheckListItem> CardCheckListItems { get; set; }
        public DbSet<CardAttachment> CardAttachments { get; set; }
        public DbSet<CardComment> CardComments { get; set; }
        public DbSet<GoogleAuthDataStore> GoogleAuthDataStores { get; set; }
        public DbSet<FileUpload> FileUploads { get; set; }
        public DbSet<DennoAction> Actions { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<NotificationRecipient> NotificationRecipients { get; set; }
        public DbSet<InvitationSecret> InvitationSecrets { get; set; }
        public DbSet<JoinRequest> JoinRequests { get; set; }
        public DbSet<BoardUserSettings> BoardUserSettings { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            DateTimeUtcConvention.Apply(modelBuilder);

            modelBuilder.Entity<AppUser>()
                .HasMany(e => e.OwnedWorkspaces)
                .WithOne(e => e.Owner)
                .HasForeignKey(e => e.OwnerId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            modelBuilder.Entity<AppUser>()
                .HasOne(u => u.UserVisibilitySettings)
                .WithOne()
                .HasForeignKey<UserVisibilitySettings>(v => v.Id);

            modelBuilder.Entity<Workspace>()
                .HasKey(e => e.Id)
                .IsClustered(false);

            modelBuilder.Entity<Workspace>()
                .HasOne(w => w.Logo)
                .WithOne(l => l.Workspace)
                .HasForeignKey<FileUpload>(l => l.WorkspaceId);

            modelBuilder.Entity<WorkspaceMember>()
                .HasKey(e => new { e.WorkspaceId, e.AppUserId });

            modelBuilder.Entity<WorkspaceMember>()
                .HasOne(e => e.Workspace)
                .WithMany(e => e.WorkspaceMembers)
                .HasForeignKey(e => e.WorkspaceId);

            modelBuilder.Entity<WorkspaceMember>()
                .HasOne(e => e.AppUser)
                .WithMany(e => e.WorkspaceMembers)
                .HasForeignKey(e => e.AppUserId)
                .OnDelete(DeleteBehavior.ClientCascade);

            modelBuilder.Entity<Board>()
                .HasKey(e => e.Id)
                .IsClustered(false);

            modelBuilder.Entity<BoardMember>()
                .HasKey(e => new { e.BoardId, e.AppUserId });

            modelBuilder.Entity<BoardMember>()
                .HasOne(e => e.Board)
                .WithMany(e => e.BoardMembers)
                .HasForeignKey(e => e.BoardId);

            modelBuilder.Entity<BoardMember>()
                .HasOne(e => e.AppUser)
                .WithMany(e => e.BoardMembers)
                .HasForeignKey(e => e.AppUserId)
                .OnDelete(DeleteBehavior.ClientCascade);

            modelBuilder.Entity<BoardRestriction>()
                .HasKey(e => new { e.BoardId, e.RestrictionId });

            modelBuilder.Entity<Card>()
                .HasKey(e => e.Id)
                .IsClustered(false);

            modelBuilder.Entity<Card>()
                .Property(e => e.Description)
                .HasColumnType("text");

            modelBuilder.Entity<CardMember>()
                .HasKey(e => new { e.AppUserId, e.CardId });

            modelBuilder.Entity<CardMember>()
                .HasOne(e => e.Card)
                .WithMany(e => e.CardMembers)
                .HasForeignKey(e => e.CardId);

            modelBuilder.Entity<CardMember>()
                .HasOne(e => e.AppUser)
                .WithMany(e => e.CardMembers)
                .HasForeignKey(e => e.AppUserId)
                .OnDelete(DeleteBehavior.ClientCascade);

            modelBuilder.Entity<CardLabel>()
                .HasKey(e => new { e.BoardLabelId, e.CardId });

            modelBuilder.Entity<CardLabel>()
                .HasOne(e => e.Card)
                .WithMany(e => e.CardLabels)
                .HasForeignKey(e => e.CardId)
                .OnDelete(DeleteBehavior.ClientCascade);

            modelBuilder.Entity<BoardLabel>()
                .HasKey(e => e.Id)
                .IsClustered(false);

            modelBuilder.Entity<CardCheckList>()
                .HasKey(e => e.Id)
                .IsClustered(false);

            modelBuilder.Entity<CardCheckListItem>()
                .HasKey(e => e.Id)
                .IsClustered(false);

            modelBuilder.Entity<CardCheckListItem>()
                .HasOne(e => e.Asignee)
                .WithMany(e => e.CardCheckListItems)
                .HasForeignKey(e => e.AsigneeId)
                .OnDelete(DeleteBehavior.ClientCascade);

            modelBuilder.Entity<CardAttachment>()
                .HasKey(e => e.Id)
                .IsClustered(false);

            modelBuilder.Entity<CardAttachment>()
                .Property(e => e.FileLink)
                .HasColumnType("text");

            modelBuilder.Entity<CardComment>()
                .HasKey(e => e.Id)
                .IsClustered(false);

            modelBuilder.Entity<CardComment>()
                .Property(e => e.Comment)
                .HasColumnType("text");

            modelBuilder.Entity<CardComment>()
                .HasOne(e => e.AppUser)
                .WithMany(e => e.CardComments)
                .HasForeignKey(e => e.AppUserId)
                .OnDelete(DeleteBehavior.ClientCascade);

            // Configure DennoAction's RelationShips

            modelBuilder.Entity<DennoAction>()
               .HasOne(d => d.MemberCreator)
               .WithMany(m => m.Actions)
               .HasForeignKey(d => d.MemberCreatorId)
               .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<DennoAction>()
                .HasOne(d => d.Card)
                .WithMany(c => c.Actions)
                .HasForeignKey(d => d.CardId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<DennoAction>()
                .HasOne(d => d.Board)
                .WithMany(b => b.Actions)
                .HasForeignKey(d => d.BoardId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<DennoAction>()
                .HasOne(d => d.List)
                .WithMany()
                .HasForeignKey(d => d.ListId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<DennoAction>()
                .HasOne(d => d.Workspace)
                .WithMany(w => w.Actions)
                .HasForeignKey(d => d.WorkspaceId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<DennoAction>()
                .HasOne(d => d.TargetUser)
                .WithMany()
                .HasForeignKey(d => d.TargetUserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<DennoAction>()
                .HasOne(d => d.TargetCard)
                .WithMany()
                .HasForeignKey(d => d.TargetCardId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<DennoAction>()
                .HasOne(d => d.TargetBoard)
                .WithMany()
                .HasForeignKey(d => d.TargetBoardId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<DennoAction>()
                .HasOne(d => d.TargetList)
                .WithMany()
                .HasForeignKey(d => d.TargetListId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<DennoAction>()
                .HasOne(d => d.Comment)
                .WithMany()
                .HasForeignKey(d => d.CommentId)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure Notification's RelationShips
            modelBuilder.Entity<NotificationRecipient>()
                .HasKey(nr => new { nr.RecipientId, nr.NotificationId });

            modelBuilder.Entity<NotificationRecipient>()
                .HasOne(n => n.Recipient)
                .WithMany(r => r.NotificationRecipients)
                .HasForeignKey(n => n.RecipientId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<NotificationRecipient>()
                .HasOne(n => n.Notification)
                .WithMany(n => n.NotificationRecipients)
                .HasForeignKey(n => n.NotificationId)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure JoinRequest's Relationships
            modelBuilder.Entity<JoinRequest>()
                .HasOne(j => j.Workspace)
                .WithMany(w => w.JoinRequests)
                .HasForeignKey(j => j.WorkspaceId)
                .OnDelete(DeleteBehavior.ClientCascade);

            modelBuilder.Entity<JoinRequest>()
                .HasOne(j => j.Board)
                .WithMany(b => b.JoinRequests)
                .HasForeignKey(j => j.BoardId)
                .OnDelete(DeleteBehavior.ClientCascade);

            // Configure BoardUserSettings table
            modelBuilder.Entity<BoardUserSettings>(entity =>
            {
                entity.HasKey(b => new { b.UserId, b.BoardId });

                entity.HasOne(b => b.User)
                    .WithMany(u => u.BoardUserSettings)
                    .HasForeignKey(b => b.UserId)
                    .OnDelete(DeleteBehavior.ClientCascade);

                entity.HasOne(b => b.Board)
                    .WithMany(b => b.BoardUserSettings)
                    .HasForeignKey(b => b.BoardId)
                    .OnDelete(DeleteBehavior.ClientCascade);

                entity.HasIndex(b => new { b.UserId, b.BoardId })
                    .IsUnique();
            });
        }
    }
}
