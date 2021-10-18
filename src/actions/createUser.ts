import bcrypt from 'bcryptjs'
import { registerUserBody, userType } from '../utils/types'

const db = require('../../models')

export default async (input: registerUserBody): Promise<userType> => {
  try {
    const hashedPw = await bcrypt.hash(input.password, 12)

    const newUser = await db.User.create({
      name: input.name,
      email: input.email,
      password: hashedPw
    })

    return newUser
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    return err
  }
}