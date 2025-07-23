export type TabKey = 'members' | 'requests'

export type TabType = 'normal' | 'notification'

export type ManagementTab = {
  title: string
  key: TabKey
  type: TabType
}

export type ManagementTabs = {
  [key in TabKey]: ManagementTab
}