using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Dtos.Requests.Workspace;
using server.Dtos.Response;
using server.Dtos.Response.Workspace;
using server.Interfaces;
using server.Models;
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

        public WorkspacesController(IUnitOfWork unitOfWork, UserManager<AppUser> userManager, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
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
            var workspace = await _unitOfWork.Workspaces.GetByIdAsync(id);

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
                OwnerId = ownerId
            };

            _unitOfWork.Workspaces.Add(workspace);
            _unitOfWork.Complete();

            return CreatedAtAction(nameof(Create), workspace);
        }
    }
}

