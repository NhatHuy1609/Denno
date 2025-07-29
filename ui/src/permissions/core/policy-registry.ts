import { IPolicy, PolicyKey } from "../types/policy"

export class PolicyRegistry {
  private static policies = new Map<PolicyKey, IPolicy>()

  static register<T = any>(key: PolicyKey, policy: IPolicy<T>): void {
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