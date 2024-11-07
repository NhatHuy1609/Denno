using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using server.Data.Enums;
using server.Entities;

namespace server.Dtos.Response.Users
{
    public class GetUserResponseDto
    {
        public string? Id { get; set; }
        public string Email { get; set; }
        public string Avatar { get; set; }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string JobTitle { get; set; }
        public string Department { get; set; }
        public string BasedIn { get; set; }
        public string Organization { get; set; }
        public string CoverImage { get; set; }

        public UserVisibilitySettings UserVisibilitySettings { get; set; }
    }
}
