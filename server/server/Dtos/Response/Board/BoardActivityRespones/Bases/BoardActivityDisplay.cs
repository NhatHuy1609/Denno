namespace server.Dtos.Response.Board.BoardActivityRespones.Bases
{
    public class BoardActivityDisplay
    {
        public Dictionary<string, EntityTypeDisplay> Entities { get; set; }
    }

    public class EntityTypeDisplay
    {
        public object Id { get; set; } // string or Guid type
        public string Type { get; set; } // EntityType constants
        public string Text { get; set; } // Entity's name
    }
}
