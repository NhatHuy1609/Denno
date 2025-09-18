using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using server.Constants;
using server.Dtos.Requests.Card;
using server.Dtos.Response;
using server.Dtos.Response.Card;
using server.Dtos.Response.Users;
using server.Entities;
using server.Helpers;
using server.Helpers.LexoRank;
using server.Hubs.BoardHub;
using server.Interfaces;
using server.Models;
using server.Models.Query;
using server.Strategies.ActionStrategy.Contexts;

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
        private readonly IAuthService _authService;
        private readonly IActionService _actionService;
        private readonly INotificationRealtimeService _notificationRealtimeService;
        private readonly IHubContext<BoardHub, IBoardHubClient> _boardHubContext;
        private readonly ICardService _cardService;

        public CardController(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<CardController> logger,
            IAuthService authService,
            IActionService actionService,
            INotificationRealtimeService notificationRealtimeService,
            IHubContext<BoardHub, IBoardHubClient> boardHubContext,
            ICardService cardService)
        {
            _mapper = mapper;
            _logger = logger;
            _authService = authService;
            _actionService = actionService;
            _notificationRealtimeService = notificationRealtimeService;
            _boardHubContext = boardHubContext;
            _cardService = cardService;
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
            return Ok(_mapper.Map<List<CardResponseDto>>(cards));
        }

        [HttpGet("[controller]/{cardId}")]
        public async Task<IActionResult> GetAsync(Guid cardId, [FromQuery] CardQueryModel query)
        {
            if (cardId == Guid.Empty)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = "cardId can not be null"
                });
            }

            var card = await _cardService.GetDetailedCardAsync(cardId, query);
            var cardResponse = _mapper.Map<CardResponseDto>(card);

            return Ok(cardResponse);
        }

        [HttpGet("[controller]/{cardId}/members")]
        public async Task<IActionResult> GetCardMembersAsync(Guid cardId)
        {
            if (cardId == Guid.Empty)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = "cardId can not be null"
                });
            }

            var cardMembers = await _cardService.GetCardMembersAsync(cardId);
            var cardMembersResponse = new CardMembersResponse()
            {
                CardId = cardId,
                Members = cardMembers.Select(cm => _mapper.Map<GetUserResponseDto>(cm.AppUser)).ToList()
            };

            _logger.LogInformation($"Successfully got card's members of card-{cardId}");

            return Ok(cardMembersResponse);
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

            var actionContext = new CreateCardContext()
            {
                MemberCreatorId = _authService.GetCurrentUserId(),
                CardName = requestDto.Name,
                ListId = requestDto.CardListId
            };

            var action = await _actionService.CreateActionAsync(ActionTypes.CreateCard, actionContext);

            if (action == null)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = "Failed to create new card"
                });
            }

            _logger.LogInformation($"Successfully created new card-{requestDto.Name} to list-{requestDto.CardListId}");

            var newCreatedCardDto = JsonHelper.DeserializeData<CardResponseDto>(action.MetaData);
            var boardId = action.BoardId!.Value;

            try
            {
                await _boardHubContext.Clients
                    .Group(SignalRGroupNames.GetBoardGroupName(boardId))
                    .OnCardCreated(newCreatedCardDto!);

                _logger.LogInformation($"Successfully published OnCardCreated event to board {boardId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to publish OnCardCreated event to board {boardId}");
            }

            return CreatedAtAction(nameof(Create), newCreatedCardDto);
        }

        [HttpPut("[controller]/{id}")]
        public async Task<IActionResult> UpdateCardAsync(Guid id, [FromBody] UpdateCardRequest request)
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = "cardId can not be null"
                });
            }

            var updatedCard = await _cardService.UpdateCardAsync(id, request);
            var updatedCardResponse = _mapper.Map<CardResponseDto>(updatedCard);

            if (updatedCard != null)
            {
                var boardId = updatedCard.CardList.BoardId;

                try
                {
                    await _boardHubContext.Clients
                     .Group(SignalRGroupNames.GetBoardGroupName(boardId))
                     .OnCardUpdated(updatedCardResponse);

                    _logger.LogInformation(
                        "Successfully published OnCardUpdated event to board {BoardId}",
                        boardId
                    );
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to publish OnCardUpdated event to board {BoardId}", boardId);
                }
            }

            return Ok(updatedCardResponse);
        }

        [HttpPut("[controller]/{id}/rank")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateCardRankAsync(Guid id, [FromBody] UpdateCardRankRequestDto requestDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var updatedCard = await _unitOfWork.Cards.GetByIdAsync(id);

            if (updatedCard == null)
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusMessage = "Card not found"
                });
            }

            if (requestDto.NewCardListId.HasValue)
            {
                updatedCard.CardListId = requestDto.NewCardListId.Value;
            }

            var lexorankGen = new LexoRankGenerator();
            var newRank = lexorankGen.GenerateNewRank(requestDto.PreviousRank, requestDto.NextRank);

            updatedCard.Rank = newRank;

            _unitOfWork.Cards.Update(updatedCard);  
            _unitOfWork.Complete();

            _logger.LogInformation($"Successfully updated rank of card-{id}");

            var updatedCardDto = _mapper.Map<CardResponseDto>(updatedCard);

            try
            {
                await _boardHubContext.Clients
                 .Group(SignalRGroupNames.GetBoardGroupName(requestDto.BoardId))
                 .OnCardRankUpdated(requestDto.OldCardListId, requestDto.NewCardListId, updatedCardDto);

                _logger.LogInformation(
                    "Successfully published OnCardRankUpdated event to board {BoardId}",
                    requestDto.BoardId
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to publish OnCardUpdated event to board {BoardId}", requestDto.BoardId);
            }

            return Ok(updatedCardDto);
        }

        [HttpPost("[controller]/{cardId}/members/assign")]
        public async Task<IActionResult> AssignCardMemberAsync(Guid cardId, AssignCardMemberRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var actionContext = new DennoActionContext()
            {
                CardId = cardId,
                MemberCreatorId = _authService.GetCurrentUserId(),
                TargetUserId = request.AssignedMemberId,
            };

            var action = await _actionService.CreateActionAsync(ActionTypes.AssignCardMember, actionContext);

            if (action == null)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = $"Failed to assign new member to card-{cardId}"
                });
            }

            _logger.LogInformation($"Successfully assigned new member-{request.AssignedMemberId} to card-{cardId}");

            var actionMetadata = JsonHelper.DeserializeData<DennoActionContext>(action.MetaData);
            var boardId = actionMetadata!.BoardId!.Value;

            try
            {
                await _boardHubContext.Clients
                 .Group(SignalRGroupNames.GetBoardGroupName(boardId))
                 .OnCardMemberAssigned();

                _logger.LogInformation(
                    $"Successfully published OnAssignedCardMember event to board-{boardId}"
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to publish OnAssignedCardMember event to board-{boardId}");
            }

            return Ok();
        }
        
        [HttpPost("[controller]/{cardId}/members/remove")]
        public async Task<IActionResult> RemoveCardMemberAsync(Guid cardId, RemoveCardMemberRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var actionContext = new DennoActionContext()
            {
                MemberCreatorId = _authService.GetCurrentUserId(),
                TargetUserId = request.MemberId,
                CardId = cardId
            };

            var action = await _actionService.CreateActionAsync(ActionTypes.RemoveCardMember, actionContext);

            if (action == null) 
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = $"Failed to remove member-{request.MemberId} from card-{cardId}"
                });
            }

            _logger.LogInformation($"Successfully removed member-{request.MemberId} from card-{cardId}");

            var actionMetadata = JsonHelper.DeserializeData<DennoActionContext>(action.MetaData);
            var boardId = actionMetadata!.BoardId!.Value;

            try
            {
                await _boardHubContext.Clients
                 .Group(SignalRGroupNames.GetBoardGroupName(boardId))
                 .OnCardMemberRemoved();

                _logger.LogInformation(
                    $"Successfully published OnCardMemberRemoved event to board-{boardId}"
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to publish OnCardMemberRemoved event to board- {boardId}");
            }

            return Ok();
        }

        [HttpPut("[controller]/{cardId}/dates")]
        public async Task<IActionResult> UpdateCardDatesAsync(Guid cardId, UpdateCardDatesRequest request)
        {
            if (cardId == Guid.Empty)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = "cardId can not be null"
                });
            }

            var actionContext = new UpdateCardDatesContext()
            {
                MemberCreatorId = _authService.GetCurrentUserId(),
                CardId = cardId,
                StartDate = request.StartDate,

                DueDate = request.DueDate
            };

            var action = await _actionService.CreateActionAsync(ActionTypes.UpdateCardDates, actionContext);

            if (action == null)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = $"Failed to update dates of cards-{cardId}"
                });
            }

            var actionMetadata = JsonHelper.DeserializeData<UpdateCardDatesContext>(action.MetaData);
            var boardId = actionMetadata!.BoardId!.Value;

            var updatedCard = await _unitOfWork.Cards.GetByIdAsync(cardId);
            var updatedCardResponse = _mapper.Map<CardResponseDto>(updatedCard);

            try
            {
                await _boardHubContext.Clients
                 .Group(SignalRGroupNames.GetBoardGroupName(boardId))
                 .OnCardUpdated(updatedCardResponse);

                _logger.LogInformation(
                    $"Successfully published OnCardUpdated event to board-{boardId}"
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to publish OnCardUpdated event to board- {boardId}");
            }

            return Ok(updatedCardResponse);
        }

        [HttpPut("[controller]/{cardId}/completion")]
        public async Task<IActionResult> MarkAsCompletedAsync(Guid cardId)
        {
            if (cardId == Guid.Empty)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = "cardId can not be null"
                });
            }

            var actionContext = new DennoActionContext()
            {
                MemberCreatorId = _authService.GetCurrentUserId(),
                CardId = cardId
            };

            var action = await _actionService.CreateActionAsync(ActionTypes.CompleteCard, actionContext);

            if (action == null)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = $"Failed to update dates of cards-{cardId}"
                });
            }

            var actionMetaData = JsonHelper.DeserializeData<DennoActionContext>(action.MetaData);
            var boarId = actionMetaData!.BoardId!.Value;
            var updatedCard = await _unitOfWork.Cards.GetByIdAsync(cardId);
            var updatedCardResponse = _mapper.Map<CardResponseDto>(updatedCard);

            try
            {
                await _boardHubContext.Clients
                 .Group(SignalRGroupNames.GetBoardGroupName(boarId))
                 .OnCardUpdated(updatedCardResponse);

                _logger.LogInformation(
                    $"Successfully published OnCardUpdated event to board-{boarId}"
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to publish OnCardUpdated event to board- {boarId}");
            }

            _logger.LogInformation($"Successfully marked card-{cardId} as completed");

            return Ok(updatedCardResponse);
        }


        [HttpPut("[controller]/{cardId}/incompletion")]
        public async Task<IActionResult> MarkAsInCompletedAsync(Guid cardId)
        {
            if (cardId == Guid.Empty)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = "cardId can not be null"
                });
            }

            var actionContext = new DennoActionContext()
            {
                MemberCreatorId = _authService.GetCurrentUserId(),
                CardId = cardId
            };

            var action = await _actionService.CreateActionAsync(ActionTypes.InCompleteCard, actionContext);

            if (action == null)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusMessage = $"Failed to update dates of cards-{cardId}"
                });
            }

            var actionMetaData = JsonHelper.DeserializeData<DennoActionContext>(action.MetaData);
            var boarId = actionMetaData!.BoardId!.Value;
            var updatedCard = await _unitOfWork.Cards.GetByIdAsync(cardId);
            var updatedCardResponse = _mapper.Map<CardResponseDto>(updatedCard);

            try
            {
                await _boardHubContext.Clients
                 .Group(SignalRGroupNames.GetBoardGroupName(boarId))
                 .OnCardUpdated(updatedCardResponse);

                _logger.LogInformation(
                    $"Successfully published OnCardUpdated event to board-{boarId}"
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to publish OnCardUpdated event to board- {boarId}");
            }

            _logger.LogInformation($"Successfully marked card-{cardId} as Incompleted");

            return Ok(updatedCardResponse);
        }
    }
}
