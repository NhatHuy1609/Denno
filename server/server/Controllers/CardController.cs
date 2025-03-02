using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.Requests.Card;
using server.Dtos.Response;
using server.Dtos.Response.Card;
using server.Dtos.Response.CardList;
using server.Helpers.LexoRank;
using server.Interfaces;
using server.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace server.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [ControllerName("cards")]
    [Route("api/v{version:apiVersion}/")]
    public class CardController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CardController> _logger;

        public CardController(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<CardController> logger)
        {
            _mapper = mapper;
            _logger = logger;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        [Route("cardLists/{cardListId}/cards")]
        public async Task<IActionResult> GetCardsByCardListAsync([FromRoute] Guid cardListId)
        {
            if (cardListId == Guid.Empty)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = "CardListId không hợp lệ"
                });
            }

            var cards = await _unitOfWork.Cards.GetCardsByCardListIdAsync(cardListId);
            return Ok(_mapper.Map<List<CardListResponseDto>>(cards));
        }

        [HttpPost("[controller]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> Create(CreateCardRequestDto requestDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = "RequestDto is invalid"
                });
            }

            var newCard = new Card()
            {
                Name = requestDto.Name,
                CardListId = requestDto.CardListId
            };

            var cards = await _unitOfWork.Cards.GetCardsByCardListIdAsync(requestDto.CardListId);
            var lexorankGen = new LexoRankGenerator();

            if (cards.Count() == 0)
            {
                var newRank = lexorankGen.GenerateInitialRank();
                newCard.Rank = newRank;
            } else
            {
                var lastCard = cards.Last();
                var newRank = lexorankGen.GenerateNewRank(lastCard.Rank, null);
                newCard.Rank = newRank;
            }

            _unitOfWork.Cards.Add(newCard);
            _unitOfWork.Complete();

            return CreatedAtAction(nameof(Create), _mapper.Map<CardResponseDto>(newCard));
        }

        [HttpPut("[controller]/{id}/rank")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateCardRankAsync(Guid id, [FromBody] UpdateCardRankRequestDto requestDto)
        {
            var updatedCard = await _unitOfWork.Cards.GetByIdAsync(id);

            if (updatedCard == null)
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusMessage = "Card not found"
                });
            }

            var lexorankGen = new LexoRankGenerator();
            var newRank = lexorankGen.GenerateNewRank(requestDto.PreviousRank, requestDto.NextRank);

            updatedCard.Rank = newRank;

            _unitOfWork.Cards.Update(updatedCard);  
            _unitOfWork.Complete();

            return Ok(_mapper.Map<CardResponseDto>(updatedCard));
        }
    }
}
