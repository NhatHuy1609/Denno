using Google.Apis.Auth.OAuth2;
using Google.Apis.Oauth2.v2;
using Google.Apis.Oauth2.v2.Data;
using Google.Apis.Services;
using server.Dtos.Response.Auth;

namespace server.Interfaces
{
    public interface IGoogleService
    {
        Task<GoogleSignInReponseDto> GetTokenAsync(string authorizationCode);
        Task<Userinfo> GetUserInfoAsync(string accessToken);
        string GetAuthorizationUrl();
    }
}
