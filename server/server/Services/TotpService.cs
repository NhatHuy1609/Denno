﻿using System.Diagnostics;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace server.Services
{
    internal sealed class SecurityToken
    {
        private readonly byte[] _data;

        public SecurityToken(byte[] data)
        {
            _data = (byte[])data.Clone();
        }

        internal byte[] GetDataNoClone()
        {
            return _data;
        }
    }

    internal static class TotpService
    {
        private static readonly DateTime _unixEpoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        private static readonly TimeSpan _timestep = TimeSpan.FromMinutes(1);
        private static readonly Encoding _encoding = new UTF8Encoding(false, true);
        private static readonly int _totpExpiration = 3; // 3 minutes

        private static int ComputeTotp(HashAlgorithm hashAlgorithm, ulong timestepNumber, string modifier, int numberOfDigits = 6)
        {
            // # of 0's = length of pin
            //const int mod = 1000000;
            var mod = (int)Math.Pow(10, numberOfDigits);

            // See https://tools.ietf.org/html/rfc4226
            // We can add an optional modifier
            var timestepAsBytes = BitConverter.GetBytes(IPAddress.HostToNetworkOrder((long)timestepNumber));
            var hash = hashAlgorithm.ComputeHash(ApplyModifier(timestepAsBytes, modifier));

            // Generate DT string
            var offset = hash[hash.Length - 1] & 0xf;
            Debug.Assert(offset + 4 < hash.Length);
            var binaryCode = (hash[offset] & 0x7f) << 24
                             | (hash[offset + 1] & 0xff) << 16
                             | (hash[offset + 2] & 0xff) << 8
                             | (hash[offset + 3] & 0xff);

            var code = binaryCode % mod;
            return code;
        }

        private static byte[] ApplyModifier(byte[] input, string modifier)
        {
            if (String.IsNullOrEmpty(modifier))
            {
                return input;
            }

            var modifierBytes = _encoding.GetBytes(modifier);
            var combined = new byte[checked(input.Length + modifierBytes.Length)];
            Buffer.BlockCopy(input, 0, combined, 0, input.Length);
            Buffer.BlockCopy(modifierBytes, 0, combined, input.Length, modifierBytes.Length);
            return combined;
        }

        private static ulong GetNextTimeStepNumber(int seconds)
        {
#if NETSTANDARD2_0
            var delta = DateTime.UtcNow.AddSeconds(seconds) - _unixEpoch;
#else
            var delta = DateTimeOffset.UtcNow.AddSeconds(seconds) - DateTimeOffset.UnixEpoch;
#endif
            return (ulong)(delta.Ticks / _timestep.Ticks);
        }

        // More info: https://tools.ietf.org/html/rfc6238#section-4
        private static ulong GetCurrentTimeStepNumber()
        {
#if NETSTANDARD2_0
            var delta = DateTime.UtcNow - _unixEpoch;
#else
            var delta = DateTimeOffset.UtcNow - DateTimeOffset.UnixEpoch;
#endif
            return (ulong)(delta.Ticks / _timestep.Ticks);
        }

        public static int GenerateCode(SecurityToken securityToken, string modifier = null, int numberOfDigits = 6)
        {

            if (securityToken == null)
            {
                throw new ArgumentNullException("securityToken");
            }

            // Allow a variance of no greater than 90 seconds in either direction
            var currentTimeStep = GetCurrentTimeStepNumber();
            using (var hashAlgorithm = new HMACSHA1(securityToken.GetDataNoClone()))
            {
                var code = ComputeTotp(hashAlgorithm, currentTimeStep, modifier, numberOfDigits);
                return code;
            }
        }

        public static bool ValidateCode(SecurityToken securityToken, int code, string modifier = null, int numberOfDigits = 6)
        {
            if (securityToken == null)
            {
                throw new ArgumentNullException("securityToken");
            }

            // Allow a variance of no greater than 90 seconds in either direction
            using (var hashAlgorithm = new HMACSHA1(securityToken.GetDataNoClone()))
            {
                for (int i = -Math.Abs(_totpExpiration * 60); i <= 1; i++)
                {
                    var currentTimeStep = GetNextTimeStepNumber(i);

                    var computedTotp = ComputeTotp(hashAlgorithm, (ulong)((long)currentTimeStep), modifier, numberOfDigits);

                    if (computedTotp == code)
                    {
                        return true;
                    }
                }
            }

            // No match
            return false;
        }
    }
}
