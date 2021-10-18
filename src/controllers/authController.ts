import { NextFunction } from "express"

import createTokens from "../actions/loginUser"
import { getExpiry } from "../utils/cookieHelpers"
import { filteredUserType } from "../utils/types"

export const postLogin = async (req: any, res: any, next: NextFunction) => {
  try {
    const { token, refreshToken } = createTokens(req.user)
    const expiry = getExpiry()

    const user: filteredUserType = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    }

    return res
      .cookie("refresh_cookie", refreshToken, {
        expires: expiry,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({
        token: token,
        expires_in: 600_000,
        user: user,
      })
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
    return err
  }
}
