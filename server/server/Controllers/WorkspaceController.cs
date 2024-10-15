using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.Requests.Workspace;
using server.Dtos.Response;
using server.Interfaces;
using server.Models;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [ControllerName("workspace")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class WorkspaceController: ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public WorkspaceController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpPost]
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

