import eventEmitter from '../listeners/emailListeners'
import { generateToken } from '../utils/jwtHelpers'
import { userType } from '../utils/types'

const sendVerificationMail = (user: userType) => {
  try {
    const token = generateToken(
      { userId: user.id },
      process.env.VERIFY_JWT_SECRET as string,
      '10m'
    )
    const verifyUrl = `${process.env.APP_FRONTEND_URL}/verify/email/?token=${token}`

    eventEmitter.emit('verifyEmail', {
      recipient: user.email,
      verifyLink: verifyUrl,
      name: user.name
    })
  } catch (err: any) {
    throw err
  }
}

export default sendVerificationMail