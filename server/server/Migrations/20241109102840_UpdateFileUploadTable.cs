using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFileUploadTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Workspaces_FileUploads_LogoId",
                table: "Workspaces");

            migrationBuilder.DropIndex(
                name: "IX_Workspaces_LogoId",
                table: "Workspaces");

            migrationBuilder.AddColumn<Guid>(
                name: "WorkspaceId",
                table: "FileUploads",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_FileUploads_WorkspaceId",
                table: "FileUploads",
                column: "WorkspaceId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_FileUploads_Workspaces_WorkspaceId",
                table: "FileUploads",
                column: "WorkspaceId",
                principalTable: "Workspaces",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileUploads_Workspaces_WorkspaceId",
                table: "FileUploads");

            migrationBuilder.DropIndex(
                name: "IX_FileUploads_WorkspaceId",
                table: "FileUploads");

            migrationBuilder.DropColumn(
                name: "WorkspaceId",
                table: "FileUploads");

            migrationBuilder.CreateIndex(
                name: "IX_Workspaces_LogoId",
                table: "Workspaces",
                column: "LogoId",
                unique: true,
                filter: "[LogoId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Workspaces_FileUploads_LogoId",
                table: "Workspaces",
                column: "LogoId",
                principalTable: "FileUploads",
                principalColumn: "Id");
        }
    }
}
