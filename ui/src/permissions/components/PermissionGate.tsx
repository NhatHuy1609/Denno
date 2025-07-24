import React from 'react'
import { usePermissions } from '../hooks/usePermissions'
import { PolicyAction, PolicyResource } from '../core/types'

interface PermissionGateProps<T = any> {
  action: PolicyAction
  resource: PolicyResource
  resourceData?: T
  children: React.ReactNode
  fallback?: React.ReactNode
  showReason?: boolean
}

function PermissionGate<T>({
  action,
  resource,
  resourceData,
  children,
  fallback,
  showReason = false
}: PermissionGateProps<T>) {
  const { can, canWithReason } = usePermissions()

  if (showReason) {
    const result = canWithReason(action, resource, resourceData)
    if (!result.allowed) {
      return (
        <div className='flex flex-col'>
          {fallback}
          {process.env.NODE_ENV === 'development' && (
            <small>Reason: {result.reason?.message}</small>
          )}
        </div>
      )
    }
  } else {
    if (!can(action, resource, resourceData)) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}

export default PermissionGate
