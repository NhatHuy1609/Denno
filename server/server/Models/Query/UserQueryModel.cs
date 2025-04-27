namespace server.Models.Query
{
    public class UserQueryModel
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public int? PageSize { get; set; } = 50;
        public int? PageNumber { get; set; } = 1;
    }
}
