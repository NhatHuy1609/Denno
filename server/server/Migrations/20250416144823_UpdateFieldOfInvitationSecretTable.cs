using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFieldOfInvitationSecretTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "InvitationSecrets");

            migrationBuilder.AddColumn<string>(
                name: "InviterId",
                table: "InvitationSecrets",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_InvitationSecrets_InviterId",
                table: "InvitationSecrets",
                column: "InviterId");

            migrationBuilder.AddForeignKey(
                name: "FK_InvitationSecrets_AspNetUsers_InviterId",
                table: "InvitationSecrets",
                column: "InviterId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InvitationSecrets_AspNetUsers_InviterId",
                table: "InvitationSecrets");

            migrationBuilder.DropIndex(
                name: "IX_InvitationSecrets_InviterId",
                table: "InvitationSecrets");

            migrationBuilder.DropColumn(
                name: "InviterId",
                table: "InvitationSecrets");

            migrationBuilder.AddColumn<string>(
                name: "CreatedByUserId",
                table: "InvitationSecrets",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
