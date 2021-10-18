import { NextFunction } from "express"
import { Sequelize } from "sequelize"

const db = require("../../models")
import createTokens from "../actions/loginUser"
import { getExpiry } from "../utils/cookieHelpers"
import { filteredUserType, MyError, userType } from "../utils/types"

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
        sameSite: "None",
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

export const postLogout = async (req: any, res: any, next: NextFunction) => {
  try {
    const user = await db.User.update(
      {
        blacklisted_tokens: Sequelize.fn(
          "array_append",
          Sequelize.col("blacklisted_tokens"),
          req.cookies.refresh_cookie
        ),
      },
      {
        where: { id: req.user.id },
        returning: true,
      }
    )
    if (!user[1][0].dataValues) {
      const error = new MyError("User not found", 404)
      throw error
    }
    req.logout()

    res.status(200).json({
      message: "Logged out",
    })
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
    return err
  }
}
