using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using server.Dtos.Requests.CardList;
using server.Dtos.Response;
using server.Dtos.Response.CardList;
using server.Helpers.LexoRank;
using server.Interfaces;
using server.Models;

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

        public CardListController(
            ILogger<CardListController> logger,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _logger = logger;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpPost("[controller]")]
        public async Task<IActionResult> Create(CreateCardListRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = "Name is required"
                });
            }

            var newCardList = new CardList()
            {
                Name = request.Name,
                BoardId = request.BoardId,
            };

            var cardLists = await _unitOfWork.CardLists.GetCardListsByBoardIdAsync(newCardList.BoardId);
            var lexoRankGen = new LexoRankGenerator();

            if (cardLists.Count() == 0)
            {
                newCardList.Rank = lexoRankGen.GenerateInitialRank();
            } else
            {
                var lastCard = cardLists.Last();
                var newRank = lexoRankGen.GenerateNewRank(lastCard.Rank, null);
                newCardList.Rank = newRank;
            }

            _unitOfWork.CardLists.Add(newCardList);
            _unitOfWork.Complete();

            return CreatedAtAction(nameof(Create), _mapper.Map<CardListResponseDto>(newCardList));
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
            var updatedCardList = await _unitOfWork.CardLists.GetByIdAsync(id);

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

            return Ok(_mapper.Map<CardListResponseDto>(updatedCardList));
        }
    }
}
