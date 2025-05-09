using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.Response;
using server.Dtos.Response.Notification.Interfaces;
using server.Dtos.Response.Users;
using server.Dtos.Response.Workspace;
using server.Entities;
using server.Interfaces;
using server.Models.Pagination;
using server.Models.Query;
using server.Models.Query.UserWorkspacesQuery;
using System.Security.Claims;

namespace server.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [ControllerName("users")]
    [Route("api/v{version:apiVersion}")]
    public class UserController: ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<UserController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly INotificationService _notificationService;
        private readonly IUserService _userService;

        public UserController(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<UserController> logger,
            UserManager<AppUser> userManager,
            INotificationService notificationService,
            IUserService userService)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _userManager = userManager;
            _notificationService = notificationService;
            _userService = userService;
        }

        [HttpGet]
        [Route("[controller]/me")]
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

        [HttpGet]
        [Route("[controller]")]
        public async Task<IActionResult> GetUsersAsync([FromQuery] UserQueryModel query)
        {
            var paginatedUsers = await _unitOfWork.Users.GetUsersAsync(query);

            var result = new PaginatedResult<GetUserResponseDto>
            {
                Items = _mapper.Map<List<GetUserResponseDto>>(paginatedUsers.Items),
                TotalCount = paginatedUsers.TotalCount,
                PageNumber = paginatedUsers.PageNumber,
                PageSize = paginatedUsers.PageSize
            };

            return Ok(result);
        }

        [HttpGet]
        [Route("[controller]/{id}/workspaces")]
        [ProducesResponseType(typeof(IEnumerable<UserWorkspaceResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetUserWorkspacesAsync(string id, [FromQuery] UserWorkspacesQuery query)
        {
            var responses = await _userService.GetUserWorkspacesResponse(id, query);

            if (responses == null)
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusMessage = "Not found user"
                });
            }

            return Ok(responses);
        }

        [HttpGet("[controller]/{id}/boardsInvited")]
        public async Task<IActionResult> GetUserBoardsInvitedAsync(string id)
        {
            return Ok();
        }


        [HttpGet]
        [Route("[controller]/{id}/notifications")]
        [ProducesResponseType(typeof(List<INotificationResponseDto>), StatusCodes.Status200OK)]

        public async Task<IActionResult> GetUserNotificationsAsync([FromRoute] string id)
        {
            var notificationResponses = await _notificationService.GetUserNotificationResponseDtos(id);
            
            return Ok(notificationResponses);
        }
    }
}
