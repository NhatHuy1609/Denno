﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using server.Data;

#nullable disable

namespace server.Migrations
{
    [DbContext(typeof(ApplicationDBContext))]
    [Migration("20240823090837_AddTables1")]
    partial class AddTables1
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("server.Models.AppUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("Avatar")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("AvatarVisibility")
                        .HasColumnType("int");

                    b.Property<string>("BasedIn")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("BasedInVisibility")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CoverImage")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Department")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("DepartmentVisibility")
                        .HasColumnType("int");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<int>("EmailVisibility")
                        .HasColumnType("int");

                    b.Property<string>("FullName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("FullNameVisibility")
                        .HasColumnType("int");

                    b.Property<string>("JobTitle")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("JobTitleVisibility")
                        .HasColumnType("int");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("Organization")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("OrganizationVisibility")
                        .HasColumnType("int");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("server.Models.Board", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("StarredStatus")
                        .HasColumnType("bit");

                    b.Property<int>("Visibility")
                        .HasColumnType("int");

                    b.Property<Guid>("WorkspaceId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    SqlServerKeyBuilderExtensions.IsClustered(b.HasKey("Id"), false);

                    b.HasIndex("WorkspaceId");

                    b.ToTable("Boards");
                });

            modelBuilder.Entity("server.Models.BoardMember", b =>
                {
                    b.Property<Guid>("BoardId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("AppUserId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("BoardId", "AppUserId");

                    b.HasIndex("AppUserId");

                    b.ToTable("BoardMembers");
                });

            modelBuilder.Entity("server.Models.BoardRestriction", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("BoardId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Option")
                        .HasColumnType("int");

                    b.Property<int>("RestrictionId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("BoardId");

                    b.HasIndex("RestrictionId");

                    b.ToTable("BoardRestrictions");
                });

            modelBuilder.Entity("server.Models.Restriction", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ApplyTo")
                        .HasColumnType("int");

                    b.Property<int>("RestrictionType")
                        .HasColumnType("int");

                    b.Property<int>("Visibility")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Restrictions");
                });

            modelBuilder.Entity("server.Models.Workspace", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("OwnerId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("Visibility")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    SqlServerKeyBuilderExtensions.IsClustered(b.HasKey("Id"), false);

                    b.HasIndex("OwnerId");

                    b.ToTable("Workspaces");
                });

            modelBuilder.Entity("server.Models.WorkspaceMember", b =>
                {
                    b.Property<Guid>("WorkspaceId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("AppUserId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("WorkspaceId", "AppUserId");

                    b.HasIndex("AppUserId");

                    b.ToTable("WorkspaceMembers");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("server.Models.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("server.Models.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("server.Models.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("server.Models.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("server.Models.Board", b =>
                {
                    b.HasOne("server.Models.Workspace", "Workspace")
                        .WithMany("Boards")
                        .HasForeignKey("WorkspaceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Workspace");
                });

            modelBuilder.Entity("server.Models.BoardMember", b =>
                {
                    b.HasOne("server.Models.AppUser", "AppUser")
                        .WithMany("BoardMembers")
                        .HasForeignKey("AppUserId")
                        .OnDelete(DeleteBehavior.ClientCascade)
                        .IsRequired();

                    b.HasOne("server.Models.Board", "Board")
                        .WithMany("BoardMembers")
                        .HasForeignKey("BoardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AppUser");

                    b.Navigation("Board");
                });

            modelBuilder.Entity("server.Models.BoardRestriction", b =>
                {
                    b.HasOne("server.Models.Board", null)
                        .WithMany("BoardRestrictions")
                        .HasForeignKey("BoardId");

                    b.HasOne("server.Models.Restriction", "Restriction")
                        .WithMany("BoardRestrictions")
                        .HasForeignKey("RestrictionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Restriction");
                });

            modelBuilder.Entity("server.Models.Workspace", b =>
                {
                    b.HasOne("server.Models.AppUser", "Owner")
                        .WithMany("OwnedWorkspaces")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("server.Models.WorkspaceMember", b =>
                {
                    b.HasOne("server.Models.AppUser", "AppUser")
                        .WithMany("WorkspaceMembers")
                        .HasForeignKey("AppUserId")
                        .OnDelete(DeleteBehavior.ClientCascade)
                        .IsRequired();

                    b.HasOne("server.Models.Workspace", "Workspace")
                        .WithMany("WorkspaceMembers")
                        .HasForeignKey("WorkspaceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AppUser");

                    b.Navigation("Workspace");
                });

            modelBuilder.Entity("server.Models.AppUser", b =>
                {
                    b.Navigation("BoardMembers");

                    b.Navigation("OwnedWorkspaces");

                    b.Navigation("WorkspaceMembers");
                });

            modelBuilder.Entity("server.Models.Board", b =>
                {
                    b.Navigation("BoardMembers");

                    b.Navigation("BoardRestrictions");
                });

            modelBuilder.Entity("server.Models.Restriction", b =>
                {
                    b.Navigation("BoardRestrictions");
                });

            modelBuilder.Entity("server.Models.Workspace", b =>
                {
                    b.Navigation("Boards");

                    b.Navigation("WorkspaceMembers");
                });
#pragma warning restore 612, 618
        }
    }
}
