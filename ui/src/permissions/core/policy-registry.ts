import { IPolicy, PolicyKey } from "../types/policy"
import { PolicyAction } from "../types/policy-actions"
import { PolicyResource } from "../types/policy-resources"

export class PolicyRegistry {
  private static policies = new Map<PolicyKey, IPolicy>()

  static register<T = any>(resource: PolicyResource, action: PolicyAction, policy: IPolicy<T>): void {
    const key = `${resource}:${action}` as PolicyKey
    this.policies.set(key, policy)
  }

  static get(key: PolicyKey): IPolicy | undefined {
    return this.policies.get(key)
  }

  static unregister(key: PolicyKey): boolean {
    return this.policies.delete(key)
  }

  static clear(): void {
    this.policies.clear()
  }

  static getAllKeys(): PolicyKey[] {
    return Array.from(this.policies.keys())
  }
}