export interface UserType {
  id: string
  name: string
  email: string
  password: string
  email_verified_at?: Date
  password_reset_token?: string
  blacklisted_tokens?: Array<string>
  createdAt: Date
  updatedAt: Date
}

export class MyError extends Error {
  public statusCode
  public data
  public title: string

  constructor(title: string, statusCode: number, data?: object) {
    super(title)
    Object.setPrototypeOf(this, MyError)
    this.statusCode = statusCode
    this.data = data
    this.title = title
  }
}

export interface RegisterUserBody {
  name: string
  email: string
  password: string
  confirm_password: string
}

export interface VerifyEmailInputs {
  recipient: string
  name: string
  verifyLink: string
}

export interface FilteredUser {
  id: string
  name: string
  email: string
}

export interface LoginTokens {
  token: string | Error
  refreshToken: string | Error
}
