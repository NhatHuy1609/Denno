using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddUserVisibilitySettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvatarVisibility",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "BasedInVisibility",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "DepartmentVisibility",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "EmailVisibility",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "FullNameVisibility",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "JobTitleVisibility",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "OrganizationVisibility",
                table: "AspNetUsers");

            migrationBuilder.CreateTable(
                name: "UserVisibilitySettings",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FullNameVisibility = table.Column<int>(type: "int", nullable: false),
                    JobTitleVisibility = table.Column<int>(type: "int", nullable: false),
                    DepartmentVisibility = table.Column<int>(type: "int", nullable: false),
                    OrganizationVisibility = table.Column<int>(type: "int", nullable: false),
                    BasedInVisibility = table.Column<int>(type: "int", nullable: false),
                    EmailVisibility = table.Column<int>(type: "int", nullable: false),
                    AvatarVisibility = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserVisibilitySettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserVisibilitySettings_AspNetUsers_Id",
                        column: x => x.Id,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserVisibilitySettings");

            migrationBuilder.AddColumn<int>(
                name: "AvatarVisibility",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "BasedInVisibility",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DepartmentVisibility",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EmailVisibility",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FullNameVisibility",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "JobTitleVisibility",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OrganizationVisibility",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
