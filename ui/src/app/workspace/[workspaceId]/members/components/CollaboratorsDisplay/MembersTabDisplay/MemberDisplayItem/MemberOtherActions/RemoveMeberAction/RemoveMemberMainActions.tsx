import React from 'react'
import MainActionItem from './MainActionItem'

type MainActionType = 'removeFromWorkspace'

type MainActions = Record<
  MainActionType,
  {
    label: string
    description: string
    onClick: () => void
  }
>

function RemoveMemberMainActions() {
  const actions: MainActions = {
    removeFromWorkspace: {
      label: 'Remove from workspace',
      description:
        'Remove all access to the Workspace. The member will remain on all their boards in this Workspace. They will receive a notification',
      onClick: () => {
        console.log('Executing remove from workspace')
      }
    }
  }

  return (
    <div>
      {Object.values(actions).map((action) => (
        <MainActionItem
          key={action.label}
          label={action.label}
          description={action.description}
          onClick={action.onClick}
        />
      ))}
    </div>
  )
}

export default RemoveMemberMainActions
