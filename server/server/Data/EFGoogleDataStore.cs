using Google;
using Google.Apis.Util.Store;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using server.Models;

namespace server.Data
{
    public class EFGoogleDataStore : IDataStore
    {
        private readonly ApplicationDBContext _context;

        public EFGoogleDataStore(ApplicationDBContext context)
        {
            _context = context;
        }

        // Store token for a specific user using their unique key (User ID)
        public async Task StoreAsync<T>(string key, T value)
        {
            var jsonData = JsonConvert.SerializeObject(value);
            var existingCredential = await _context.GoogleAuthDataStores.FindAsync(key);

            if (existingCredential == null)
            {
                var credential = new GoogleAuthDataStore
                {
                    Id = key,  // Unique key (UserId)
                    UserId = key,
                    TokenValue = jsonData,
                    AccessTokenExpiry = DateTime.Now.AddHours(1)
                };

                _context.GoogleAuthDataStores.Add(credential);
            }
            else
            {
                existingCredential.TokenValue = jsonData;
                _context.GoogleAuthDataStores.Update(existingCredential);
            }

            await _context.SaveChangesAsync();
        }

        // Retrieve token using the unique key (User ID)
        public async Task<T> GetAsync<T>(string key)
        {
            var credential = await _context.GoogleAuthDataStores.FindAsync(key);
            if (credential != null)
            {
                return JsonConvert.DeserializeObject<T>(credential.TokenValue);
            }

            return default(T);
        }

        // Delete token for a specific user
        public async Task DeleteAsync<T>(string key)
        {
            var credential = await _context.GoogleAuthDataStores.FindAsync(key);
            if (credential != null)
            {
                _context.GoogleAuthDataStores.Remove(credential);
                await _context.SaveChangesAsync();
            }
        }

        public async Task ClearAsync()
        {
            _context.GoogleAuthDataStores.RemoveRange(_context.GoogleAuthDataStores);
            await _context.SaveChangesAsync();
        }
    }

}
