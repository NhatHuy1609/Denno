import { PersistedStateKey } from './persisted-keys'

export type PersistedStateValues = {
  [PersistedStateKey.MeId]: string
  [PersistedStateKey.Token]: string
  [PersistedStateKey.RefreshToken]: string
  [PersistedStateKey.RecentAccessWorkspace]: string
  [PersistedStateKey.RecentAccessBoard]: string
  [PersistedStateKey.Invitation]: string
  [PersistedStateKey.RedirectAfterLogin]: string
  [PersistedStateKey.WorkspacesVisibility]: Record<
    string, // Key is workspaceId
    {
      isShowMoreBoardsInSidebar: boolean
    }
  >
  [PersistedStateKey.NewNotificationCount]: number
}

export const defaultPersistedStateValues: PersistedStateValues = {
  [PersistedStateKey.MeId]: '',
  [PersistedStateKey.Token]: '',
  [PersistedStateKey.RefreshToken]: '',
  [PersistedStateKey.RecentAccessWorkspace]: '',
  [PersistedStateKey.RecentAccessBoard]: '',
  [PersistedStateKey.Invitation]: '',
  [PersistedStateKey.RedirectAfterLogin]: '',
  [PersistedStateKey.WorkspacesVisibility]: {},
  [PersistedStateKey.NewNotificationCount]: 0
}
