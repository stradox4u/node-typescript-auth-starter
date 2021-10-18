export interface userType {
  id: string,
  name: string,
  email: string,
  password: string,
  email_verified_at?: Date,
  password_reset_token?: string,
  blacklisted_tokens?: Array<string>,
  createdAt: Date,
  updatedAt: Date
}

export interface errorType {
  error?: Error,
  message?: string,
  statusCode?: number,
  data?: object
}

export interface registerUserBody {
  name: string,
  email: string,
  password: string,
  confirm_password: string
}

export interface verifyEmailInputs {
  recipient: string,
  name: string,
  verifyLink: string
}

export interface loginInput {
  email: string
  password: string
}

export interface filteredUserType {
  id: string
  name: string
  email: string
}