import { generateToken } from "../utils/jwtHelpers"
import { LoginTokensInterface, UserInterface } from "../utils/types"

const createTokens = (user: UserInterface): LoginTokensInterface => {
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
