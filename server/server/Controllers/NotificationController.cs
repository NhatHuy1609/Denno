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

        public NotificationController(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<NotificationController> logger)
        {
            _mapper = mapper;
            _logger = logger;
            _unitOfWork = unitOfWork;
        }
    }
}
