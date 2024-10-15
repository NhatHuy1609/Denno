namespace server.Infrastructure.Configurations
{
    public class GoogleAuthConfiguration
    {
        public string ApiKey { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string RedirectUri { get; set; }
        public string AuthUrl { get; set; }
        public string TokenUrl { get; set; }
        public string UserInfoUrl { get; set; }
    }
}
