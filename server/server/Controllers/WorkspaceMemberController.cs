using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.Requests.WorkspaceMember;
using server.Dtos.Response;
using server.Enums;
using server.Interfaces;
using server.Models;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [ControllerName("workspace-members")]
    [Route("api/v{version:apiVersion}/workspaces/{workspaceId}/members")]
    public class WorkspaceMemberController: ControllerBase
    {
        private readonly ILogger<WorkspaceMemberController> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public WorkspaceMemberController(
            ILogger<WorkspaceMemberController> logger,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _logger = logger;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> Create(Guid workspaceId, [FromBody] AddWorkspaceMemberRequestDto requestDto)
        {
            var workspace = await _unitOfWork.Workspaces.GetByIdAsync(workspaceId, w => w.WorkspaceMembers);

            if (workspace == null)
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusMessage = $"Couldn't found workspace with Id: {workspaceId}"
                });
            }

            var addedUser = await _unitOfWork.Users.GetUserByEmailAsync(requestDto.Email);
            var isUserExisting = addedUser.WorkspaceMembers.Any(wm => wm.WorkspaceId == workspace.Id);

            if (isUserExisting)
            {
                return Conflict(new ApiErrorResponse()
                {
                    StatusMessage = "User already existed in this workspace"
                });
            }

            // Added new member
            var newMember = new WorkspaceMember()
            {
                WorkspaceId = workspaceId,
                AppUserId = addedUser.Id
            };
            _unitOfWork.WorkspaceMembers.Add(newMember);
            _unitOfWork.Complete();

            // Create new notification about adding new member to workspace
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _unitOfWork.Users.GetByIdAsync(userId ?? "");

            var userIdsToNotify = new List<string> { addedUser.Id };

            var notificationSuccess = await _unitOfWork.Notifications.CreateNotificationAsync(
                entityType: EntityType.Workspace,
                entityId: workspace.Id,
                actionType: ActionType.Invited,
                actorId: user.Id,
                userIdsToNotify: userIdsToNotify
            );

            if (!notificationSuccess)
            {
                return Ok(new { Message = "Member invited, but failed to create notification or send email" });
            }

            // Create email for notifying when added new member to workspace


            return CreatedAtAction(nameof(Create), newMember);
        }
    }
}
