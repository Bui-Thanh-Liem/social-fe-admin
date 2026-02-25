import { EAuthVerifyStatus } from '~/shared/enums/status.enum'
import type { IBase } from './base.interface'
import type { IMediaBare } from './media.interface'

export interface IAdmin extends IBase {
  name: string
  email: string
  password: string
  avatar?: IMediaBare
  verify: EAuthVerifyStatus
  email_verify_token?: string
  forgot_password_token?: string
  twoFactorEnabled: boolean
  twoFactorSecret: string | null
}
