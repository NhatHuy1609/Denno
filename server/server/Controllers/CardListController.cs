using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using server.Constants;
using server.Dtos.Requests.CardList;
using server.Dtos.Response;
using server.Dtos.Response.CardList;
using server.Entities;
using server.Helpers;
using server.Helpers.LexoRank;
using server.Hubs.BoardHub;
using server.Interfaces;
using server.Models;
using server.Strategies.ActionStrategy.Contexts;

namespace server.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [ControllerName("cardLists")]
    [Route("api/v{version:apiVersion}/")]
    public class CardListController: ControllerBase
    {
        private readonly ILogger<CardListController> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IActionService _actionService;
        private readonly IAuthService _authService;
        private readonly IHubContext<BoardHub, IBoardHubClient> _boardHubContext;

        public CardListController(
            ILogger<CardListController> logger,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IActionService actionService,
            IAuthService authService,
            IHubContext<BoardHub, IBoardHubClient> boardHubContext)
        {
            _logger = logger;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _actionService = actionService;
            _authService = authService;
            _boardHubContext = boardHubContext;
        }

        [HttpPost("[controller]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> Create(CreateCardListRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = "Name is required"
                });
            }

            var actionContext = new CreateCardListContext()
            {
                BoardId = request.BoardId,
                CardListName = request.Name,
                MemberCreatorId = _authService.GetCurrentUserId()
            };

            var action = await _actionService.CreateActionAsync(ActionTypes.CreateCardList, actionContext);

            if (action == null)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = "Failed to create new card list"
                });
            }

            _logger.LogInformation(
                "Successfully created new card list '{CardListName}' in board {BoardId}",
                request.Name,
                request.BoardId
            );

            var createdCardList = JsonHelper.DeserializeData<CardList>(action.MetaData);
            var createdCardListDto = _mapper.Map<CardListResponseDto>(createdCardList);

            try
            {
                await _boardHubContext.Clients
                    .Group(SignalRGroupNames.GetBoardGroupName(request.BoardId))
                    .OnCardListCreated(createdCardListDto);

                _logger.LogInformation(
                    "Successfully published OnCardListCreated event to board {BoardId}",
                    request.BoardId
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to publish OnCardListCreated event to board {BoardId}", request.BoardId);
            }

            return CreatedAtAction(nameof(Create), createdCardListDto);
        }

        [HttpGet]
        [Route("boards/{boardId}/[controller]")]
        public async Task<IActionResult> GetCardListsByBoardAsync([FromRoute] Guid boardId)
        {
            if (boardId == Guid.Empty)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = "BoardId không hợp lệ"
                });
            }

            var board = await _unitOfWork.Boards.GetByIdAsync(boardId);

            if (board == null)
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusMessage = "Board not found"
                });
            }

            var cardLists = await _unitOfWork.CardLists.GetCardListsByBoardIdAsync(boardId);

            return Ok(_mapper.Map<List<CardListResponseDto>>(cardLists));
        }

        [HttpPut("[controller]/{id}")]
        public async Task<IActionResult> UpdateCardListAsync(Guid id, [FromBody] UpdateCardListRequestDto requestDto)
        {
            var updatedCardList = await _unitOfWork.CardLists.GetByIdAsync(id);

            if (updatedCardList == null)
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusMessage = "CardList not found"
                });
            }

            updatedCardList.Name = requestDto.Name;
            updatedCardList.Rank = requestDto.Rank;

            _unitOfWork.CardLists.Update(updatedCardList);
            _unitOfWork.Complete();

            return Ok(_mapper.Map<CardListResponseDto>(updatedCardList));
        }

        [HttpPut("[controller]/{id}/rank")]
        public async Task<IActionResult> UpdateCardListRankAsync(Guid id, [FromBody] UpdateCardListRankRequestDto requestDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var updatedCardList = await _unitOfWork.CardLists
                .GetByIdAsync(id, cl => cl.Cards.OrderBy(c => c.Rank));

            if (updatedCardList == null)
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusMessage = "CardList not found"
                });
            }

            var lexoRankGen = new LexoRankGenerator();
            var newRank = lexoRankGen.GenerateNewRank(requestDto.PreviousRank, requestDto.NextRank);

            updatedCardList.Rank = newRank;

            _unitOfWork.CardLists.Update(updatedCardList);
            _unitOfWork.Complete();

            _logger.LogInformation($"Successfully updated rank of cardList-{id}");

            var updatedCardListdto = _mapper.Map<CardListResponseDto>(updatedCardList);

            try
            {
                await _boardHubContext.Clients
                 .Group(SignalRGroupNames.GetBoardGroupName(requestDto.BoardId))
                 .OnCardListUpdated(updatedCardListdto);

                _logger.LogInformation(
                    "Successfully published OnCardListUpdated event to board {BoardId}",
                    requestDto.BoardId
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to publish OnCardListUpdated event to board {BoardId}", requestDto.BoardId);
            }

            return Ok(updatedCardListdto);
        }
    }
}
