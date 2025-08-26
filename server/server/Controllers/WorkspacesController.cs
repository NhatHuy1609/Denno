using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using server.Constants;
using server.Dtos.Requests.Workspace;
using server.Dtos.Response;
using server.Dtos.Response.Action;
using server.Dtos.Response.InvitationSecret;
using server.Dtos.Response.Workspace;
using server.Entities;
using server.Helpers;
using server.Hubs.NotificationHub;
using server.Hubs.WorkspaceHub;
using server.Interfaces;
using server.Models.Query;
using server.Strategies.ActionStrategy.Contexts;
using System;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [ControllerName("workspaces")]
    [Route("api/v{version:apiVersion}")]
    public class WorkspacesController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileUploadService _uploadService;
        private readonly IAuthService _authService;
        private readonly IActionService _actionService;
        private readonly ILogger<WorkspacesController> _logger;
        private readonly IEmailService _emailService;
        private readonly IWorkspaceService _workspaceService;
        private readonly INotificationRealtimeService _notificationRealtimeService;
        private readonly IHubContext<WorkspaceHub, IWorkspaceHubClient> _workspaceHubContext;
        private readonly IHubContext<NotificationHub, INotificationHubClient> _hubContext;

        public WorkspacesController(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            IFileUploadService uploadService,
            IAuthService authService,
            IActionService actionService,
            ILogger<WorkspacesController> logger,
            IEmailService emailService,
            IWorkspaceService workspaceService,
            INotificationRealtimeService notificationRealtimeService,
            IHubContext<WorkspaceHub, IWorkspaceHubClient> workspaceHubContext,
            IHubContext<NotificationHub, INotificationHubClient> hubContext)
        {
            _unitOfWork = unitOfWork;
            _uploadService = uploadService;
            _authService = authService;
            _actionService = actionService;
            _logger = logger;
            _emailService = emailService;
            _workspaceService = workspaceService;
            _notificationRealtimeService = notificationRealtimeService;
            _workspaceHubContext = workspaceHubContext;
            _mapper = mapper;
            _hubContext = hubContext;
        }

        [HttpGet("[controller]/{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(Workspace), StatusCodes.Status200OK)]
        public async Task<IActionResult> Get(Guid id, [FromQuery] WorkspaceQuery query)
        {
            var workspace = await _workspaceService.GetWorkspaceResponseAsync(id, query);

            if (workspace == null)
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusMessage = "Workspace not found"
                });
            }

            return Ok(workspace);
        }

        [HttpPost("[controller]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult Create([FromBody] CreateWorkspaceRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var ownerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (ownerId == null)
            {
                return Unauthorized(new ApiErrorResponse()
                {
                    StatusCode = Enums.ApiStatusCode.Unauthorized,
                    StatusMessage = "Can not find user"
                });
            }

            var workspace = new Workspace()
            {
                Id = new Guid(),
                Name = request.Name,
                Description = request.Description,
                OwnerId = ownerId,
            };

            // Adding owner to workspace member
            workspace.WorkspaceMembers = new List<WorkspaceMember>
            {
                new WorkspaceMember()
                {
                    AppUserId = ownerId,
                    WorkspaceId = workspace.Id,
                    Role = WorkspaceMemberRole.Admin
                }
            };

            _unitOfWork.Workspaces.Add(workspace);
            _unitOfWork.Complete();

            return CreatedAtAction(nameof(Create), workspace);
        }

        [HttpPut("[controller]/{workspaceId}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> UpdateWorkspaceBasicInformationAsync(Guid workspaceId, [FromBody] UpdateWorkspaceRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var updatedWorkspace = await _unitOfWork.Workspaces.GetByIdAsync(workspaceId, w => w.Logo);

            if (updatedWorkspace == null)
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusMessage = "Workspace not found"
                });
            }

            updatedWorkspace.Name = request.Name;
            
            if (!string.IsNullOrEmpty(request.Description))
            {
                updatedWorkspace.Description = request.Description;
            }

            if (request.Visibility != null)
            {
                updatedWorkspace.Visibility = request.Visibility.Value;
            }

            _unitOfWork.Complete();

            return NoContent();
        }

        [HttpPut("[controller]/{workspaceId}/logo")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> UpdateWorkspaceLogoAsync(Guid workspaceId, [FromForm] UpdateWorkspaceLogoRequestDto request)
        {
            var updatedWorkspace = await _unitOfWork.Workspaces.GetByIdAsync(workspaceId, w => w.Logo);

            if (updatedWorkspace == null)
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusMessage = "Workspace not found"
                });
            }

            if (request.LogoFile != null)
            {
                var oldLogo = updatedWorkspace.Logo;

                // Remove Logo in database and remove old logo image stored in cloudinary
                if (oldLogo != null)
                {
                    _unitOfWork.FileUploads.Remove(updatedWorkspace.Logo);
                    var cloudDeletionResult = await _uploadService.DeletePhotoAsync(oldLogo.PublicId);

                    if (cloudDeletionResult.Result != "ok")
                    {
                        throw new Exception($"File deletion failed: {cloudDeletionResult.Error.Message}");
                    }
                }

                // Add new Logo to database and upload new logo image to Cloudinary
                var uploadResult = await _uploadService.UploadPhotoAsync(request.LogoFile);

                if (!uploadResult.Success)
                {
                    throw new Exception($"File upload failed: {uploadResult.ErrorMessage}");
                }

                _unitOfWork.FileUploads.Add(uploadResult.FileUpload);
                uploadResult.FileUpload.WorkspaceId = updatedWorkspace.Id;
            }
            else
            {
                var oldLogo = updatedWorkspace.Logo;
                if (oldLogo != null)
                {
                    _unitOfWork.FileUploads.Remove(oldLogo);

                    var cloudDeletionResult = await _uploadService.DeletePhotoAsync(oldLogo.PublicId);
                    if (cloudDeletionResult.Result != "ok")
                    {
                        throw new Exception($"File deletion failed: {cloudDeletionResult.Error.Message}");
                    }
                }
            }

            _unitOfWork.Workspaces.Update(updatedWorkspace);
            _unitOfWork.Complete();

            return NoContent();
        }

        [HttpPost("[controller]/{id}/members")]
        public async Task<IActionResult> AddWorkspaceMemberAsync(Guid id, [FromBody] AddWorkspaceMemberRequestDto requestDto)
        {
            if (requestDto == null || string.IsNullOrEmpty(requestDto.Email))
                return BadRequest(new ApiErrorResponse { StatusMessage = "Invalid request data" });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new ApiErrorResponse { StatusMessage = "User not authenticated" });

            var workspace = await _unitOfWork.Workspaces.GetByIdAsync(id);
            if (workspace == null)
                return NotFound(new ApiErrorResponse { StatusMessage = "Workspace not found" });

            var addedUser = await _unitOfWork.Users.GetUserByEmailAsync(requestDto.Email);
            if (addedUser == null)
                return NotFound(new ApiErrorResponse { StatusMessage = "User not found" });

            var actionContext = new DennoActionContext
            {
                MemberCreatorId = userId,
                WorkspaceId = workspace.Id,
                TargetUserId = addedUser.Id
            };

            var action = await _actionService.CreateActionAsync(ActionTypes.AddMemberToWorkspace, actionContext);

            // Send email after creating new action successfully
            if (action != null)
            {
                _emailService.SendActionEmailInBackgroundAsync(action);
                _logger.LogInformation("Successfully sent email to notify that user was added to new workspace");

                await _notificationRealtimeService.SendActionNotificationToUsersAsync(action);
            }

            return Ok(_mapper.Map<AddWorkspaceMemberActionResponse>(action));
        }

        [HttpPost("[controller]/{id}/invitationSecret")]
        public async Task<IActionResult> CreateInvitationSecretAsync(Guid id)
        {
            var invitationSecret = await _unitOfWork.InvitationSecrets.GetWorkspaceInvitationSecretAsync(id);

            if (invitationSecret == null)
            {
                var newInvitationSecret = new InvitationSecret()
                {
                    Target = InvitationTarget.Workspace,
                    WorkspaceId = id,
                    SecretCode = SecretCodeGenerator.GenerateHexCode(),
                    InviterId = _authService.GetCurrentUserId(),
                    CreatedAt = DateTime.Now,
                    ExpiresAt = DateTime.Now.AddDays(3)
                };

                await _unitOfWork.InvitationSecrets.CreateAsync(newInvitationSecret);

                return Ok(_mapper.Map<WorkspaceInvitationSecretResponseDto>(newInvitationSecret));
            }

            return Ok(_mapper.Map<WorkspaceInvitationSecretResponseDto>(invitationSecret));
        }

        [HttpGet("[controller]/{id}/invitationSecret")]
        public async Task<IActionResult> GetWorkspaceInvitationSecretAsync(Guid id)
        {
            var invitationSecret = await _unitOfWork.InvitationSecrets.GetWorkspaceInvitationSecretAsync(id);

            if (invitationSecret == null)
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusMessage = "InvitationSecret not found"
                });
            }

            return Ok(_mapper.Map<WorkspaceInvitationSecretResponseDto>(invitationSecret));
        }

        [HttpGet("[controller]/{id}/invitationSecret/detailed")]
        public async Task<IActionResult> GetDetailedInvitationSecretAsync(Guid id)
        {
            var detailedInvitation = await _unitOfWork.InvitationSecrets.GetWorkspaceInvitationSecretAsync(id);

            if (detailedInvitation == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<DetailedWorkspaceInvitationSecretResponse>(detailedInvitation));
        }

        [HttpPost("[controller]/{id}/invitationSecret/verification")]
        public async Task<IActionResult> VerifyInvitationSecretAsync(Guid id, VerifyWorkspaceInvitationSecretRequest request)
        {
            var invitationSecret = await _unitOfWork.InvitationSecrets.GetWorkspaceInvitationSecretAsync(id);

            if (invitationSecret == null)
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusMessage = "Ivitation secret not found"
                });
            }

            if (DateTime.Now > invitationSecret.ExpiresAt)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = "Invitation secret has expired"
                });
            }

            if (string.IsNullOrEmpty(request.SecretCode))
            {
                return BadRequest(new ApiErrorResponse
                {
                    StatusMessage = "Secret code is required."
                });
            }

            if (invitationSecret.SecretCode != request.SecretCode)
            {
                return BadRequest(new ApiErrorResponse
                {
                    StatusMessage = "Invalid secret code."
                });
            }

            return Ok();
        }

        [HttpDelete("[controller]/{workspaceId}/invitationSecret")]
        public async Task<IActionResult> DisableInvitationSecretAsync(Guid workspaceId)
        {
            await _unitOfWork.InvitationSecrets.DeleteWorkspaceInvitationSecretAsync(workspaceId);

            return Ok();
        }

        [HttpPost("[controller]/{workspaceId}/joinByLink")]
        public async Task<IActionResult> JoinWorkspaceByLink(Guid workspaceId)
        {
            var workspace = await _unitOfWork.Workspaces.GetWorkspaceWithMembersAsync(workspaceId);
            if (workspace == null)
                return NotFound(new ApiErrorResponse { StatusMessage = "Workspace not found" });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if user has already existed in workspace
            var isExisted = workspace.WorkspaceMembers.Any(wm => wm.AppUserId == userId);
            if (isExisted)
            {
                return Conflict(new ApiErrorResponse()
                {
                    StatusMessage = "User is already a member of this workspace."
                });
            }

            var actionContext = new DennoActionContext()
            {
                MemberCreatorId = userId,
                WorkspaceId = workspaceId
            };

            var action = await _actionService.CreateActionAsync(ActionTypes.JoinWorkspaceByLink, actionContext);

            if (action != null)
            {
                _emailService.SendActionEmailInBackgroundAsync(action);
                await _notificationRealtimeService.SendActionNotificationToUsersAsync(action);
            }

            return Ok(_mapper.Map<JoinWorkspaceByLinkActionResponse>(action));
        }

        [HttpGet("[controller]/{workspaceId}/joinRequests")]
        public async Task<IActionResult> GetWorkspaceJoinRequests(Guid workspaceId)
        {
            var workspaces = await _unitOfWork.JoinRequests.GetJoinRequestsByWorkspaceId(workspaceId);

            return Ok(_mapper.Map<List<WorkspaceJoinRequestResponse>>(workspaces));
        }

        [HttpPost("[controller]/{workspaceId}/joinRequests")]
        public async Task<IActionResult> CreateJoinRequestAsync([FromRoute] Guid workspaceId, CreateWorkspaceJoinRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var actionContext = new DennoActionContext()
            {
                MemberCreatorId = request.RequesterId, // Requester is creator
                WorkspaceId = workspaceId,
            };

            var action = await _actionService.CreateActionAsync(ActionTypes.SendWorkspaceJoinRequest, actionContext);

            if (action != null)
            {
                _emailService.SendActionEmailInBackgroundAsync(action);
                _logger.LogInformation("Successfully sent email to notify that user sent a join request to workspace");

                await _notificationRealtimeService.SendActionNotificationToUsersAsync(action);
            }

            return Ok();
        }

        [HttpPost("[controller]/joinRequests/{requestId}/approval")]
        public async Task<IActionResult> AppoveWorkspaceJoinRequestAsync(int requestId)
        {
            var joinRequest = await _unitOfWork.JoinRequests.GetJoinRequestByIdAsync(requestId);

            if (joinRequest == null)
            {
                return NotFound();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var actionContext = new DennoActionContext()
            {
                MemberCreatorId = userId,
                WorkspaceId = joinRequest.WorkspaceId,
                TargetUserId = joinRequest.RequesterId
            };

            var action = await _actionService.CreateActionAsync(ActionTypes.ApproveWorkspaceJoinRequest, actionContext);

            if (action != null)
            {
                await _emailService.SendActionEmailAsync(action);
            }

            return Ok();
        }

        [HttpDelete("[controller]/joinRequests/{requestId}/rejection")]
        public async Task<IActionResult> RejectWorkpsaceJoinRequestAsync(int requestId)
        {
            var joinRequest = await _unitOfWork.JoinRequests.GetJoinRequestByIdAsync(requestId);

            if (joinRequest == null)
            {
                return NotFound();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var actionContext = new DennoActionContext()
            {
                MemberCreatorId = userId,
                WorkspaceId = joinRequest.WorkspaceId,
                TargetUserId = joinRequest.RequesterId
            };

            var action = await _actionService.CreateActionAsync(ActionTypes.RejectWorkspaceJoinRequest, actionContext);

            if (action != null)
            {
                await _emailService.SendActionEmailAsync(action);
            }

            return Ok();
        }

        [HttpPut]
        [Route("[controller]/{workspaceId}/members/{memberId}/role")]
        public async Task<IActionResult> UpdateWorkspaceMemberRoleAsync(
            [FromRoute] Guid workspaceId,
            [FromRoute] string memberId,
            UpdateWorkspaceMemberRoleRequest request)
        {
            if (!ModelState.IsValid || workspaceId == Guid.Empty || string.IsNullOrEmpty(memberId))
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = "Request or Route params are not valid"
                });
            }

            var userId = _authService.GetCurrentUserId();

            var actionContext = new UpdateWorkspaceMemberRoleActionContext()
            {
                MemberCreatorId = userId,
                WorkspaceId = workspaceId,
                TargetUserId = memberId,
                NewMemberRole = request.NewMemberRole
            };

            var action = await _actionService.CreateActionAsync(ActionTypes.UpdateWorkspaceMemberRole, actionContext);

            if (action != null)
            {
                await _workspaceService.NotifyUserActionToWorkspaceMembers(action, workspaceId);
            }

            return Ok();
        }

        [HttpDelete]
        [Route("[controller]/{workspaceId}/members/{memberId}")]
        public async Task<IActionResult> RemoveWorkspaceMemberAsync(
            [FromRoute] Guid workspaceId,
            [FromRoute] string memberId,
            [FromBody] RemoveWorkspaceMemberDto request)
        {
            if (workspaceId == Guid.Empty || string.IsNullOrEmpty(memberId))
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = "workspaceId and memberId can not be null"
                });
            }

            var userId = _authService.GetCurrentUserId();

            var actionContext = new RemoveWorkspaceMemberActionContext()
            {
                MemberCreatorId = userId,
                WorkspaceId = workspaceId,
                TargetUserId = memberId,
                DeleteRelatedBoardMembers = request.DeleteRelatedBoardMembers
            };

            var action = await _actionService.CreateActionAsync(ActionTypes.RemoveWorkspaceMember, actionContext);

            if (action != null)
            {
                await _workspaceHubContext
                    .Clients
                    .Users([memberId, userId])
                    .OnWorkspaceMemberRemoved(memberId, userId, workspaceId, actionContext.DeleteRelatedBoardMembers);
            }

            return Ok();
        }

        [HttpDelete]
        [Route("[controller]/{workspaceId}/leave")]
        public async Task<IActionResult> LeaveWorkspace([FromRoute] Guid workspaceId)
        {
            if (workspaceId == Guid.Empty)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = "WorkspaceId can not be null"
                });
            }

            var userId = _authService.GetCurrentUserId();
            var isSuccessful = await _workspaceService.LeaveWorkspaceAsync(workspaceId, userId);

            if (isSuccessful)
            {
                await _workspaceHubContext
                    .Clients
                    .Groups(SignalRGroupNames.GetWorkspaceGroupName(workspaceId))
                    .OnWorkspaceMemberLeft(userId, workspaceId);
            }

            return NoContent();
        }
    }
}

