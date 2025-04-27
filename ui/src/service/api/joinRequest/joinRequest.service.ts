import { httpPost, httpGet, httpPut, httpDel } from '../_req'
import { AxiosContracts } from '@/lib/axios/AxiosContracts'

export class JoinRequestService {
  private static readonly basePath = '/joinRequests'

  static approveWorkspaceJoinRequest(requestId: number) {
    return httpPost(`${this.basePath}/${requestId}/approval`)
  }

  static rejectWorkspaceJoinRequest(requestId: number) {
    return httpDel(`${this.basePath}/${requestId}/rejection`)
  }
}