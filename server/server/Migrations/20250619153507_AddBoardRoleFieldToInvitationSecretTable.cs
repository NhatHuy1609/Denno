using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddBoardRoleFieldToInvitationSecretTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BoardRole",
                table: "InvitationSecrets",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Target",
                table: "InvitationSecrets",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BoardRole",
                table: "InvitationSecrets");

            migrationBuilder.DropColumn(
                name: "Target",
                table: "InvitationSecrets");
        }
    }
}
