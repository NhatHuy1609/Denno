namespace server.Infrastructure.Providers
{
    public class JwtTokenProvider
    {
        public static readonly int RefreshTokenExpiration = 7; // 7 days
        public static readonly int AccessTokenExpiration = 3; // 3 days
    }
}
