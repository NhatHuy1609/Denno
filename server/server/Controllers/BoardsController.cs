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
using server.Strategies.ActionStrategy;
using server.Constants;
using server.Strategies.ActionStrategy.Contexts;

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

        public BoardsController(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<BoardsController> logger,
            UserManager<AppUser> userManager,
            IActionService actionService,
            IEmailService emailService,
            IBoardService boardService)
        {
            _mapper = mapper;
            _logger = logger;
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _actionService = actionService;
            _emailService = emailService;
            _boardService = boardService;
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
            //if (action != null)
            //{
            //    _emailService.SendActionEmailInBackgroundAsync(action);
            //    _logger.LogInformation("Successfully sent email to notify that user was added to new board");
            //}

            return Ok(action);
        }

        [HttpPost("[controller]/{boardId}/join")]
        public async Task<IActionResult> JoinBoardAsync(Guid boardId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiErrorResponse() { StatusMessage = "Invalid request data" });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var actionContext = new DennoActionContext()
            {
                MemberCreatorId = userId,
                IsBoardActivity = true,
                BoardId = boardId
            };

            return Ok();
        }
    }
}
