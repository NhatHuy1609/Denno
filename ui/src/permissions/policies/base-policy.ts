import { IPolicy, PolicyContext, PolicyResult } from "../core/types";

export abstract class BasePolicy<T = any> implements IPolicy<T> {
  abstract evaluate(context: PolicyContext, resource?: T): PolicyResult

  protected isSameUser(context: PolicyContext, targetUserId: string): boolean {
    return context.user.id === targetUserId
  }
}