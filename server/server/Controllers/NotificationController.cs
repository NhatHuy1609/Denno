using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using server.Interfaces;

namespace server.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [ControllerName("notifications")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class NotificationController: ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<NotificationController> _logger;
        private readonly IAuthService _authService;
        private readonly INotificationService _notificationService;

        public NotificationController(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<NotificationController> logger,
            IAuthService authService,
            INotificationService notificationService)
        {
            _mapper = mapper;
            _logger = logger;
            _authService = authService;
            _notificationService = notificationService;
            _unitOfWork = unitOfWork;
        }

        [HttpPut("{notificationId}/read")]
        public async Task<IActionResult> MarkAsReadNotificationAsync(int notificationId)
        {
            var userId = _authService.GetCurrentUserId();

            await _notificationService.MarkNotificationAsReadAsync(notificationId, userId);

            return NoContent();
        }

        [HttpPut("{notificationId}/unread")]
        public async Task<IActionResult> MarkAsUnReadNotificationAsync(int notificationId)
        {
            var userId = _authService.GetCurrentUserId();

            await _notificationService.MarkNotificationAsUnReadAsync(notificationId, userId);

            return NoContent();
        }

        [HttpPut("readAll")]
        public async Task<IActionResult> MarkAllNotificationsAsReadAsync()
        {
            var userId = _authService.GetCurrentUserId();

            await _notificationService.MarkAllNotificationsAsReadAsync(userId);

            return NoContent();
        }
    }
}
