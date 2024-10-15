using server.Enums;

namespace server.Dtos.Response
{
    public class ApiErrorResponse
    {
        public bool Success { get; set; } = false;
        public ApiStatusCode StatusCode { get; set; }
        public string StatusMessage { get; set; } = string.Empty;
    }
}
