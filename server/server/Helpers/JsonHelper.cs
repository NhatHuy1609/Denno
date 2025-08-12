using Newtonsoft.Json;

namespace server.Helpers
{
    public static class JsonHelper
    {
        public static T? DeserializeData<T>(string? jsonData)
        {
            if (string.IsNullOrEmpty(jsonData))
            {
                throw new ArgumentException("Action data is empty");
            }

            try
            {
                return JsonConvert.DeserializeObject<T>(jsonData);
            } catch (JsonException ex)
            {
                throw new InvalidOperationException("Failed to deserialize action data", ex);
            }
        }

        public static string SerializeData<T>(T data)
        {
            if (data == null)
            {
                throw new ArgumentNullException(nameof(data), "Data to serialize cannot be null");
            }

            try
            {
                return JsonConvert.SerializeObject(data);
            } catch (JsonException ex)
            {
                throw new InvalidOperationException("Failed to serialize action data", ex);
            }
        }
    }
}
