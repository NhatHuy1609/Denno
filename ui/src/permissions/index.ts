import { PolicyRegistry } from "./core/policy-registry"
import { BoardViewPolicy } from "./policies/board/board-view-policy"

export const initializePolicies = () => {
  PolicyRegistry.register('view:board', new BoardViewPolicy())
}

initializePolicies()