using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.Requests.WorkspaceMember;
using server.Interfaces;
using server.Models;

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
        public IActionResult Create([FromBody] AddWorkspaceMemberRequestDto requestDto)
        {
            var newWorkspaceMember = _mapper.Map<WorkspaceMember>(requestDto);

            _unitOfWork.WorkspaceMembers.Add(newWorkspaceMember);
            _unitOfWork.Complete();

            return CreatedAtAction(nameof(Create), newWorkspaceMember);
        }
    }
}
