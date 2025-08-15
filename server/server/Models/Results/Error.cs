namespace server.Models.Results
{
    public sealed record Error (string Code, string Description)
    {
        public static readonly Error None = new(string.Empty, string.Empty);
        public static Error FromDescription(string description) => new(string.Empty, description);
    }
}
