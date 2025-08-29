using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using server.Data;
using server.Entities;
using server.Enums;
using server.Interfaces;

namespace server.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly ApplicationDBContext _dbContext;

        public NotificationRepository(ApplicationDBContext context)
        {
            _dbContext = context;
        }
    }
}
