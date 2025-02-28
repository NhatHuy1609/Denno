using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Interfaces;
using server.Models;
using server.Dtos.Requests.Board;
using server.Dtos.Response;
using server.Dtos.Response.Board;
using server.Enums;

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

        public BoardsController(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<BoardsController> logger,
            UserManager<AppUser> userManager)
        {
            _mapper = mapper;
            _logger = logger;
            _unitOfWork = unitOfWork;
            _userManager = userManager;
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
        public IActionResult Create([FromBody] CreateBoardRequestDto requestDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusCode = ApiStatusCode.BadRequest,
                    StatusMessage = "Bad Request",
                });
            }

            var newBoard = _mapper.Map<Board>(requestDto);
            _unitOfWork.Boards.Add(newBoard);
            _unitOfWork.Complete();
            
            return CreatedAtAction(nameof(Create), newBoard);
        }
    }
}
