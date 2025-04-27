namespace server.Extensions
{
    public static class FieldParseExtensions
    {
        /// <summary>
        /// Parses a comma-separated field string into a set of fields.
        /// Returns an empty set if the input is null/whitespace.
        /// </summary>
        public static ISet<string> ParseFields(this string fields)
        {
            if (string.IsNullOrWhiteSpace(fields))
            {
                return new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            }

            return new HashSet<string>(
                fields.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries),
                StringComparer.OrdinalIgnoreCase
            );
        }
    }
}
