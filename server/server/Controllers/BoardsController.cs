using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Interfaces;
using server.Dtos.Requests.Board;
using server.Dtos.Response;
using server.Dtos.Response.Board;
using server.Enums;
using server.Entities;
using System.Security.Claims;
using server.Constants;
using server.Strategies.ActionStrategy.Contexts;
using Microsoft.AspNetCore.Authorization;
using server.Authorization.Constants;
using server.Services.QueueHostedService;
using server.Dtos.Response.Workspace;
using server.Helpers;
using server.Dtos.Response.InvitationSecret;
using server.Dtos.Requests.Workspace;

namespace server.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [ControllerName("boards")]
    [Route("api/v{version:apiVersion}/")]
    public class BoardsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<BoardsController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly IActionService _actionService;
        private readonly IEmailService _emailService;
        private readonly IBoardService _boardService;
        private readonly IAuthService _authService;
        private readonly IBackgroundTaskQueue _taskQueueService;

        public BoardsController(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<BoardsController> logger,
            UserManager<AppUser> userManager,
            IActionService actionService,
            IEmailService emailService,
            IBoardService boardService,
            IAuthService authService,
            IBackgroundTaskQueue taskQueueService)
        {
            _mapper = mapper;
            _logger = logger;
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _actionService = actionService;
            _emailService = emailService;
            _boardService = boardService;
            _authService = authService;
            _taskQueueService = taskQueueService;
        }

        [HttpGet("[controller]/{boardId}/activities")]
        public async Task<IActionResult> GetBoardActivitiesAsync(Guid boardId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var activities = await _boardService.GetBoardActivityResponsesAsync(boardId);
            if (activities == null || !activities.Any())
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusMessage = "No activities found for this board"
                });
            }

            return Ok(activities);
        }

        [HttpGet]
        [Route("workspaces/{workspaceId}/boards")]
        [ProducesResponseType(typeof(IEnumerable<BoardResponseDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetBoardsByWorkspaceIdAsync(Guid workspaceId)
        {
            var boardList = await _unitOfWork.Boards.GetBoardsByWorkspaceIdAsync(workspaceId);

            var boardListDto = _mapper.Map<IEnumerable<BoardResponseDto>>(boardList);

            return Ok(boardListDto);
        }

        [HttpGet]
        [Route("[controller]/{boardId}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(BoardResponseDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetBoardByIdAsync(Guid boardId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var board = await _unitOfWork.Boards.GetByIdAsync(boardId);

            if (board == null)
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusMessage = "Board not found"
                });
            }

            var boardDto = _mapper.Map<BoardResponseDto>(board);

            return Ok(boardDto);
        }

        [HttpPost("[controller]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateBoardRequestDto requestDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusCode = ApiStatusCode.BadRequest,
                    StatusMessage = "Bad Request",
                });
            }

            var ownerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var newBoard = _mapper.Map<Board>(requestDto);

            var actionContext = new CreateBoardActionContext()
            {
                MemberCreatorId = ownerId,
                IsBoardActivity = true,
                BoardId = newBoard.Id,
                WorkspaceId = newBoard.WorkspaceId,
                BoardData = newBoard
            };

            var actionResult = await _actionService.CreateActionAsync(ActionTypes.CreateBoard, actionContext);
            
            return CreatedAtAction(nameof(Create), newBoard);
        }

        [HttpPost("[controller]/{id}/members")]
        public async Task<IActionResult> AddBoardMemberAsync(Guid id, [FromBody] AddBoardMemberRequestDto requestDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new ApiErrorResponse() { StatusMessage = "Invalid request data" });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new ApiErrorResponse() { StatusMessage = "User not authenticated" });

            var board = await _unitOfWork.Boards.GetByIdAsync(id);
            if (board == null)
                return NotFound(new ApiErrorResponse { StatusMessage = "Board not found" });

            var addedUser = await _unitOfWork.Users.GetUserByEmailAsync(requestDto.Email);
            if (addedUser == null)
                return NotFound(new ApiErrorResponse { StatusMessage = "User not found" });

            var actionContext = new DennoActionContext
            {
                MemberCreatorId = userId,
                IsBoardActivity = true,
                BoardId = board.Id,
                TargetUserId = addedUser.Id
            };

            var action = await _actionService.CreateActionAsync(ActionTypes.AddMemberToBoard, actionContext);
            if (action != null)
            {
                //await _emailService.SendBoardActionEmailsAsync(action, isRunInBackground: true);
            }

            return Ok(action);
        }

        [HttpPost("[controller]/{boardId}/join")]
        [Authorize(Policy = PolicyNames.WorkspaceMemberViaBoard)]
        public async Task<IActionResult> JoinBoardAsync(Guid boardId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiErrorResponse() { StatusMessage = "Invalid request data" });
            }

            var userId = _authService.GetCurrentUserId();

            var actionContext = new DennoActionContext()
            {
                MemberCreatorId = userId,
                IsBoardActivity = true,
                BoardId = boardId,
            };

            var action = await _actionService.CreateActionAsync(ActionTypes.JoinBoard, actionContext);
            if (action != null)
            {
                //await _emailService.SendBoardActionEmailsAsync(action, isRunInBackground: true);
            }

            return Ok();
        }

        [HttpPost("[controller]/{boardId}/invitationSecret")]
        public async Task<IActionResult> CreateBoardInvitationSecretAsync(Guid boardId, CreateBoardInvitationSecretRequest request)
        {
            var invitationSecret = await _unitOfWork.InvitationSecrets.GetBoardInvitationSecretAsync(boardId);

            if (invitationSecret == null)
            {
                var newInvitationSecret = new InvitationSecret()
                {
                    Target = InvitationTarget.Board,
                    BoardId = boardId,
                    BoardRole = request.BoardRole,
                    SecretCode = SecretCodeGenerator.GenerateHexCode(),
                    InviterId = _authService.GetCurrentUserId(),
                    CreatedAt = DateTime.Now,
                    ExpiresAt = DateTime.Now.AddDays(3),
                };

                await _unitOfWork.InvitationSecrets.CreateAsync(newInvitationSecret);

                return Ok(_mapper.Map<BoardInvitationSecretResponse>(newInvitationSecret));
            }

            return Ok(_mapper.Map<BoardInvitationSecretResponse>(invitationSecret));
        }

        [HttpGet("[controller]/{boardId}/invitationSecret")]
        public async Task<IActionResult> GetBoardInvitationSecretAsync(Guid boardId)
        {
            var invitationSecret = await _unitOfWork.InvitationSecrets.GetBoardInvitationSecretAsync(boardId);

            if (invitationSecret == null)
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusMessage = "InvitationSecret not found"
                });
            }

            return Ok(_mapper.Map<BoardInvitationSecretResponse>(invitationSecret));
        }

        [HttpPost("[controller]/{id}/invitationSecret/verification")]
        public async Task<IActionResult> VerifyBoardInvitationSecretAsync(Guid id, VerifyBoardInvitationSecretRequest request)
        {
            var invitationSecret = await _unitOfWork.InvitationSecrets.GetBoardInvitationSecretAsync(id);

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

        [HttpDelete("[controller]/{boardId}/invitationSecret")]
        public async Task<IActionResult> DisableBoardInvitationSecretAsync(Guid boardId)
        {
            await _unitOfWork.InvitationSecrets.DeleteBoardInvitationSecretAsync(boardId);

            return Ok();
        }

        [HttpPost("[controller]/{boardId}/joinByLink")]
        public async Task<IActionResult> JoinBoardByLinkAsync(Guid boardId)
        {
            var userId = _authService.GetCurrentUserId();

            var isBoardMember = await _boardService.IsBoardMemberAsync(boardId, userId);

            if (isBoardMember)
            {
                return Conflict(new ApiErrorResponse
                {
                    StatusMessage = "User is already a member of this board"
                });
            }

            var actionContext = new DennoActionContext()
            {
                MemberCreatorId = userId,
                IsBoardActivity = true,
                BoardId = boardId
            };

            var action = await _actionService.CreateActionAsync(ActionTypes.JoinBoardByLink, actionContext);

            if (action != null)
            {
                //await _emailService.SendBoardActionEmailsAsync(action, isRunInBackground: true);
            }

            return Ok();
        }
    }
}

