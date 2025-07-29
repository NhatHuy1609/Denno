export type BaseResource = 'user' | 'workspace' | 'board' | 'card'
export type SubResource = 'board_member'

export type PolicyResource = BaseResource | SubResource