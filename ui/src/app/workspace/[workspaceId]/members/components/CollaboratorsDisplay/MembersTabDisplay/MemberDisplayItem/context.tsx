import { createContext, useContext } from 'react'
import { Workspace } from '@/entities/workspace/workspace.types'

type Member = NonNullable<Workspace['members']>[number]

type MemberDisplayItemProps = {
  member: Member
}

const MemberDisplayItemContext = createContext<MemberDisplayItemProps>({
  member: {} as Member
})
export const MemberDisplayItemProvider = MemberDisplayItemContext.Provider

export function useMemberDisplayItemContext() {
  return useContext(MemberDisplayItemContext)
}
