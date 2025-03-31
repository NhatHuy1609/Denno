using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Dtos.Requests.Workspace;
using server.Dtos.Requests.WorkspaceMember;
using server.Dtos.Response;
using server.Dtos.Response.Workspace;
using server.Entities;
using server.Interfaces;
using server.Models;
using server.Strategies.ActionStrategy;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [ControllerName("workspaces")]
    [Route("api/v{version:apiVersion}")]
    public class WorkspacesController: ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<AppUser> _userManager;
        private readonly IFileUploadService _uploadService;
        private readonly IActionService _actionService;
        private readonly ILogger<WorkspacesController> _logger;
        private readonly IEmailService _emailService;

        public WorkspacesController(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            UserManager<AppUser> userManager,
            IFileUploadService uploadService,
            IActionService actionService,
            ILogger<WorkspacesController> logger,
            IEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _uploadService = uploadService;
            _actionService = actionService;
            _logger = logger;
            _emailService = emailService;
            _mapper = mapper;
        }

        [HttpGet]
        [Route("users/me/workspaces")]
        [ProducesResponseType(typeof(IEnumerable<Workspace>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetCurrentUserWorkspaces()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized(new ApiErrorResponse()
                {
                    StatusCode = Enums.ApiStatusCode.Unauthorized,
                    StatusMessage = "User needs login"
                });
            }

            var user = await _userManager.Users
                .Include(u => u.OwnedWorkspaces)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return Unauthorized(new ApiErrorResponse()
                {
                    StatusCode = Enums.ApiStatusCode.Unauthorized,
                    StatusMessage = "Can not find user"
                });
            }

            var workspacesDto = _mapper.Map<IEnumerable<WorkspaceResponseDto>>(user.OwnedWorkspaces);

            return Ok(workspacesDto);
        }

        [HttpGet("[controller]/{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(Workspace), StatusCodes.Status200OK)]
        public async Task<IActionResult> Get(Guid id)
        {
            var workspace = await _unitOfWork.Workspaces.GetByIdAsync(id, w => w.Logo);

            if (workspace == null)
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusCode = Enums.ApiStatusCode.NotFound,
                    StatusMessage = "Workspace not found"
                });
            }

            var workspaceDto = _mapper.Map<WorkspaceResponseDto>(workspace);
            
            return Ok(workspaceDto);
        }

        [HttpPost("[controller]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult Create([FromForm] CreateWorkspaceRequestDto request)
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
                OwnerId = ownerId
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

            return Ok(action);
        }
    }
}

