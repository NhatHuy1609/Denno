using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFieldOfNotificationTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NotificationRecipients_Notifications_NotificationId1",
                table: "NotificationRecipients");

            migrationBuilder.DropIndex(
                name: "IX_NotificationRecipients_NotificationId1",
                table: "NotificationRecipients");

            migrationBuilder.DropColumn(
                name: "NotificationId1",
                table: "NotificationRecipients");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NotificationId1",
                table: "NotificationRecipients",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_NotificationRecipients_NotificationId1",
                table: "NotificationRecipients",
                column: "NotificationId1");

            migrationBuilder.AddForeignKey(
                name: "FK_NotificationRecipients_Notifications_NotificationId1",
                table: "NotificationRecipients",
                column: "NotificationId1",
                principalTable: "Notifications",
                principalColumn: "Id");
        }
    }
}
