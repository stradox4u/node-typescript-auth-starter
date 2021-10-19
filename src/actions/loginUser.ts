import { generateToken } from "../utils/jwtHelpers"
import { LoginTokens, UserType } from "../utils/types"

const createTokens = (user: UserType): LoginTokens => {
  const token: string | Error = generateToken(
    { userId: user.id },
    process.env.ACCESS_JWT_SECRET!,
    "10m"
  )
  const refreshToken: string | Error = generateToken(
    { userId: user.id },
    process.env.REFRESH_JWT_SECRET!,
    "7d"
  )

  return {
    token: token,
    refreshToken: refreshToken,
  }
}

export default createTokens
