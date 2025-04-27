using System.Security.Cryptography;

namespace server.Helpers
{
    public static class SecretCodeGenerator
    {
        public static string GenerateHexCode(int byteLength = 16)
        {
            var randomBytes = new byte[byteLength];
            RandomNumberGenerator.Fill(randomBytes);

            return BitConverter.ToString(randomBytes).Replace("-", "");
        }
    }
}
