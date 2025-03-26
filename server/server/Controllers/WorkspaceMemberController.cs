using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.Requests.WorkspaceMember;
using server.Dtos.Response;
using server.Enums;
using server.Interfaces;
using server.Models;
using System.Security.Claims;

namespace server.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [ControllerName("workspace-members")]
    [Route("api/v{version:apiVersion}/workspaces/{workspaceId}/members")]
    public class WorkspaceMemberController: ControllerBase
    {
        private readonly ILogger<WorkspaceMemberController> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public WorkspaceMemberController(
            ILogger<WorkspaceMemberController> logger,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IEmailService emailService)
        {
            _logger = logger;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _emailService = emailService;
        }
    }
}
