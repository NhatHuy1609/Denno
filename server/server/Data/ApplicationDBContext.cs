using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using server.Models;

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
        public DbSet<CardActivity> CardActivites { get; set; }
        public DbSet<GoogleAuthDataStore> GoogleAuthDataStores { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>()
                .HasMany(e => e.OwnedWorkspaces)
                .WithOne(e => e.Owner)
                .HasForeignKey(e => e.OwnerId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            modelBuilder.Entity<Workspace>()
                .HasKey(e => e.Id)
                .IsClustered(false);

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

            modelBuilder.Entity<CardActivity>()
                .HasKey(e => e.Id)
                .IsClustered(false);

            modelBuilder.Entity<CardActivity>()
                .HasOne(e => e.AppUser)
                .WithMany(e => e.CardActivities)
                .HasForeignKey(e => e.AppUserId)
                .OnDelete(DeleteBehavior.ClientCascade);
        }
    }
}
