using server.Enums;

namespace server.Dtos.Requests.Board;

public class CreateBoardRequestDto
{
    public Guid WorkspaceId { get; set; }
    public string Background { get; set; }
    public string Name { get; set; }
    public bool StarredStatus { get; set; } = false;
    public BoardVisibility Visibility { get; set; }
}