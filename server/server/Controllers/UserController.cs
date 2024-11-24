using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.Response;
using server.Dtos.Response.Users;
using server.Interfaces;
using System.Security.Claims;

namespace server.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [ControllerName("user")]
    [Route("api/v{version:apiVersion}")]
    public class UserController: ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<UserController> _logger;

        public UserController(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<UserController> logger)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet]
        [Route("users/me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _unitOfWork.Users.GetByIdAsync(userId ?? "");

            if (user == null)
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusMessage = "User not found"
                });
            }

            return Ok(_mapper.Map<GetUserResponseDto>(user));
        }
    }
}
