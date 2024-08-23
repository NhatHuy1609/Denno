using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTableBoardRestriction1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BoardRestrictions_Boards_BoardId",
                table: "BoardRestrictions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BoardRestrictions",
                table: "BoardRestrictions");

            migrationBuilder.DropIndex(
                name: "IX_BoardRestrictions_BoardId",
                table: "BoardRestrictions");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "BoardRestrictions");

            migrationBuilder.AlterColumn<Guid>(
                name: "BoardId",
                table: "BoardRestrictions",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_BoardRestrictions",
                table: "BoardRestrictions",
                columns: new[] { "BoardId", "RestrictionId" });

            migrationBuilder.AddForeignKey(
                name: "FK_BoardRestrictions_Boards_BoardId",
                table: "BoardRestrictions",
                column: "BoardId",
                principalTable: "Boards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BoardRestrictions_Boards_BoardId",
                table: "BoardRestrictions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BoardRestrictions",
                table: "BoardRestrictions");

            migrationBuilder.AlterColumn<Guid>(
                name: "BoardId",
                table: "BoardRestrictions",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "BoardRestrictions",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_BoardRestrictions",
                table: "BoardRestrictions",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_BoardRestrictions_BoardId",
                table: "BoardRestrictions",
                column: "BoardId");

            migrationBuilder.AddForeignKey(
                name: "FK_BoardRestrictions_Boards_BoardId",
                table: "BoardRestrictions",
                column: "BoardId",
                principalTable: "Boards",
                principalColumn: "Id");
        }
    }
}
