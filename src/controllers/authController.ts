import { NextFunction } from "express"
import { JwtPayload } from "jsonwebtoken"
import { Sequelize } from "sequelize"
import { validationResult } from "express-validator"
import bcrypt from "bcryptjs"

const db = require("../../models")
import { decodeToken } from "../utils/jwtHelpers"
import createTokens from "../actions/loginUser"
import { getExpiry } from "../utils/cookieHelpers"
import { FilteredUserInterface, MyError, UserInterface } from "../utils/types"
import {
  sendPasswordResetMail,
  sendPasswordUpdateMail,
  sendVerificationMail,
} from "../actions/sendEmails"
import filterUser from "../actions/filterUser"

export const postLogin = async (req: any, res: any, next: NextFunction) => {
  try {
    const { token, refreshToken } = createTokens(req.user)
    const expiry = getExpiry()

    const user: FilteredUserInterface = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    }

    res
      .cookie("refresh_cookie", refreshToken, {
        expires: expiry,
        httpOnly: true,
        // sameSite: "None",
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

export const postResendVerificationMail = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  try {
    sendVerificationMail(req.user)
    res.status(200).json({
      message: "Verification email resent successfully",
    })
  } catch (err: any) {
    if (!err.statuscode) {
      err.statusCode = 500
    }
    next(err)
    return err
  }
}

export const patchVerifyEmail = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  try {
    const token: string = req.body.token
    const decodedToken = decodeToken(
      token,
      process.env.VERIFY_JWT_SECRET as string
    ) as JwtPayload

    const userId = decodedToken.userId

    const updatedUser = await db.User.update(
      {
        email_verified_at: new Date(),
      },
      {
        where: { id: userId },
        returning: true,
      }
    )
    if (!updatedUser[1][0].dataValues) {
      const error = new MyError("Verification failed", 500)
      throw error
    }
    const FilteredUserInterface = filterUser(updatedUser[1][0].dataValues)

    res.status(200).json({
      message: "Email successfully verified",
      user: FilteredUserInterface,
    })
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
    return err
  }
}

export const postPasswordReset = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new MyError("Validation failed!", 422, errors)
      throw error
    }
    const email: string = req.body.email
    const user: UserInterface = await db.User.findOne({
      where: { email: email },
    })
    if (!user) {
      const error = new MyError("User not found!", 404)
      throw error
    }
    const token = sendPasswordResetMail(user)

    user.password_reset_token = token as string
    await user.save()

    res.status(200).json({
      message: "Reset link sent successfully",
    })
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
    return err
  }
}

export const patchPasswordUpdate = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new MyError("Validation failed!", 422, errors)
      throw error
    }
    const { token, password } = req.body
    const decodedToken = decodeToken(
      token,
      process.env.RESET_JWT_SECRET as string
    )
    const { userId } = decodedToken as JwtPayload
    const hashedPw = await bcrypt.hash(password, 12)

    const updatedUser = await db.User.update(
      {
        password: hashedPw,
        password_reset_token: null,
      },
      {
        where: {
          id: userId,
          password_reset_token: token,
        },
        returning: true,
      }
    )
    if (!updatedUser[1][0]?.dataValues) {
      const error = new Error("Password update failed!")
      throw error
    }
    sendPasswordUpdateMail(updatedUser[1][0].dataValues)

    res.status(200).json({
      message: "Password successfully updated",
    })
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
    return err
  }
}

export const postRefreshTokens = async (
  req: any,
  res: any,
  next: NextFunction
) => {}
