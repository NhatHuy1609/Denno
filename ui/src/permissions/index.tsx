import { useEffect } from 'react'
import { PolicyRegistry } from './core/policy-registry'
import { BoardViewPolicy } from './policies/board/board-view-policy'

export const PolicyInitializer = () => {
  const initializePolicies = () => {
    console.log('Initializing policies...') // DEBUG

    PolicyRegistry.register('view:board', new BoardViewPolicy())
  }

  useEffect(() => {
    initializePolicies()
  }, [])

  return null
}
