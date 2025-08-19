using System.Collections.Concurrent;

namespace server.Services.Realtime
{
    public enum HubType
    {
        Notification,
        Workspace,
        Board
    }

    public record HubConnectionInfo(HubType Hub, string ConnectionId);

    public interface IConnectionManager
    {
        Task AddConnectionAsync(string userId, HubType hub, string connectionId);
        Task RemoveConnectionAsync(string connectionId);
        Task<List<HubConnectionInfo>> GetUserConnectionsAsync(string userId);
        Task<List<HubConnectionInfo>> GetUserConnectionsByHubAsync(string userId, HubType hub);
        Task<string?> GetUserByConnectionAsync(string connectionId);
        Task<bool> IsUserOnlineAsync(string userId);
        Task<List<string>> GetOnlineUsersAsync();

        // Debug
        int GetTotalConnections();
        int GetOnlineUserCount();
    }

    public class ConnectionManagerService : IConnectionManager
    {
        // userId -> HashSet<HubConnectionInfo>
        private readonly ConcurrentDictionary<string, HashSet<HubConnectionInfo>> _userConnections = new();

        // connectionId -> userId (reverse lookup)
        private readonly ConcurrentDictionary<string, string> _connectionUsers = new();

        private readonly ILogger<ConnectionManagerService> _logger;

        public ConnectionManagerService(ILogger<ConnectionManagerService> logger)
        {
            _logger = logger;
        }

        public Task AddConnectionAsync(string userId, HubType hub, string connectionId)
        {
            try
            {
                var connectionInfo = new HubConnectionInfo(hub, connectionId);

                _userConnections.AddOrUpdate(
                    userId,
                    new HashSet<HubConnectionInfo> { connectionInfo },
                    (key, existingConnections) =>
                    {
                        lock (existingConnections)
                        {
                            existingConnections.Add(connectionInfo);
                            return existingConnections;
                        }
                    });

                _connectionUsers.TryAdd(connectionId, userId);

                _logger.LogInformation(
                    "Added {Hub} connection {ConnectionId} for user {UserId}. Total connections: {Count}",
                    hub, connectionId, userId, _userConnections[userId].Count);

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
                if (!_connectionUsers.TryRemove(connectionId, out var userId))
                {
                    _logger.LogWarning("Connection {ConnectionId} not found for removal", connectionId);
                    return Task.CompletedTask;
                }

                if (_userConnections.TryGetValue(userId, out var connections))
                {
                    lock (connections)
                    {
                        connections.RemoveWhere(c => c.ConnectionId == connectionId);

                        if (connections.Count == 0)
                        {
                            _userConnections.TryRemove(userId, out _);
                            _logger.LogInformation("User {UserId} is now offline (no connections)", userId);
                        }
                        else
                        {
                            _logger.LogInformation(
                                "Removed connection {ConnectionId} for user {UserId}. Remaining connections: {Count}",
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

        public Task<List<HubConnectionInfo>> GetUserConnectionsAsync(string userId)
        {
            if (_userConnections.TryGetValue(userId, out var connections))
            {
                lock (connections)
                {
                    return Task.FromResult(connections.ToList());
                }
            }

            return Task.FromResult(new List<HubConnectionInfo>());
        }

        public Task<List<HubConnectionInfo>> GetUserConnectionsByHubAsync(string userId, HubType hub)
        {
            if (_userConnections.TryGetValue(userId, out var connections))
            {
                lock (connections)
                {
                    var filtered = connections.Where(c => c.Hub == hub).ToList();
                    return Task.FromResult(filtered);
                }
            }

            return Task.FromResult(new List<HubConnectionInfo>());
        }

        public Task<string?> GetUserByConnectionAsync(string connectionId)
        {
            _connectionUsers.TryGetValue(connectionId, out var userId);
            return Task.FromResult(userId);
        }

        public Task<bool> IsUserOnlineAsync(string userId)
        {
            var isOnline = _userConnections.TryGetValue(userId, out var connections) && connections.Count > 0;
            return Task.FromResult(isOnline);
        }

        public Task<List<string>> GetOnlineUsersAsync()
        {
            var onlineUsers = _userConnections.Keys.ToList();
            return Task.FromResult(onlineUsers);
        }

        // Debug
        public int GetTotalConnections() => _connectionUsers.Count;
        public int GetOnlineUserCount() => _userConnections.Count;
    }
}
