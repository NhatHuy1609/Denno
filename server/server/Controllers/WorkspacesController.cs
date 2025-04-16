using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Dtos.Requests.Workspace;
using server.Dtos.Response;
using server.Dtos.Response.Action;
using server.Dtos.Response.InvitationSecret;
using server.Dtos.Response.Workspace;
using server.Entities;
using server.Helpers;
using server.Interfaces;
using server.Models.Query;
using server.Strategies.ActionStrategy;
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
        private readonly UserManager<AppUser> _userManager;
        private readonly IFileUploadService _uploadService;
        private readonly IActionService _actionService;
        private readonly ILogger<WorkspacesController> _logger;
        private readonly IEmailService _emailService;
        private readonly IWorkspaceService _workspaceService;

        public WorkspacesController(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            UserManager<AppUser> userManager,
            IFileUploadService uploadService,
            IActionService actionService,
            ILogger<WorkspacesController> logger,
            IEmailService emailService,
            IWorkspaceService workspaceService)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _uploadService = uploadService;
            _actionService = actionService;
            _logger = logger;
            _emailService = emailService;
            _workspaceService = workspaceService;
            _mapper = mapper;
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
                    Role = Enums.MemberRole.Admin
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
            updatedWorkspace.Description = request.Description;

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
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await _emailService.SendActionEmailAsync(action);
                        _logger.LogInformation("Successfully sent email to notify that user was added to new workspace");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"Failed to send action notification email after retries: {ex.Message}");
                    }
                });
            }

            return Ok(_mapper.Map<AddWorkspaceMemberActionResponse>(action));
        }

        [HttpGet("[controller]/{id}/members")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetWorkspaceMembersAsync(Guid id)
        {
            var workspace = await _unitOfWork.Workspaces.GetByIdAsync(id);

            if (workspace == null)
                return NotFound(new ApiErrorResponse() { StatusMessage = "Workspace not found" });

            return Ok();
        }

        [HttpPost("[controller]/{id}/invitationSecret")]
        public async Task<IActionResult> CreateInvitationSecretAsync(Guid id)
        {
            var invitationSecret = await _unitOfWork.InvitationSecrets.GetWorkspaceInvitationSecretAsync(id);

            if (invitationSecret == null)
            {
                var newInvitationSecret = new InvitationSecret()
                {
                    SecretCode = SecretCodeGenerator.GenerateHexCode(),
                    InviterId = User.FindFirstValue(ClaimTypes.NameIdentifier),
                    CreatedAt = DateTime.Now,
                    ExpiresAt = DateTime.Now.AddDays(3),
                    WorkspaceId = id
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
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await _emailService.SendActionEmailAsync(action);
                        _logger.LogInformation("Successfully sent email to workspace's memberse to notify about new joined member");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"Failed to send email to workspace's memberse to notify about new joined member after retries: {ex.Message}");
                    }
                });
            }

            return Ok(_mapper.Map<JoinWorkspaceByLinkActionResponse>(action));
        }
    }
}

