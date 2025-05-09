﻿using server.Entities;
using server.Strategies.ActionStrategy;

namespace server.Interfaces
{
    public interface IActionService
    {
        Task<DennoAction> CreateActionAsync(string actionType, DennoActionContext context);
    }
}
