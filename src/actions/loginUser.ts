import { generateToken } from "../utils/jwtHelpers"
import { userType } from "../utils/types"

const createTokens = (user: userType) => {
  const token = generateToken(
    { userId: user.id },
    process.env.ACCESS_JWT_SECRET!,
    "10m"
  )
  const refreshToken = generateToken(
    { userId: user.id },
    process.env.REFRESH_JWT_SECRET!,
    "7d"
  )

  return {
    token,
    refreshToken,
  }
}

export default createTokens
