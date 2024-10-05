export interface Session {
  token: string
  refreshToken: string
}

export interface CurrentUser {
  email: string,
  avatar: string,
  fullName: string
}