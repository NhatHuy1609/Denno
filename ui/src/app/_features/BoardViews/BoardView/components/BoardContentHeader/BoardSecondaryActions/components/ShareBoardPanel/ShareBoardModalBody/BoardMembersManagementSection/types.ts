export type TabKey = 'members' | 'requests'
export type TabType = 'normal' | 'notification'

export type ManagementTab = {
  key: TabKey
  type: TabType
  title: string
}

export type ManagementTabs = {
  [key in TabKey]: ManagementTab
}