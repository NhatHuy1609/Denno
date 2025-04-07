using server.Enums;

namespace server.Dtos.Response.Workspace.WorkspaceResponseDto2
{
    public class WorkspaceResponseDto2
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string IdOwner { get; set; }
        public string? Logo { get; set; }
        public WorkspaceVisibility Visibility { get; set; }

        public List<BoardCountDto> BoardCounts { get; set; } = new List<BoardCountDto>();
        public List<MemberDto> Members { get; set; } = new List<MemberDto>();
    }

    public class BoardCountDto
    {
        public string IdMember { get; set; }
        public int BoardCount { get; set; }
    }

    public class MemberDto
    {
        public string Id { get; set; }
        public string Avatar { get; set; }
        public string FullName { get; set; }
        public MemberRole MemberType { get; set; }
    }
}
