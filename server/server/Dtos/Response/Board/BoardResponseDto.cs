using server.Dtos.Response.Card;
using server.Enums;

namespace server.Dtos.Response.Board;

public class BoardResponseDto
{
    public Guid Id { get; set; }
    public Guid WorkspaceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public BoardVisibility Visibility { get; set; }
    public bool StarredStatus { get; set; } = false;
    public string Background { get; set; } = string.Empty;
}