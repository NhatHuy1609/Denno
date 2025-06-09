using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Constants;
using server.Entities;
using server.Interfaces;
using server.Strategies.ActionStrategy;
using server.Strategies.ActionStrategy.Contexts;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [ControllerName("joinRequests")]
    [Route("api/v{version:apiVersion}/")]
    public class JoinRequestController: ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IActionService _actionService;
        private readonly ILogger<JoinRequestController> _logger;
        private readonly IEmailService _emailService;

        public JoinRequestController(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            IActionService actionService,
            ILogger<JoinRequestController> logger,
            IEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _actionService = actionService;
            _logger = logger;
            _emailService = emailService;
            _mapper = mapper;
        }

        [HttpPost("[controller]/{requestId}/approval")]
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

        [HttpDelete("[controller]/{requestId}/rejection")]
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
    }
}
