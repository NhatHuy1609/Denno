import { IPolicy, PolicyContext, PolicyResult } from "./types";
import { PolicyReasonCode, PolicyReasonMessages } from "./types/result-reasons";

export abstract class BasePolicy<T = any> implements IPolicy<T> {
  abstract evaluate(context: PolicyContext, resource?: T): PolicyResult

  protected isSameUser(context: PolicyContext, targetUserId: string): boolean {
    return context.user.id === targetUserId
  }

  protected allow(code: PolicyReasonCode): PolicyResult {
    return {
      allowed: true,
      reason: {
        code,
        message: PolicyReasonMessages[code]
      }
    }
  }

  protected deny(code: PolicyReasonCode): PolicyResult {
    return {
      allowed: false,
      reason: {
        code,
        message: PolicyReasonMessages[code]
      }
    }
  }
}