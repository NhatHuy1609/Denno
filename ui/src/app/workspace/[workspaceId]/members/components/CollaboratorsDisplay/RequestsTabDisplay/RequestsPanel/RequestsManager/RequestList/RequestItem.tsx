import React from 'react'
import SelectRequestCheckbox from './SelectRequestCheckbox'
import RequesterInfo from './RequesterInfo'
import RequestActions from './RequestActions'
import { formatDateTime } from '@/utils/formatDateTime'
import { WorkspaceJoinRequest } from '@/entities/workspace/workspace.schemas'

type Props = {
  isSelected?: boolean
  joinRequest: WorkspaceJoinRequest
  selectRequestFn: (requestId: number) => void
}

export default function RequestItem({ joinRequest, selectRequestFn, isSelected }: Props) {
  const { id, requester, requestedAt } = joinRequest

  return (
    <div className='flex w-full items-center justify-between p-2'>
      <div className='flex w-fit items-center gap-2'>
        <SelectRequestCheckbox requestId={id} isSelected={isSelected} selectRequestFn={selectRequestFn} />
        <RequesterInfo requester={requester} />
      </div>
      <div className='flex w-fit items-center gap-6'>
        <RequestedDateDisplay requestedAt={requestedAt} />
        <RequestActions requestId={id} />
      </div>
    </div>
  )
}

function RequestedDateDisplay({ requestedAt }: { requestedAt: string }) {
  const formattedDateTime = formatDateTime(requestedAt)

  return <p className='text-sm text-gray-500'>{formattedDateTime}</p>
}
