export interface CustomFetchRequestInit extends RequestInit {
  isAuthorized?: boolean
  uploadFile?: boolean
}

export interface CustomFetchBaseResponse {
  status: number
  success: boolean
  message: string
}
