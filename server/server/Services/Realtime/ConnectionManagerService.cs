using System.Collections.Concurrent;

namespace server.Services.Realtime
{
    public interface IConnectionManager
    {
        Task AddConnectionAsync(string userId, string connectionId);
        Task RemoveConnectionAsync(string connectionId);
        Task<List<string>> GetUserConnectionsAsync(string userId);
        Task<string> GetUserByConnectionAsync(string connectionId);
        Task<bool> IsUserOnlineAsync(string userId);
        Task<List<string>> GetOnlineUsersAsync();
    }

    public class ConnectionManagerService : IConnectionManager
    {
        // userId -> HashSet của connectionIds
        private readonly ConcurrentDictionary<string, HashSet<string>> _userConnections = new();

        // connectionId -> userId (để reverse lookup)
        private readonly ConcurrentDictionary<string, string> _connectionUsers = new();

        private readonly ILogger<ConnectionManagerService> _logger;

        public ConnectionManagerService(ILogger<ConnectionManagerService> logger)
        {
            _logger = logger;
        }

        public Task AddConnectionAsync(string userId, string connectionId)
        {
            try
            {
                // Thêm connection vào user's connection list
                _userConnections.AddOrUpdate(userId,
                    new HashSet<string> { connectionId },
                    (key, existingConnections) =>
                    {
                        lock (existingConnections)
                        {
                            existingConnections.Add(connectionId);
                            return existingConnections;
                        }
                    });

                // Map ngược: connectionId -> userId
                _connectionUsers.TryAdd(connectionId, userId);

                _logger.LogInformation("Added connection {ConnectionId} for user {UserId}. Total connections: {Count}",
                    connectionId, userId, _userConnections[userId].Count);

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding connection {ConnectionId} for user {UserId}", connectionId, userId);
                throw;
            }
        }

        public Task RemoveConnectionAsync(string connectionId)
        {
            try
            {
                // Tìm userId từ connectionId
                if (!_connectionUsers.TryRemove(connectionId, out var userId))
                {
                    _logger.LogWarning("Connection {ConnectionId} not found for removal", connectionId);
                    return Task.CompletedTask;
                }

                // Remove connection từ user's connection list
                if (_userConnections.TryGetValue(userId, out var connections))
                {
                    lock (connections)
                    {
                        connections.Remove(connectionId);

                        // Nếu user không còn connection nào, remove user khỏi dictionary
                        if (connections.Count == 0)
                        {
                            _userConnections.TryRemove(userId, out _);
                            _logger.LogInformation("User {UserId} is now offline (no connections)", userId);
                        }
                        else
                        {
                            _logger.LogInformation("Removed connection {ConnectionId} for user {UserId}. Remaining connections: {Count}",
                                connectionId, userId, connections.Count);
                        }
                    }
                }

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing connection {ConnectionId}", connectionId);
                throw;
            }
        }

        public Task<List<string>> GetUserConnectionsAsync(string userId)
        {
            if (_userConnections.TryGetValue(userId, out var connections))
            {
                lock (connections)
                {
                    return Task.FromResult(connections.ToList());
                }
            }

            return Task.FromResult(new List<string>());
        }

        public Task<string> GetUserByConnectionAsync(string connectionId)
        {
            _connectionUsers.TryGetValue(connectionId, out var userId);
            return Task.FromResult(userId);
        }

        public Task<bool> IsUserOnlineAsync(string userId)
        {
            var isOnline = _userConnections.ContainsKey(userId) && _userConnections[userId].Count > 0;
            return Task.FromResult(isOnline);
        }

        public Task<List<string>> GetOnlineUsersAsync()
        {
            var onlineUsers = _userConnections.Keys.ToList();
            return Task.FromResult(onlineUsers);
        }

        // Debug methods
        public int GetTotalConnections() => _connectionUsers.Count;
        public int GetOnlineUserCount() => _userConnections.Count;
    }
}
