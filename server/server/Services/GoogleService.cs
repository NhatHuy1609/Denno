using Google.Apis.Auth.OAuth2;
using Google.Apis.Oauth2.v2.Data;
using Google.Apis.Oauth2.v2;
using Google.Apis.Services;
using server.Interfaces;
using server.Dtos.Response.Auth;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.WebUtilities;
using server.Infrastructure.Configurations;

namespace server.Services
{
    public class GoogleService : IGoogleService
    {
        private readonly HttpClient _httpClient;
        private readonly GoogleAuthConfiguration _googleAuthConfig;

        public GoogleService(HttpClient httpClient, IOptions<GoogleAuthConfiguration> googleAuthConfig)
        {
            _httpClient = httpClient;
            _googleAuthConfig = googleAuthConfig.Value;
        }

        public async Task<Userinfo> GetUserInfoAsync(string accessToken)
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            var response = await _httpClient.GetAsync(_googleAuthConfig.UserInfoUrl);
            response.EnsureSuccessStatusCode();

            var userInfoJson = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<Userinfo>(userInfoJson);
        }

        public async Task<GoogleSignInReponseDto> GetTokenAsync(string authorizationCode)
        {
            var tokenRequest = new Dictionary<string, string>()
            {
                { "client_id", _googleAuthConfig.ClientId },
                { "client_secret", _googleAuthConfig.ClientSecret },
                { "code", authorizationCode },
                { "grant_type", "authorization_code" },
                { "redirect_uri", _googleAuthConfig.RedirectUri },
                { "access_type", "online"}
            };

            using var content = new FormUrlEncodedContent(tokenRequest);
            var response = await _httpClient.PostAsync(_googleAuthConfig.TokenUrl, content);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<GoogleSignInReponseDto>(responseJson);
        }

        public string GetAuthorizationUrl()
        {
            var queryParams = new Dictionary<string, string?>
                {
                    { "access_type", "offline" },
                    { "client_id", _googleAuthConfig.ClientId },
                    { "redirect_uri", _googleAuthConfig.RedirectUri },
                    { "response_type", "code" },
                    { "scope", "email profile" },
                    { "prompt", "consent" }
                };

            var redirectUrl = new Uri(QueryHelpers.AddQueryString(_googleAuthConfig.AuthUrl, queryParams));

            return redirectUrl.ToString();
        }
    }
}
