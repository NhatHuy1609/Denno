﻿using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [ControllerName("user")]
    [Route("api/v{version:apiVersion}")]
    public class UserController: ControllerBase
    {
        [HttpGet]
        [Route("users/me")]
        public async Task<IActionResult> GetMe()
        {
            var user = HttpContext.User;

            return Ok();
        }
    }
}
