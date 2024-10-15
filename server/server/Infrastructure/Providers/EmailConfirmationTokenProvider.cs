using Microsoft.AspNetCore.Identity;
using server.Services;
using System.Globalization;

namespace server.Infrastructure.Providers
{
    public class EmailConfirmationTokenProvider<TUser> : TotpSecurityStampBasedTokenProvider<TUser> where TUser : class
    {
        public override Task<bool> CanGenerateTwoFactorTokenAsync(UserManager<TUser> manager, TUser user)
        {
            return Task.FromResult(true);
        }

        public override async Task<string> GenerateAsync(string purpose, UserManager<TUser> manager, TUser user)
        {
            var token = new SecurityToken(await manager.CreateSecurityTokenAsync(user));
            var modifier = await GetUserModifierAsync(purpose, manager, user);
            var code = TotpService.GenerateCode(token, modifier, 4).ToString("D4", CultureInfo.InvariantCulture);

            return code;
        }

        public override async Task<bool> ValidateAsync(string purpose, string token, UserManager<TUser> manager, TUser user)
        {
            int code;
            if (!Int32.TryParse(token, out code))
            {
                return false;
            }

            var securityToken = new SecurityToken(await manager.CreateSecurityTokenAsync(user));
            var modifier = await GetUserModifierAsync(purpose, manager, user);
            var valid = TotpService.ValidateCode(securityToken, code, modifier, token.Length);

            return valid;
        }

        public override Task<string> GetUserModifierAsync(string purpose, UserManager<TUser> manager, TUser user)
        {
            return base.GetUserModifierAsync(purpose, manager, user);
        }
    }
}
