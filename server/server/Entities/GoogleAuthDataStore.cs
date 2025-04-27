namespace server.Entities
{
    public class GoogleAuthDataStore
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string TokenValue { get; set; }
        public DateTime? AccessTokenExpiry { get; set; }
    }
}
