import { Props } from '@dnd-kit/core/dist/components/DragOverlay'
import React from 'react'
import type { userTypes } from '@/entities/user'

type UserInfoDisplayProps = {
  user?: userTypes.User
}

function UserInfoDisplay({ user }: UserInfoDisplayProps) {
  return <div>UserInfoDisplay</div>
}

export default UserInfoDisplay
