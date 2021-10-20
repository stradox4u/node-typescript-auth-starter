import eventEmitter from "../listeners/emailListeners"
import { generateToken } from "../utils/jwtHelpers"
import { UserInterface } from "../utils/types"

export const sendVerificationMail = (user: UserInterface) => {
  try {
    const token = generateToken(
      { userId: user.id },
      process.env.VERIFY_JWT_SECRET as string,
      "10m"
    )
    const verifyUrl = `${process.env.APP_FRONTEND_URL}/verify/email/?token=${token}`

    eventEmitter.emit("verifyEmail", {
      recipient: user.email,
      verifyLink: verifyUrl,
      name: user.name,
    })
  } catch (err: any) {
    throw err
  }
}

export const sendPasswordResetMail = (user: UserInterface) => {
  try {
    const token = generateToken(
      { userId: user.id },
      process.env.RESET_JWT_SECRET as string,
      "10m"
    )
    const resetUrl = `${process.env.APP_FRONTEND_URL}/password/update/?token=${token}`

    eventEmitter.emit("resetPassword", {
      recipient: user.email,
      resetLink: resetUrl,
      name: user.name,
    })
    return token
  } catch (err: any) {
    throw err
  }
}

export const sendPasswordUpdateMail = (user: UserInterface) => {
  try {
    eventEmitter.emit("passwordUpdated", {
      recipient: user.email,
      name: user.name,
    })
  } catch (err: any) {
    throw err
  }
}
