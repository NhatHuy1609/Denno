import { PolicyReason } from "../result-reasons"

export type PolicyResult = {
  allowed: boolean
  reason?: PolicyReason
}