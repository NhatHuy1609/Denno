import { boardTypesDto } from '@/service/api/board'
import { createContext, useContext } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { workspaceTypes } from '@/entities/workspace'

type CreateFormContextProps = {
  setFormValue: UseFormSetValue<boardTypesDto.CreateBoardDto>
  backgroundSource: string
  visibility: string
  workspaceId: string
  selectedWorkspace?: workspaceTypes.Workspace
}

const CreateFormContext = createContext<CreateFormContextProps>({
  setFormValue: () => {},
  backgroundSource: '',
  visibility: '',
  workspaceId: '',
  selectedWorkspace: undefined
})

export const CreateFormProvider = CreateFormContext.Provider

export const useBoardCreateForm = () => {
  const context = useContext(CreateFormContext)
  return context
}
